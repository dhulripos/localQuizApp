import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import LoadingMotion from "./../utils/LoadingMotion";
import { Link, useParams, useNavigate } from "react-router-dom";
import useQuiz from "../hooks/useQuiz";
import { useLocation } from "react-router-dom";
import { Button, Modal, Card, Row, Col } from "react-bootstrap";
import { loginUserState, urlState } from "../recoils/recoilState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import AppHeader from "../common/AppHeader";

export default function QuizDetailReview() {
  const userInfo = useRecoilValue(loginUserState);
  const navigate = useNavigate();

  // ホーム画面のURLを管理するアトム
  const setUrlState = useSetRecoilState(urlState);

  const location = useLocation();
  console.log("location.search: " + location.search);

  const quizId = location.search.split("=")[1];

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
  // クイズデータを取得する
  const getDetailReview = useQuiz("getDetailReview");
  const { data: reviewQuiz, isLoading } = useQuery({
    queryKey: ["review", quizId],
    queryFn: () => getDetailReview(quizId),
  });

  // WikipediaのURLを取得
  const getWikipediaUrl = useQuiz("getWikipediaUrl");
  const { data: wikipediaUrl } = useQuery({
    queryKey: ["wikipediaUrl", reviewQuiz?.answer],
    queryFn: () => getWikipediaUrl(reviewQuiz?.answer),
  });

  // 答えのワードを別タブでGoogle検索する
  const handleSearchOnGoogle = () => {
    // Googleの検索URLを設定します
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      reviewQuiz?.answer
    )}`;

    // 新しいタブでGoogle検索を開きます
    window.open(googleSearchUrl, "_blank");
  };

  // 答えのワードを別タブでWikipedia検索する
  const handleSearchOnWikipedia = () => {
    // Googleの検索URLを設定します
    const wikipediaSearchUrl = `https://ja.wikipedia.org/wiki/${encodeURIComponent(
      reviewQuiz?.answer
    )}`;

    // 新しいタブでGoogle検索を開きます
    window.open(wikipediaSearchUrl, "_blank");
  };

  // 明細画面に入ったらホーム画面のURLを消す
  useEffect(() => {
    setUrlState("");
  });

  if (isLoading) {
    return <LoadingMotion />;
  }

  const handleBackToSearch = () => {
    window.history.back();
  };

  return (
    <div className="container mt-5">
      <AppHeader />
      <Row className="justify-content-md-center" style={{ marginTop: "10%" }}>
        <Col md="12">
          <Card className="text-center">
            <Card.Body>
              <Card.Title style={{ fontSize: "50px" }}>
                {reviewQuiz?.quiz}
              </Card.Title>
              <Card.Text>
                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "35px" }}>{reviewQuiz?.answer}</p>
                </div>
                <p style={{ fontSize: "25px" }}>
                  ジャンル：{reviewQuiz?.genreName}
                </p>
                {/* Googleボタン */}
                <button
                  className="btn btn-outline-info me-1"
                  style={{
                    fontSize: "20px",
                    textTransform: "none", // テキストの大文字化を無効にする
                    transition:
                      "background-color 0.3s, border-color 0.3s, color 0.3s",
                  }}
                  onClick={handleSearchOnGoogle}
                  // ホバー時のスタイルを適用
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#85e0e0";
                    e.target.style.borderColor = "#0056b3";
                    e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "";
                    e.target.style.borderColor = "";
                    e.target.style.color = "";
                  }}
                >
                  Google
                </button>
                {/* Wikipediaリンク */}
                <button
                  onClick={handleSearchOnWikipedia}
                  target="_blank"
                  className="btn btn-outline-info ms-3"
                  style={{
                    fontSize: "20px",
                    textTransform: "none", // テキストの大文字化を無効にする
                    transition:
                      "background-color 0.3s, border-color 0.3s, color 0.3s",
                  }}
                  // ホバー時のスタイルを適用
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#85e0e0";
                    e.target.style.borderColor = "#0056b3";
                    e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "";
                    e.target.style.borderColor = "";
                    e.target.style.color = "";
                  }}
                >
                  Wikipedia
                </button>
              </Card.Text>
              <Button
                onClick={handleBackToSearch}
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
                クイズ復習画面へ戻る
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
