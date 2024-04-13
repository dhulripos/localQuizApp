import { useEffect } from "react";
import useAxios from "../hooks/useAxios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginUserState } from "../recoils/recoilState";
import { Outlet, useNavigate } from "react-router-dom";

export default function Authentication() {
  const loginUser = useRecoilValue(loginUserState);
  const setLoginUser = useSetRecoilState(loginUserState);
  const axios = useAxios();
  const navigate = useNavigate();

  const getLogin = async () => {
    try {
      const res = await axios.get("/user/login");
      if (res.data.userId === undefined) {
        navigate("/quiz-app/login?status=sessionExpired");
      }
    } catch (error) {
      if (error.response.status === 401) {
        // バックエンドから401が返された場合の処理を記述
        setLoginUser({});
        console.log("認証エラーが発生しました。");
        navigate("/quiz-app/login?status=sessionExpired");
        // ユーザーにエラーメッセージを表示したり、リダイレクトしたりするなどの処理を追加
      } else {
        // その他のエラーが発生した場合の処理
        console.error("エラーが発生しました:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getLogin();
      if (loginUser.userId === undefined) {
        await axios.get("logout");
        navigate("/quiz-app/login?status=sessionExpired");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // このif文コメントアウトしたらログイン後の画面が表示されなくなった
  if (!loginUser?.[2]) {
    return <Outlet />;
  }
}
