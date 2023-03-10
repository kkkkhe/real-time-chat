import { SessionUser } from "@/shared/api/auth";
import axios from "axios";

export const register = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const data = await axios.post<SessionUser>(
    "http://localhost:3001/signup",
    {
      username,
      password,
    },
    { withCredentials: true }
  );
  return data;
};
