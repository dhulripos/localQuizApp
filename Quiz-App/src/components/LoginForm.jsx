import { useRef, useState, useEffect } from "react";
import useLogin from "../hooks/useLogin";
import { Link, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loginUserState } from "../recoils/recoilState";

export default function LoginForm() {
  const userInfo = useRecoilValue(loginUserState);

  //   //フォーム用
  const userIdRef = useRef();
  const userPassRef = useRef();

  // アラート用ステート
  const [showAlert, setShowAlert] = useState(false);
  const [validated, setValidated] = useState(false);

  // ログインに失敗した時に出すエラーメッセージを制御するステート
  const [isFailedToLogin, setIsFailToLogin] = useState(false);
  const sendCredentials = useLogin();

  // ユーザー作成に成功してログイン画面に遷移してきた場合、指定のメッセージを出力するフラグを管理するステート
  const [isSuccessToAddUser, setIsSuccessToAddUser] = useState(false);
  // セッションが切れてログイン画面に遷移した場合、指定のメッセージを出す
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  // ログアウトボタン押下で遷移してきたとき
  const [isLogout, setIsLogout] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const navigate = useNavigate();

  console.log("location.hash: " + location.hash);
  console.log("location.pathname: " + location.pathname);
  console.log("location.search: " + location.search);
  console.log("searchParams: " + searchParams.get("param"));

  // 右クリックを無効化する関数
  function disableRightClick(event) {
    event.preventDefault(); // デフォルトの右クリックの動作をキャンセル
  }
  // ページが読み込まれたときに右クリックを無効化する
  window.onload = function () {
    document.addEventListener("contextmenu", disableRightClick); // document全体に対して右クリックイベントを無効化する
  };

  // F12キーのキーコード
  const F12_KEYCODE = 123;
  // キーボードイベントを処理する関数
  function handleKeyPress(event) {
    // 押されたキーのキーコードがF12キーと一致するかを確認
    if (event.keyCode === F12_KEYCODE) {
      event.preventDefault(); // デフォルトの動作をキャンセル
      return false; // イベントの伝播を停止
    }
  }
  document.addEventListener("keydown", handleKeyPress); // document全体に対してkeydownイベントを監視する

  // ctrl+shift+Iでディベロッパーツールを起動するのを無効化する
  window.oncontextmenu = function () {
    return false;
  };
  document.addEventListener(
    "keydown",
    function (event) {
      var key = event.key;

      if (
        (event.ctrlKey && event.shiftKey && key === "I") ||
        (event.ctrlKey && event.shiftKey && key === "J")
      ) {
        event.preventDefault();
        return false;
      }
    },
    false
  );
  // テキスト選択を禁止
  document.addEventListener("selectstart", function (event) {
    event.preventDefault();
  });
  // 画像のドラッグコピーを禁止
  document.addEventListener("dragstart", function (event) {
    var targetElement = event.target;
    if (targetElement.tagName === "IMG") {
      event.preventDefault();
    }
  });

  useEffect(() => {
    if (location.search === "?status=addUser") {
      // 「ユーザー作成が完了しました。ログインしてください。」というメッセージを表示する
      setIsSuccessToAddUser(true);
    } else if (location.search === "?status=sessionExpired") {
      setIsSessionExpired(true);
    } else if (location.search === "?status=logout") {
      setIsLogout(true);
    }
  }, []);

  // ログイン中にログイン画面が呼び出された場合
  useEffect(() => {
    if (userInfo?.userId !== undefined) {
      navigate("/quiz/home");
    }
  }, []);

  // ログインボタン押下時
  const loginHandler = async (e) => {
    // 「ユーザー作成が完了しました。ログインしてください。」というメッセージを非表示にする
    if (isSuccessToAddUser) {
      setIsSuccessToAddUser(false);
    }
    //
    if (isSessionExpired) {
      setIsSessionExpired(false);
    }

    setShowAlert(false);
    setIsFailToLogin(false);
    e.preventDefault();

    // Form validation
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // ログインID、パスワードの送信
    const id = userIdRef.current.value;
    const pass = userPassRef.current.value;

    const data = await sendCredentials(id, pass);

    console.log(data);
    if (data === "login succeeded") {
      navigate("/quiz/home");
    } else {
      // 「ユーザーIDまたはパスワードが違います。」というメッセージを表示する
      setIsFailToLogin(true);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="login-form-wrapper m-5"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="container m-5"
        style={{ width: "500px", transform: "translateY(-50px)" }}
      >
        <div className="text-center ">
          <h1 className="logo m-4">ログイン</h1>

          {/* ユーザー作成から遷移した場合 */}
          {isSuccessToAddUser && (
            <div
              style={{
                backgroundColor: "#66ccff",
                padding: "15px",
                border: "1px solid #f5c6cb",
                borderRadius: "5px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              <h4 style={{ marginBottom: "10px", marginTop: "0" }}>
                ユーザー作成が完了しました。
              </h4>
              <h5 style={{ marginTop: "5px", marginBottom: "0" }}>
                ログインしてください。
              </h5>
            </div>
          )}

          {/* セッションが切れてログアウトしてきた場合 */}
          {isSessionExpired && (
            <div
              style={{
                backgroundColor: "#ff8080",
                // color: "white",
                padding: "15px",
                border: "1px solid #f5c6cb",
                borderRadius: "5px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              <h4 style={{ marginBottom: "10px", marginTop: "0" }}>
                セッションが切れました。
              </h4>
              <h5 style={{ marginTop: "5px", marginBottom: "0" }}>
                再度ログインしてください。
              </h5>
            </div>
          )}

          {isLogout && (
            <div
              style={{
                backgroundColor: "#00e673",
                // color: "white",
                padding: "15px",
                border: "1px solid #f5c6cb",
                borderRadius: "5px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              <h4 style={{ marginTop: "10px" }}>ログアウトしました</h4>
            </div>
          )}

          {isFailedToLogin && (
            <h4 style={{ color: "red" }}>
              ユーザーIDまたはパスワードが違います。
            </h4>
          )}
          <Form noValidate validated={validated} onSubmit={loginHandler}>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="col mb-2">
                <Form.Group as={Col} md="4" controlId="validationCustom01">
                  <Form.Control
                    required
                    type="text"
                    placeholder="ユーザーID"
                    style={{ width: "500px", textAlign: "center" }}
                    ref={userIdRef}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ marginLeft: "14px" }}
                  >
                    ユーザーIDを入力してください。
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group as={Col} md="4" controlId="validationCustom02">
                  <Form.Control
                    required
                    type="password"
                    placeholder="パスワード"
                    style={{ width: "500px", textAlign: "center" }}
                    ref={userPassRef}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ marginLeft: "14px" }}
                  >
                    パスワードを入力してください。
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="row mb-3 mt-2">
                <br />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginTop: "15px", fontSize: "16px" }}
                >
                  ログイン
                </button>
              </div>
            </div>
          </Form>

          <hr className="mb-3" />
          <p>アカウントをお持ちでない場合</p>
          <Link
            to="/register/user"
            className="btn btn-primary"
            style={{ fontSize: "16px" }}
          >
            新規登録
          </Link>
        </div>
      </div>

      <div>
        <style>
          {`
          hr {
            width:100;
            margin:auto;
          }
          .form-control{
            margin: 15px;
          }
        `}
        </style>
      </div>
    </div>
  );
}
