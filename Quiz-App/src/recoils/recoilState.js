import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

//アトムはログイン状態を管理する
export const loginUserState = atom({
  key: "loginUserState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const pageNumState = atom({
  key: "pageNumState",
  default: 1,
  effects_UNSTABLE: [persistAtom],
});

export const searchPageNumState = atom({
  key: "searchPageNumState",
  default: 1,
  effects_UNSTABLE: [persistAtom],
});

//検索画面で入力された文字を管理する
export const searchWordStateAtom = atom({
  key: "searchWordStateAtom",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const urlState = atom({
  key: "urlState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const quizAnswerUrlState = atom({
  key: "quizAnswerUrlState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
