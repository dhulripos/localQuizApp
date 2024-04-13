import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useQuiz from "../hooks/useQuiz";
import LoadingMotion from "../utils/LoadingMotion";
import useLogout from "../hooks/useLogout";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  loginUserState,
  urlState,
  quizAnswerUrlState,
} from "../recoils/recoilState";

import Chart from "chart.js/auto";

export default function QuizHome({}) {
  const navigate = useNavigate();

  const userInfo = useRecoilValue(loginUserState);
  const [quizAnswerUrl, setQuizAnswerUrl] = useRecoilState(quizAnswerUrlState);
  const [isReload, setIsReload] = useState(false);
  const logout = useLogout();

  const location = useLocation();

  // URLを管理するアトム
  const setUrlState = useSetRecoilState(urlState);

  const [isSuccessToUpdateUserInfo, setIsSuccessToUpdateUserInfo] =
    useState(false); //「ユーザー情報の更新が完了しました。」というメッセージを表示する

  const [isChartReady, setIsChartReady] = useState(false); // グラフの描画が完了したかどうかを管理するフラグ

  // リンクに埋め込むジャンルIDを管理するステート
  const [genreId, setGenreId] = useState(0);
  // リンクに埋め込む問題数を管理するステート
  const [num, setNum] = useState(5);

  // クイズ回答画面から戻ってきたらリロードする
  useEffect(() => {
    const regex = /\/quiz\/answer/; // 「/quiz/answer」にマッチする正規表現
    const match = quizAnswerUrl.match(regex); // 文字列から正規表現にマッチする部分を取得
    const result = match ? match[0] : ""; // マッチした部分を取得し、存在しない場合は空文字を返す
    console.log(result);
    if (result === "/quiz/answer") {
      setQuizAnswerUrl("");
      setIsReload(true);
    }

    if (isReload) {
      // ページをリロードする
      window.location.reload();
      setIsReload(false);
    }
  });

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

  // DBからクイズのジャンルを取得
  const getGenres = useQuiz("getGenres");
  const { data: genreList, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => getGenres(),
  });

  // 各ジャンルの正答率を取得
  const calculateGenreAccuracy = useQuiz("calculateGenreAccuracy");
  const { data: percent, isLoading: percentLoading } = useQuery({
    queryKey: ["percent", userInfo],
    queryFn: () => calculateGenreAccuracy(),
  });

  const handleSelectOption = (e) => {
    setGenreId(e.target.value);
  };

  const handleLogout = () => {
    logout()
      .then((result) => {
        console.log(result); // "logout succeeded"が表示されます
        if (result === "logout succeeded") {
          navigate("/quiz-app/login?status=logout");
        }
      })
      .catch((error) => {
        console.error(error); // エラーが発生した場合はこちらが実行されます
      });
  };

  useEffect(() => {
    // 検索画面や復習画面(一覧)に遷移直後の処理でURLを知りたいのでホーム画面のURLをRecoilに入れる
    setUrlState(location.pathname);
  }, []);

  // QuizHome.jsxでだけ、スクロールバーを非表示にするための処理
  useEffect(() => {
    // コンポーネントがマウントされた時にbody要素にスタイルを適用する
    document.body.style.overflow = "hidden";

    // コンポーネントがアンマウントされた時にスタイルを元に戻す
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []); // useEffectを一度だけ実行するために空の依存リストを渡す

  useEffect(() => {
    if (location.search === "?status=updateUserInfo") {
      // 「ユーザー情報の更新が完了しました。」というメッセージを表示する
      setIsSuccessToUpdateUserInfo(true);
    }
  }, []);

  // chart.js
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    const drawChartAsync = async () => {
      if (!percentLoading && chartRef.current) {
        const ctx = chartRef.current.getContext("2d");

        // Canvas要素のサイズを変更する
        chartRef.current.width = 500;
        chartRef.current.height = 500;

        // Chartを破棄する
        if (chartInstance) {
          chartInstance.destroy();
        }

        // Chart.jsのデフォルトのフォントサイズを変更
        Chart.defaults.font.size = 16;

        // 新しいChartを作成する
        chartInstance = new Chart(ctx, {
          type: "radar",
          data: {
            labels: [
              "語学・文学",
              "理系学問",
              "文化/芸術",
              "アニメ・ゲーム",
              "歴史/地理/社会",
              "ライフスタイル",
              "芸能",
              "グルメ",
              "スポーツ",
              "その他",
            ],
            datasets: [
              {
                label: "各ジャンルの正答率",
                data: [
                  percent?.genre1CorrectPercent,
                  percent?.genre2CorrectPercent,
                  percent?.genre3CorrectPercent,
                  percent?.genre4CorrectPercent,
                  percent?.genre5CorrectPercent,
                  percent?.genre6CorrectPercent,
                  percent?.genre7CorrectPercent,
                  percent?.genre8CorrectPercent,
                  percent?.genre9CorrectPercent,
                  percent?.genre10CorrectPercent,
                ],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              r: {
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                  stepSize: 20, // メモリの間隔を調整
                  font: {
                    size: 20, // メモリの文字のサイズ
                  },
                },
                grid: {
                  lineWidth: 2, // ラジアルグリッド線の太さ
                  color: "rgba(146, 146, 185, 0.5)", // グリッドの色
                },
                angleLines: {
                  lineWidth: 2, // 角度線の太さ
                  color: "rgba(146, 146, 185, 0.5)", // 角度線の色
                },
                pointLabels: {
                  font: {
                    size: 20,
                  },
                },
              },
            },
          },
        });

        return new Promise((resolve) => {
          chartInstance?.render(); // グラフを描画
          chartInstance?.update(); // グラフを更新
          chartInstance?.render(); // グラフを再描画
          resolve(); // Promiseを解決して次の処理へ進む
        });
      }
    };

    const waitForChart = async () => {
      await drawChartAsync(); // グラフの描画が完了するまで待機
      setIsChartReady(true); // グラフの描画が完了したらフラグを立てる
    };

    waitForChart(); // グラフの描画が完了するまで待機
  }, [percentLoading]);

  if (isLoading) {
    return <LoadingMotion />;
  }

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <div>
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
          <h1 style={{ paddingTop: "10px" }}>ホーム</h1>
          {/* ユーザー編集から遷移した場合 */}
          {isSuccessToUpdateUserInfo && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "20px",
                  backgroundColor: "#4d4dff",
                  borderRadius: "10px",
                  padding: "10px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  display: "inline-block",
                }}
              >
                ユーザー情報の更新が完了しました。
              </span>
            </div>
          )}
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
                transition:
                  "background-color 0.3s, color 0.3s, border-color 0.3s",
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
                transition:
                  "background-color 0.3s, color 0.3s, border-color 0.3s",
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
                transition:
                  "background-color 0.3s, color 0.3s, border-color 0.3s",
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
                transition:
                  "background-color 0.3s, color 0.3s, border-color 0.3s",
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
                transition:
                  "background-color 0.3s, color 0.3s, border-color 0.3s",
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
      </div>

      {/* レーダーチャート */}
      <div style={{ display: "flex" }}>
        <div
          style={{
            marginTop: "120px",
            marginLeft: "220px",
          }}
        >
          {!percentLoading && (
            <canvas
              ref={chartRef}
              style={{ width: "650px", height: "500px" }}
            />
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "30px",
              }}
            >
              <div style={{ border: "2px solid #333", padding: "30px 50px" }}>
                <div
                  style={{
                    margin: "30px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: "10px", fontSize: "20px" }}>
                    ジャンル：
                  </span>
                  <select
                    name="genre-list"
                    onChange={handleSelectOption}
                    style={{ fontSize: "20px", width: "200px" }}
                  >
                    {genreList?.map((genre, index) => (
                      <option key={index} value={genre?.genreId}>
                        {genre?.genreName}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  style={{
                    margin: "30px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      marginRight: "10px",
                      width: "135px",
                      fontSize: "20px",
                    }}
                  >
                    問題数：
                  </span>
                  <input
                    type="number"
                    min={5}
                    max={15}
                    value={num === NaN ? 0 : num}
                    onChange={(e) => {
                      let inputValue = parseInt(e.target.value);
                      // 入力がNaNの場合、または入力が5未満の場合は5に設定
                      inputValue =
                        isNaN(inputValue) || inputValue < 5 ? 5 : inputValue;
                      // 入力が15を超える場合は15に設定
                      inputValue = inputValue > 15 ? 15 : inputValue;
                      setNum(inputValue);
                    }}
                    onPaste={(e) => e.preventDefault()} // コピーアンドペーストを禁止
                    style={{ width: "100%", fontSize: "20px" }}
                  />
                </div>
                <div
                  style={{
                    margin: "30px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <Link
                      to={`/quiz/answer/${genreId}/${num}`}
                      className="btn-outline-dark rounded btn-lg"
                      style={{ fontSize: "30px" }}
                    >
                      クイズ回答モード
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
