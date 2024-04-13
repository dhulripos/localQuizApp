import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { loginUserState } from "../recoils/recoilState";

export default function Restricted({ children }) {
  const loginUser = useRecoilValue(loginUserState);
  // console.log("Restricted loginUser: " + loginUser.userId);

  if (loginUser?.userId === undefined) {
    return <Navigate to="/quiz-app/login" replace />;
  }

  return <div>{children}</div>;
}
