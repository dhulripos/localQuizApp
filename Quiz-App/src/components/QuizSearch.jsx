import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoadingMotion from "./../utils/LoadingMotion";
import useQuiz from "../hooks/useQuiz";
import { hover } from "../hover.css";
import useLogout from "../hooks/useLogout";
import Pagination from "../common/Pagination";
import {
  searchPageNumState,
  searchWordStateAtom,
  urlState,
  loginUserState,
} from "../recoils/recoilState";
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
  const [searchPageNum, setPageNum] = useRecoilState(searchPageNumState);

  // 検索ワードが空文字のときに何も表示させないようにするフラグ
  // 検索ワードの文字が空文字か否かを判定。true=空文字じゃない、false=空文字
  const [isNotEmptySearchWord, setIsNotEmptySearchWord] = useState();

  // Recoilで管理してる検索ワード
  const [searchWordState, setSearchWordState] =
    useRecoilState(searchWordStateAtom);

  // Recoilで管理してるホーム画面のURL
  // const homeUrl = useRecoilValue(urlState);

  const [searchWord, setSearchWord] = useState("");
  // 検索ボタン押下後、ヒットするデータがなかった場合のワーニングの表示を管理するステート
  const [isWarning, setIsWarning] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // console.log("homeUrl: " + homeUrl);

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

  const getSearch = useQuiz("getSearch");
  // クエリのトリガーを制御するためにenabledオプションを使用
  const {
    data: searchList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchList", page, searchWord],
    queryFn: () => getSearch(page, searchWord),
    enabled: false, // 初回は実行しない
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

  console.log("searchWord: " + searchWord); // ホーム画面から遷移直後は空文字となっている。
  console.log("Recoilのやつ searchWordState: " + searchWordState);
  // 上記の結果にもかかわらずキャッシュに残ってるから直近で検索したデータがホーム画面から遷移直後に表示されてる
  // 検索ボタン押下時の処理
  // 別の検索をして2ページ目以降に行った後に検索しなおしたときにデータが取れていない
  // 原因：検索ワードが変わっても現在のページ数が変わっていないため、データが取得できていない
  const handleSearchSubmit = () => {
    console.log(searchWord);

    if (searchWord === "") {
      console.log("空文字");
    } else {
      // クエリを手動で実行
      console.log("DB検索");
      setSearchWordState(searchWord); // 検索ボタンが押されたらRecoilに検索ワードを入れる
      navigate(`/quiz/search?word=${searchWord}`); // キャッシュに残ってるから304って言われてる?
      setPage(1); // バグの対策
      refetch();
    }
  };

  // 明細画面に遷移
  const handleSearchDetail = (index) => {
    navigate(`/quiz/search/detail?quizId=${searchList[index]?.quizId}`);
  };

  // ホーム画面から検索画面に遷移したか、明細画面から戻ってきたかで処理を分ける
  useEffect(() => {
    // console.log("useEffect");
    // if (homeUrl === "/quiz/home") {
    //   console.log("ホーム画面から検索画面に遷移してきたよ");
    //   setSearchWord("");
    //   setSearchWordState("");
    //   setPage(1); // 現在のページ数を1にする
    //   setPageNum(1); // recoilで管理してるページ数を1にする
    // } else {
    console.log("検索画面から明細画面→明細画面から検索画面");
    setSearchWord(searchWordState); // 検索ワードを復活させる
    setPage(searchPageNum); // recoilで管理してるページ数を現在のページ数にセット
    refetch();
    // }
  }, []);

  // 検索ワードが空文字なら表示で使ってるmap関数を動かさない
  useEffect(() => {
    if (searchWord === "") {
      setIsNotEmptySearchWord(false); // 空文字じゃないよね？→いや、空文字やで
    } else {
      setIsNotEmptySearchWord(true); // 空文字じゃないよね？→うん、空文字じゃないで
    }
  }, [searchWord]);

  // ページが変わったときにデータを取得する
  useEffect(() => {
    refetch();
  }, [page]);

  //   if (isLoading) {
  //     return <LoadingMotion />;
  //   }
  return (
    <section>
      <AppHeader />
      <MDBContainer>
        <MDBRow className="justify-content-center align-items-center">
          <MDBCol>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "8%",
              }}
            >
              <form style={{ margin: "0 auto" }}>
                <input
                  id="searchInput"
                  type="text"
                  style={{
                    width: "400px",
                    textAlign: "center",
                    fontSize: "20px",
                    padding: "7px 0px",
                  }}
                  value={searchWord}
                  onChange={(e) => {
                    setSearchWord(e.target.value);
                    setSearchWordState(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Enterキーのデフォルトの動作を無効にする
                    }
                  }}
                  placeholder="問題または答えを入力"
                />
                <input
                  type="button"
                  value="検索"
                  onClick={handleSearchSubmit}
                  style={{
                    width: "150px",
                    fontSize: "20px",
                    textAlign: "center",
                    marginLeft: "10px",
                  }}
                  className="btn-outline-dark rounded"
                />
              </form>
            </div>
            <MDBTable responsive>
              <MDBTableHead>
                {Array.isArray(searchList) &&
                  searchList.length > 0 &&
                  isNotEmptySearchWord && (
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
                {(() => {
                  console.log(searchList?.length);
                  return (
                    <div
                      className="mb-0"
                      style={{
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      {(!isNotEmptySearchWord || searchList?.length === 0) && (
                        <div
                          className="alert alert-danger"
                          role="alert"
                          style={{
                            color: "black",
                            borderRadius: "5px",
                            fontSize: "30px",
                            marginTop: "20px",
                          }}
                        >
                          <i className="fas fa-exclamation-circle mr-2"></i>
                          クイズを検索してください。
                        </div>
                      )}
                      {isNotEmptySearchWord &&
                        searchList?.length === undefined && (
                          <div
                            className="alert alert-danger"
                            role="alert"
                            style={{
                              color: "black",
                              borderRadius: "5px",
                              fontSize: "30px",
                              marginTop: "20px",
                            }}
                          >
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            条件に該当するクイズがありません。
                          </div>
                        )}
                    </div>
                  );
                })()}

                {Array.isArray(searchList) &&
                  searchList?.length > 0 &&
                  isNotEmptySearchWord &&
                  searchList?.map((search, index) => (
                    <tr
                      onClick={() => handleSearchDetail(index)}
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
                        {(() => {
                          // 検索ワードを正規表現にエスケープ
                          const escapedSearchWord = searchWord.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                          );
                          // 検索ワードにマッチする部分文字列をすべて抽出
                          const regex = new RegExp(escapedSearchWord, "gi");
                          const parts = search?.quiz.split(regex);
                          console.log(parts);
                          // 検索ワードが文章に含まれない場合
                          if (parts.length === 1) {
                            return <>{search?.quiz}</>;
                          }
                          // 検索ワードが文章中に含まれる場合
                          else {
                            return (
                              <>
                                {parts.map((part, index) => (
                                  <React.Fragment key={index}>
                                    {part}
                                    {index < parts.length - 1 && (
                                      <span style={{ color: "red" }}>
                                        {searchWord}
                                      </span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </>
                            );
                          }
                        })()}
                      </th>
                      <td
                        id="genreNameCell"
                        style={{
                          fontSize: "25px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {search?.genreName}
                      </td>
                      <td
                        style={{
                          fontSize: "25px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {(() => {
                          const parts = search?.answer.split(searchWord);
                          console.log(parts);
                          // 検索ワードと答えが同じ文字列
                          if (searchWord === search?.answer) {
                            return (
                              <>
                                <span style={{ color: "red" }}>
                                  {search?.answer}
                                </span>
                              </>
                            );
                          }
                          // 答え「富士山」で、検索ワード「山」の場合
                          else if (parts.length > 1 && parts[1] === "") {
                            return (
                              <>
                                {parts[0]}
                                <span style={{ color: "red" }}>
                                  {searchWord}
                                </span>
                              </>
                            );
                          }
                          // 答え「富士山」で、検索ワード「富」の場合
                          else if (parts.length > 1 && parts[0] === "") {
                            return (
                              <>
                                <span style={{ color: "red" }}>
                                  {searchWord}
                                </span>
                                {parts[1]}
                              </>
                            );
                          }
                          // 検索ワードと文字列が違う文字列
                          else if (parts[0] === search?.answer) {
                            return <>{search?.answer}</>;
                          }
                          // 答え「富士山」で、検索ワード「士」の場合
                          else {
                            return (
                              <>
                                {parts[0]}
                                <span style={{ color: "red" }}>
                                  {searchWord}
                                </span>
                                {parts[1]}
                              </>
                            );
                          }
                        })()}
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
                {/* <div>
                  <Link
                    to="/quiz/home"
                    style={{
                      fontSize: "20px",
                      padding: "10px 60px",
                      textDecoration: "none",
                      color: "black",
                      backgroundColor: "white",
                      borderRadius: "5px",
                      textAlign: "center",
                      transition:
                        "background-color 0.3s, color 0.3s, border-color 0.3s",
                      border: "2px solid black",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#000";
                      e.target.style.color = "#fff";
                      e.target.style.borderColor = "#000";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "white";
                      e.target.style.color = "black";
                      e.target.style.borderColor = "black";
                    }}
                  >
                    ホーム画面に戻る
                  </Link>
                </div> */}
                <div style={{ marginLeft: "auto" }}>
                  {Array.isArray(searchList) &&
                    searchList?.length > 0 &&
                    isNotEmptySearchWord && (
                      <div style={{ marginRight: "480px" }}>
                        <Pagination
                          setPage={setPage}
                          totalPages={searchList[0]?.totalPages}
                          currentPage={page}
                          setRecoilPage={setPageNum}
                        />
                      </div>
                    )}
                </div>
              </div>
            </MDBCardBody>
          </div>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
