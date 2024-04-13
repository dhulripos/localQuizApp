import Restricted from "../common/Restricted";
import { Outlet } from "react-router-dom";
import { loginUserState } from "../recoils/recoilState";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export default function Quiz() {
  return (
    <>
      <Restricted />
      <Outlet />
    </>
  );
}
