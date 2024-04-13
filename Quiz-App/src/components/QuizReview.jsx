import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoadingMotion from "./../utils/LoadingMotion";
import useQuiz from "../hooks/useQuiz";
import { useSetRecoilState } from "recoil";
import { hover } from "../hover.css";
import Pagination from "../common/Pagination";
import useLogout from "../hooks/useLogout";
import { pageNumState, urlState, loginUserState } from "../recoils/recoilState";
import {
  MDBBtn,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBCardImage,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import AppHeader from "../common/AppHeader";

export default function QuizReview() {
  const userInfo = useRecoilValue(loginUserState);
  const logout = useLogout();

  const [page, setPage] = useState(1);
  const [pageNum, setPageNum] = useRecoilState(pageNumState);

  // Recoilで管理してるホーム画面のURL
  const homeUrl = useRecoilValue(urlState);

  const navigate = useNavigate();

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
  // document全体に対してkeydownイベントを監視する
  document.addEventListener("keydown", handleKeyPress);

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

  const getReview = useQuiz("getReview");
  const { data: reviewList, isLoading } = useQuery({
    queryKey: ["review", page],
    queryFn: () => getReview(page),
  });

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

  const handleDetailReview = (index) => {
    navigate(`/quiz/detail/review?quizId=${reviewList[index]?.quizId}`);
  };

  // ホーム画面から検索画面に遷移したか、明細画面から戻ってきたかで処理を分ける
  useEffect(() => {
    console.log("useEffect");
    // if (homeUrl === "/quiz/home") {
    //   console.log("ホーム画面から検索画面に遷移してきたよ");
    //   setPage(1); // 現在のページ数を1にする
    //   setPageNum(1); // recoilで管理してるページ数を1にする
    // } else {
    console.log("検索画面から明細画面→明細画面から検索画面");
    setPage(pageNum); // recoilで管理してるページ数を現在のページ数にセット
    //   refetch();
    // }
  }, []);

  if (isLoading) {
    return <LoadingMotion />;
  }

  return (
    <section>
      <AppHeader />
      <MDBContainer>
        <MDBRow className="justify-content-center align-items-center">
          <MDBCol>
            <MDBTable style={{ marginTop: "100px" }} responsive>
              <MDBTableHead>
                {reviewList[0]?.quiz && (
                  <tr>
                    <th
                      scope="col"
                      style={{
                        width: "650px",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      問題
                    </th>
                    <th
                      scope="col"
                      style={{
                        width: "190px",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      ジャンル
                    </th>

                    <th
                      scope="col"
                      style={{
                        width: "270px",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      答え
                    </th>
                  </tr>
                )}
              </MDBTableHead>
              <MDBTableBody>
                {Array.isArray(reviewList) &&
                  reviewList?.map((review, index) => (
                    <tr
                      onClick={() => handleDetailReview(index)}
                      key={index}
                      className="hover-row"
                    >
                      <th
                        scope="row"
                        style={{
                          fontSize: "25px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {review?.quiz}
                      </th>
                      <td
                        style={{
                          fontSize: "25px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {review?.genreName}
                      </td>
                      <td
                        style={{
                          fontSize: "25px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {review?.answer}
                      </td>
                    </tr>
                  ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>

          <div className="d-flex justify-content-between align-items-end">
            <MDBCardBody
              className="mt-2 ms-5"
              style={{ marginBottom: "160px", marginLeft: "-10px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                {/* 横並びにするために中央揃えに変更 */}

                {(() => {
                  const isExist =
                    reviewList[0]?.quiz === undefined ? true : false;
                  return (
                    <div style={{ fontWeight: "500", marginLeft: "15%" }}>
                      {isExist && (
                        <div
                          className="alert alert-danger"
                          style={{ color: "black" }}
                        >
                          復習するクイズがありません。
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div style={{ marginLeft: "auto" }}>
                  <div style={{ marginRight: "450px" }}>
                    <Pagination
                      setPage={setPage}
                      totalPages={reviewList[0]?.totalPages}
                      currentPage={page}
                      setRecoilPage={setPageNum}
                    />
                  </div>
                </div>
              </div>
            </MDBCardBody>
          </div>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
