import { useContext } from "react";
import UserContext from "./UserInfo";

export const useUser = () => useContext(UserContext);
