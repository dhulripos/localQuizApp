import useAxios from "./useAxios";

export default function useUser(action) {
  // API通信を行うためのフック
  const axios = useAxios();

  switch (action) {
    case "addUser":
      return async (userInfo) => addUser(axios, userInfo);
    case "updateUser":
      return async (data) => updateUser(axios, data);
    case "getUserInfoById":
      return async () => getUserInfoById(axios);
    default:
      return;
  }
}

//ユーザーの追加を行う処理
async function addUser(axios, userInfo) {
  try {
    const res = await axios.post("/add/user", userInfo);
    console.log(res);
    return res;
  } catch (error) {
    return error;
  }
}

//ユーザーの情報を更新する処理
async function updateUser(axios, data) {
  try {
    const res = await axios.put(`/edit/user`, data);
    return res;
  } catch (error) {
    return error;
  }
}

//ユーザーの情報を取得する処理
async function getUserInfoById(axios) {
  try {
    const res = await axios.get(`/get/userInfo`);
    return res.data;
  } catch (error) {
    return error;
  }
}
