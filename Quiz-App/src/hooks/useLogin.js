import useAxios from "../hooks/useAxios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginUserState } from "../recoils/recoilState";

export default function useLogin() {
  const setLoginUser = useSetRecoilState(loginUserState);

  const axios = useAxios();

  const sendCredentials = async (id, pass) => {
    try {
      // ログイン情報送信
      const res = await axios.post(`/user/login?userId=${id}&pass=${pass}`);

      console.log(res);
      console.log(res.status);
      if (res.status !== 200) {
        return "failed to login";
      }

      // recoilにユーザーデータの保存
      setLoginUser(res.data);
      return "login succeeded";
    } catch (error) {
      return error;
    }
  };
  return sendCredentials;
}
