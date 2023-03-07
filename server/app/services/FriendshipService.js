const Friend = require("../entities/Friend/friendModel");
const User = require("../entities/User/userModel");

class FriendshipService {
    async addFriend(requesterId, recipientName){
        const recipient = await User.findOne({username: recipientName})

        // const recipientObjId = new mongoose.Types.ObjectId(recipient._id)
        // const requesterObjId = new mongoose.Types.ObjectId(requesterId)

        const docA = await Friend.findOneAndUpdate({requester: requesterId,recipient: recipient._id},{$set: {status: 'pending'}}, {upsert: true, new: true})
        const docB = await Friend.findOneAndUpdate({requester: recipient._id, recipient: requesterId}, {$set: {status: 'pending'}}, {upsert: true, new: true})
        await User.findOneAndUpdate({_id: recipient._id}, {$push: {friends: docB._id}})
        await User.findOneAndUpdate({_id: requesterId}, {$push: {friends: docA._id}})
    }

    async getFriends(userId){
        const user = await User.findOne({userId})
            .populate({
                path: 'friends',
                populate: {
                    path: 'recipient',
                    select: '-friends -passhash -_id'
                },
                match: {status: 'accepted'},
                select: ['recipient', 'status']
            })
        return user.friends
    }
    async getPendingFriends(userId){
        const user = await User.findOne({userId})
            .populate({
                path: 'friends',
                populate: {
                    path: 'recipient',
                    select: '-friends -passhash -_id'
                },
                match: {status: 'pending'},
                select: ['recipient', 'status']
            })

        return user.friends
    }
    async acceptFriendship(requesterId, recipientId){
        const requester = await User.findOne({userId: requesterId})
        const recipient = await User.findOne({userId: recipientId})

        await Friend.findOneAndUpdate({requester: requester._id,recipient: recipient._id}, {$set: {status: 'accepted'}})
        await Friend.findOneAndUpdate({requester: recipient._id, recipient: requester._id}, {$set: {status: 'accepted'}})
    }
}

module.exports = new FriendshipService()