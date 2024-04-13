// import { Link } from "react-router-dom";
// import logo from "../common/Images/logo.png";
// import { loginUserState } from "../recoils/recoilState";
// import { useRecoilValue } from "recoil";

// export default function PageNotFound() {
//   const loginUser = useRecoilValue(loginUserState);

//   return (
//     <div className="container">
//       <div className="d-flex justify-content-center m-5">
//         <img
//           src={logo}
//           alt="Logo"
//           className="img-fluid"
//           style={{
//             transform: "scale(1.5)",
//             marginBottom: "100px",
//             width: "40%",
//           }}
//         ></img>
//       </div>
//       <div className="d-flex justify-content-center">
//         <p style={{ fontSize: "50px" }}>Not Found</p>
//       </div>
//       <div className="d-flex justify-content-center">
//         <p>お探しのページは見つかりませんでした。</p>
//       </div>
//       <div className="d-flex justify-content-center">
//         {!loginUser?.[2] ? (
//           <Link
//             className="btn-outline-dark rounded btn-lg"
//             to="/"
//             style={{ marginTop: "80px", fontSize: "16px" }}
//           >
//             トップページへ
//           </Link>
//         ) : (
//           <Link
//             className="btn-outline-dark rounded btn-lg"
//             to="/home"
//             style={{ marginTop: "80px", fontSize: "16px" }}
//           >
//             ホームページへ
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }
