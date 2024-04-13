import {
  loginUserState,
  pageNumState,
  searchPageNumState,
  searchWordStateAtom,
  urlState,
  quizAnswerUrlState,
} from "./../recoils/recoilState";
import useAxios from "./useAxios";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

// ログアウト用フック
// ログイン中のユーザー情報を削除する関数

export default function useLogout() {
  // Recoilで管理しているログインユーザー情報を扱う関数を定義
  const setLoginUser = useSetRecoilState(loginUserState);
  const setPageNum = useSetRecoilState(pageNumState);
  const setSearchPageNum = useSetRecoilState(searchPageNumState);
  const setSearchWord = useSetRecoilState(searchWordStateAtom);
  const setUrl = useSetRecoilState(urlState);
  const setQuizAnswerUrl = useSetRecoilState(quizAnswerUrlState);

  // API通信を行うためのフック
  const axios = useAxios();
  // ログアウトするAPI
  const sendLogout = async () => {
    try {
      const res = await axios.get("logout");
      // 処理の中でsetLoginUserを使用してRecoilの中身を空にする
      setLoginUser({});
      setPageNum(1);
      setSearchPageNum(1);
      setSearchWord("");
      setUrl("");
      setQuizAnswerUrl("");
      if (res.data === "logout") {
        return "logout succeeded";
      } else {
        return "failed to logout";
      }
    } catch (error) {
      return error;
    }
  };

  return sendLogout;
}
