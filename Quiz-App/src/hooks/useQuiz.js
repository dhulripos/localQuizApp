import useAxios from "./useAxios";
export default function useCartApi(action) {
  const axios = useAxios();

  switch (action) {
    case "getQuizzes":
      return async (genreId, num) => getQuizzes(axios, genreId, num);
    case "getGenres":
      return async () => getGenres(axios);
    case "insertQuiz":
      return async (quiz) => insertQuiz(axios, quiz);
    case "updateQuizPoint":
      return async (userPoint) => updateQuizPoint(axios, userPoint);
    case "updateCorrectPerQuiz":
      return async (quizResults) => updateCorrectPerQuiz(axios, quizResults);
    case "getReview":
      return async (page) => getReview(axios, page);
    case "getSearch":
      return async (page, word) => getSearch(axios, page, word);
    case "getDetailReview":
      return async (quizId) => getDetailReview(axios, quizId);
    case "getSearchDetail":
      return async (quizId) => getSearchDetail(axios, quizId);
    case "calculateGenreAccuracy":
      return async () => calculateGenreAccuracy(axios);
    default:
      return;
  }
}

// ジャンルごと(0の場合はジャンルを問わず)クイズリストを取得する
export async function getQuizzes(axios, genreId, num) {
  try {
    const res = await axios.get(`/QuizList/${genreId}/${num}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

// ジャンルリストを取得する
export async function getGenres(axios) {
  try {
    const res = await axios.get("/get/genres");
    return res.data;
  } catch (error) {
    return error;
  }
}

// 間違えた問題を復習テーブルに追加する
export async function insertQuiz(axios, quiz) {
  try {
    const res = await axios.post(`/insert/quiz/for/review`, quiz);
    return res.data;
  } catch (error) {
    return error;
  }
}

// 正解した問題に応じてポイントをuser_infoテーブルに追加する
export async function updateQuizPoint(axios, userPoint) {
  try {
    const res = await axios.put(
      `/update/quiz/point/by/user?userPoint=${userPoint}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
}

// 正解した問題に応じてポイントをuser_infoテーブルに追加する
export async function updateCorrectPerQuiz(axios, quizResults) {
  try {
    const res = await axios.put(`/calc/correct/per/quiz`, quizResults);
    return res.data;
  } catch (error) {
    return error;
  }
}

// クイズ復習画面に表示するデータを取得
export async function getReview(axios, page) {
  try {
    const res = await axios.get(`/quiz/review?page=${page}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

// クイズ復習画面(一覧)からクイズIDをもとに明細画面を表示させるデータを取得
export async function getDetailReview(axios, quizId) {
  try {
    const res = await axios.get(`/quiz/detail/review?quizId=${quizId}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

// クイズ検索画面に表示するデータを取得
export async function getSearch(axios, page, word) {
  try {
    const res = await axios.get(`/quiz/search?page=${page}&word=${word}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

// クイズ検索画面からクイズIDをもとに明細画面を表示させるデータを取得
export async function getSearchDetail(axios, quizId) {
  try {
    const res = await axios.get(`/quiz/search/detail?quizId=${quizId}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

// ホーム画面で各ジャンルの正答率をレーダーチャートで表示させるのに使用するデータを取得する
export async function calculateGenreAccuracy(axios) {
  try {
    const res = await axios.get(`/genre/accuracy/calculate`);
    return res.data;
  } catch (error) {
    return error;
  }
}
