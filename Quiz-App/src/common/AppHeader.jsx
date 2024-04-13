import useLogout from "../hooks/useLogout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUserState } from "../recoils/recoilState";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";

export default function EditUser() {
  const userInfo = useRecoilValue(loginUserState);

  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();

  let headerName;

  switch (location.pathname) {
    case "/edit/user":
      headerName = "ユーザー情報変更";
      break;
    case "/quiz/review":
      headerName = "クイズ復習";
      break;
    case "/quiz/detail/review":
      headerName = "クイズ復習詳細";
      break;
    case "/quiz/search":
      headerName = "クイズ検索";
      break;
    case "/quiz/search/detail":
      headerName = "クイズ検索詳細";
      break;
    default:
      break;
  }

  const handleLogout = () => {
    logout()
      .then((result) => {
        console.log(result); // "logout succeeded"を表示
        if (result === "logout succeeded") {
          navigate("/quiz-app/login?status=logout");
        }
      })
      .catch((error) => {
        console.error(error); // エラーが発生した場合
      });
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px 20px",
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between", // 左右に要素を均等に配置
        alignItems: "center",
      }}
    >
      <h1 style={{ paddingTop: "10px" }}>{headerName}</h1>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to={`/quiz/home`}
          style={{
            margin: "0 20px",
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#ffff00"; // ホバー時の背景色を設定
            // e.target.style.color = "black"; // ホバー時の文字色を設定
            e.target.style.borderColor = "#ffff00"; // ホバー時のボーダー色を設定
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
            e.target.style.borderColor = "black";
          }}
        >
          ホーム
        </Link>
        <Link
          to={`/edit/user`}
          style={{
            margin: "0 20px",
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#ffff00"; // ホバー時の背景色を設定
            // e.target.style.color = "black"; // ホバー時の文字色を設定
            e.target.style.borderColor = "#ffff00"; // ホバー時のボーダー色を設定
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
            e.target.style.borderColor = "black";
          }}
        >
          ユーザー情報変更
        </Link>
        <Link
          to={`/quiz/review`}
          style={{
            margin: "0 20px",
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#ffff00"; // ホバー時の背景色を設定
            // e.target.style.color = "black"; // ホバー時の文字色を設定
            e.target.style.borderColor = "#ffff00"; // ホバー時のボーダー色を設定
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
            e.target.style.borderColor = "black";
          }}
        >
          クイズ復習
        </Link>
        <Link
          to={`/quiz/search`}
          style={{
            margin: "0 20px",
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#ffff00"; // ホバー時の背景色を設定
            // e.target.style.color = "white"; // ホバー時の文字色を設定
            e.target.style.borderColor = "#ffff00"; // ホバー時のボーダー色を設定
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
            e.target.style.borderColor = "black";
          }}
        >
          クイズ検索
        </Link>
        <button
          onClick={handleLogout}
          style={{
            margin: "0 20px",
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#ff99ff"; // ホバー時の背景色を設定
            // e.target.style.color = "white"; // ホバー時の文字色を設定
            e.target.style.borderColor = "#ff99ff"; // ホバー時のボーダー色を設定
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
            e.target.style.borderColor = "black";
          }}
        >
          ログアウト
        </button>
        <h2 style={{ margin: "0" }}>{`【${userInfo?.userName}】`}</h2>
      </div>
    </header>
  );
}
