import axios from "axios";
export default function useAxios() {
  //const loginUser = useRecoilValue(loginUserState);
  const ax = axios.create({
    baseURL: "http://localhost:8080/api/",
    withCredentials: true,
  });
  return ax;
}
