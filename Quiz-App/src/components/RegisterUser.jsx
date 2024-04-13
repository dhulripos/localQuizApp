import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function RegisterUser() {
  const addUser = useUser("addUser");
  const navigate = useNavigate();

  const userIdRef = useRef();
  const userNameRef = useRef();
  const PWRef = useRef();
  const cfmPWRef = useRef();

  const [isFieldsAlert, setIsFieldsAlert] = useState(false); // 全項目入力されていないときにエラーを出すフラグ
  const [isSymbolBan, setIsSymbolBan] = useState(false); // ユーザーIDの入力が不正なときにエラーを出すフラグ
  const [isInsertError, setIsInsertError] = useState(false); // insertに失敗したときにエラーを出すフラグ
  const [isPWAlert, setIsPWAlert] = useState(false); // PWとcmfPWが不一致のときにエラーを出すフラグ
  const [shouldDisabled, setShouldDisabled] = useState(false); // input要素にdisabledを付けるフラグ

  // form要素にonClickを付けることで各項目を入力するごとに値を取得できる
  // 今回はボタンに対してつける。ここは力を入れる実装ではないので！
  const onSubmit = () => {
    const userId = userIdRef.current.value;
    const userName = userNameRef.current.value;
    const userPW = PWRef.current.value;
    const cdmPW = cfmPWRef.current.value;

    setIsInsertError(false);

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

    // どれか１つでも入力されていなければ入力エラー
    if (!userId || !userName || !userPW || !cdmPW) {
      console.log("入力は全項目必須です");
      setIsPWAlert(false);
      setIsSymbolBan(false);
      setIsFieldsAlert(true);
      return;
    } else {
      setIsFieldsAlert(false);
    }

    const pattern = /^[ぁ-んァ-ン０-９a-zA-Z0-9\-一-龯ァ-ヶー]+$/;
    // ユーザーIDに記号が使用された場合のエラー
    if (
      pattern.test(userId) &&
      pattern.test(userName) &&
      pattern.test(userPW) &&
      pattern.test(cdmPW)
    ) {
    } else {
      setIsSymbolBan(true);
      return;
    }

    // userPWとcmfPWが不一致の場合
    if (userPW !== cdmPW) {
      setIsSymbolBan(false);
      setIsPWAlert(true);
      return;
    }

    setIsFieldsAlert(false);
    setIsSymbolBan(false);
    setIsPWAlert(false);
    setShouldDisabled(true);
  };

  const insertUserInfo = async (e) => {
    const userId = userIdRef.current.value;
    const userName = userNameRef.current.value;
    const userPW = PWRef.current.value;

    const userInfo = { userId, userName, userPW };
    const res = await addUser(userInfo);

    if (res?.status === 200 || res?.data === "success to insert userInfo") {
      navigate("/quiz-app/login?status=addUser");
    } else {
      setIsPWAlert(false);
      setIsInsertError(true);
      setShouldDisabled(false); // 再度入力できるようにする
    }
  };

  return (
    <div class="container">
      <div className="text" style={{ marginTop: "5%" }}>
        <center style={{ margin: "10px", fontSize: "45px" }}>
          ユーザー情報登録
        </center>

        <center>
          {isFieldsAlert && (
            <h5 style={{ color: "red" }}>すべての項目を入力してください。</h5>
          )}

          {isSymbolBan && (
            <h5 style={{ color: "red" }}>記号は入力しないでください。</h5>
          )}

          {isPWAlert && (
            <h5 style={{ color: "red" }}>
              パスワードとパスワード（確認）が異なります。
            </h5>
          )}

          {isInsertError && (
            <h5 style={{ color: "red" }}>
              ユーザー作成に失敗しました。
              <br />
              登録しようとしているユーザーは既に存在します。
            </h5>
          )}

          <form
            action="/"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "500px", // フォーム全体の幅を設定
            }}
          >
            <span>ユーザーID </span>
            <span style={{ marginBottom: "10px", color: "red" }}>
              ※ユーザーIDは登録後に変更できません。
            </span>
            <input
              type="text"
              style={{
                width: "100%", // 入力フィールドの幅を100%に設定
                padding: "10px",
                boxSizing: "border-box",
                textAlign: "center",
              }}
              minLength={1}
              maxLength={30}
              ref={userIdRef}
              disabled={shouldDisabled}
            />

            <span style={{ margin: "10px" }}>ユーザー名 </span>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
                textAlign: "center",
              }}
              minLength={1}
              maxLength={30}
              ref={userNameRef}
              disabled={shouldDisabled}
            />

            <span style={{ margin: "10px" }}>パスワード</span>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
                textAlign: "center",
              }}
              minLength={5}
              maxLength={20}
              ref={PWRef}
              disabled={shouldDisabled}
            />

            <span style={{ margin: "10px" }}>パスワード（確認）</span>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
                textAlign: "center",
              }}
              minLength={5}
              maxLength={20}
              ref={cfmPWRef}
              disabled={shouldDisabled}
            />

            {!shouldDisabled && (
              <Button
                style={{
                  marginTop: "40px",
                  fontSize: "20px",
                  padding: "10px 60px",
                }}
                onClick={onSubmit}
              >
                確認
              </Button>
            )}
            {shouldDisabled && (
              <Button
                style={{
                  marginTop: "40px",
                  fontSize: "20px",
                  padding: "10px 60px",
                }}
                onClick={insertUserInfo}
              >
                登録
              </Button>
            )}
          </form>

          {!shouldDisabled && (
            <div style={{ margin: "50px" }}>
              <Link
                to={`/quiz-app/login`}
                style={{
                  fontSize: "20px",
                  padding: "10px 60px",
                  textDecoration: "none",
                  color: "black",
                  backgroundColor: "white",
                  borderRadius: "5px",
                  textAlign: "center",
                  transition:
                    "background-color 0.3s, color 0.3s, border-color 0.3s", // ボーダーカラーのトランジションを追加
                  border: "2px solid black", // リンクのボーダーを設定
                }}
                // ホバー時のスタイルを設定
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#000";
                  e.target.style.color = "#fff";
                  e.target.style.borderColor = "#000"; // ホバーされたときのボーダーカラーを設定
                }}
                // ホバーから外れたときのスタイルを設定
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "black";
                  e.target.style.borderColor = "black"; // ホバーされていないときのボーダーカラーを設定
                }}
              >
                ログイン画面へ戻る
              </Link>
            </div>
          )}
          {shouldDisabled && (
            <Button
              style={{
                marginTop: "40px",
                fontSize: "20px",
                padding: "10px 60px",
                backgroundColor: "white",
                color: "black",
                borderRadius: "5px",
                transition:
                  "background-color 0.3s, color 0.3s, border-color 0.3s", // ボーダーカラーのトランジションを追加
                border: "2px solid black", // リンクのボーダーを設定
              }}
              // ホバー時のスタイルを設定
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#000";
                e.target.style.color = "#fff";
                e.target.style.borderColor = "#000"; // ホバーされたときのボーダーカラーを設定
              }}
              // ホバーから外れたときのスタイルを設定
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "black";
                e.target.style.borderColor = "black"; // ホバーされていないときのボーダーカラーを設定
              }}
              onClick={() => setShouldDisabled(false)}
            >
              入力し直す
            </Button>
          )}
        </center>
      </div>
    </div>
  );
}
