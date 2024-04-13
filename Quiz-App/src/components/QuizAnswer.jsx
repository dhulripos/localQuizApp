import React, { useEffect, useState } from "react";
import useQuiz from "../hooks/useQuiz";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingMotion from "../utils/LoadingMotion";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import popup from "../pop-up.css"; // 自分へ：インポートしないとcssが適用されないので消さないでね
import answerButton from "../common/Images/answer-button-images.png";
import useSound from "use-sound";
import questionSound from "../common/Audio/Quiz-Question02-1.mp3"; // 問題開始時の音声
import buttonSound from "../common/Audio/Quiz-Buzzer02-1.mp3"; // 回答するボタンが押下されたときの音声
import correctAnswerSound from "../common/Audio/Quiz-Correct_Answer01-2.mp3"; // 正解した場合の音声
import IncorrectAnswerSound from "../common/Audio/Quiz-Wrong_Buzzer02-3.mp3"; // 不正解の場合の音声
import { loginUserState, quizAnswerUrlState } from "../recoils/recoilState";
import { useRecoilValue, useSetRecoilState } from "recoil";

const QuizAnswer = () => {
  // ログイン中のユーザー情報を格納しているrecoil
  const loginUser = useRecoilValue(loginUserState);
  // クイズ回答画面からホーム画面に遷移した時にリロードするのにURLを知りたいのでクイズ回答画面のURLを格納しておく
  const setQuizAnswerUrlState = useSetRecoilState(quizAnswerUrlState);
  const location = useLocation();

  // n問目のクイズであるかステート管理するuseState。
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // 回答の何文字目が選択されているか(例：「ふじさん」の「じ」が回答中の場合、2文字目)を管理するuseState
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0);
  // 正解または不正解になった場合に結果を表示するuseState。初期値はfalse=答えを表示しない
  const [showResult, setShowResult] = useState(false);
  // n問目のクイズの回答の選択肢を配列で管理するのに使用するuseState。
  const [answerOptions, setAnswerOptions] = useState([]);
  // 全ての問題が終了したときに「お疲れさまでした」と表示するuseState。初期値はfalse=文言を表示しない
  const [quizCompleted, setQuizCompleted] = useState(false);
  // 背景を暗くするフラグを管理するuseState。初期値はfalse=暗くしない
  const [isPopUp, setIsPopUp] = useState(false);
  // 「回答する」ボタンの表示非表示を管理するuseState。初期値はtrue=表示
  const [isAnswerButton, setIsAnswerButton] = useState(true);
  // 問題の答え(DBから取得したやつを配列にしたもの=currentQuizAnswerKanaArray)を管理する配列のインデックスを管理するuseState。初期値は0
  // generateOptions関数の中で正解の文字を配列から取り出すときに使用する
  const [optionIndex, setOptionIndex] = useState(0);
  // 「正解です」「不正解です」の画面表示を制御するフラグを管理するステート。true＝正解です、false＝不正解です。
  // showResult(答えを表示するフラグ)と合わせて表示用の条件式に使用する
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  // n問目の回答に成功した回数をカウント。「ふじさん」を回答する場合、まず"1"文字目から回答を始めるため初期値には1を設定する
  // handleAnswerボタンの中でn文字目の回答に成功した回数として使ってしまっている。勘違いで当初想定していない使い方をしてしまった。
  // 問題に正解した回数を管理するステートは別で用意した
  const [countCorrect, setCountCorrect] = useState(1);
  // useEffectの中のgenerateOptions関数実行を管理するフラグ。true＝実行、false＝実行しない
  const [shouldGenerateOptions, setShouldGenerateOptions] = useState(false);
  // 問題文の表示・非表示を管理するフラグ。true＝表示、false＝非表示
  const [showText, setShowText] = useState(true);
  // displayText関数の実行・不実行を制御するフラグ。true＝関数を実行する、false＝関数を止める
  const [shouldDisplayText, setShouldDisplayText] = useState(false);
  // displayText関数内で使用するインデックス
  const [displayTextIndex, setDisplayTextIndex] = useState(0);
  // displayText関数で1文字ずつテキストを画面に表示するのに使用する文字列を格納するステート。
  const [text, setText] = useState("");
  // クイズの回答後、正解か不正かに関わらず問題文を全文表示するときに使用するフラグ。true＝問題を全文で表示,false＝1文字ずつ表示中の問題を表示
  const [isAllQuizText, setIsAllQuizText] = useState(false);
  // クイズ回答画面遷移後に"Tap To Start!!"と画面に表示させるためのフラグ。"Tap To Start!!"が左クリックされるとshouldDisplayTextをtrueにする。
  const [TapToStart, setTapToStart] = useState(true);
  // 不正解の問題を復習できるようDBに登録することを管理するステート。初期値はすべてundefined
  const [quizForReview, setQuizForReview] = useState([]);
  // addMutationを実行するuseEffectを制御するフラグを管理するステート
  const [isAddMutation, setIsAddMutation] = useState(false);
  // 問題に正解した回数を管理するステート。初期値は０問正解なので、０。
  const [answerCorrectCount, setAnswerCorrectCount] = useState(0);
  // 正解した問題に応じてポイントをつける。ポイントは１問正解で１ポイントとする
  const [userPoint, setUserPoint] = useState(0);
  // 各ジャンルの総回答数と総正解数を記録
  const [quizResults, setQuizResults] = useState({
    userId: undefined,
    genre1AllAnswerNum: 0,
    genre1CorrectNum: 0,
    genre2AllAnswerNum: 0,
    genre2CorrectNum: 0,
    genre3AllAnswerNum: 0,
    genre3CorrectNum: 0,
    genre4AllAnswerNum: 0,
    genre4CorrectNum: 0,
    genre5AllAnswerNum: 0,
    genre5CorrectNum: 0,
    genre6AllAnswerNum: 0,
    genre6CorrectNum: 0,
    genre7AllAnswerNum: 0,
    genre7CorrectNum: 0,
    genre8AllAnswerNum: 0,
    genre8CorrectNum: 0,
    genre9AllAnswerNum: 0,
    genre9CorrectNum: 0,
    genre10AllAnswerNum: 0,
    genre10CorrectNum: 0,
  });
  const [countdown, setCountdown] = useState(5); // カウントダウンで表示する数字
  const [isRunning, setIsRunning] = useState(false); // カウントダウンのuseEffectを制御するフラグ
  const [timeOver, setTimeOver] = useState(false); // カウントダウンの数字が０より小さかったら問題に不正解とするフラグ

  // ページ遷移に使用するフック
  const navigate = useNavigate();

  // カウントダウンのuseEffect
  // 回答中に5秒経ってしまったら不正解とする
  // 最後の問題に正解した場合に、一瞬「回答時間：5.00」と表示されてしまうので、このuseEffectをコードの上の方に記述することで
  // 早めに読み込ませる
  useEffect(() => {
    let timer;

    if (quizList?.length === currentQuestionIndex) {
      setIsRunning(false);
      return;
    }
    if (isRunning && countdown <= 0) {
      // カウントダウンの数字が０以下となったら不正解とする
      console.log("来てる？");
      setTimeOver(true);
      return () => clearInterval(timer);
    }
    // カウントダウンの数字が０より大きければ
    else if (isRunning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 0) {
            clearInterval(timer);
            return 0;
          }
          return parseFloat((prevCountdown - 0.01).toFixed(2));
        });
      }, 10);
    }

    return () => clearInterval(timer);
  }, [isRunning, countdown]);

  // DBからクイズリストを取得
  const getQuizzes = useQuiz("getQuizzes");
  const { genreId, num } = useParams();
  const { data: quizList, isLoading } = useQuery({
    queryKey: ["quizzes", genreId, num],
    queryFn: () => getQuizzes(genreId, num),
  });

  // 復習テーブルに問題をinsertする
  const insertQuiz = useQuiz("insertQuiz");
  // const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: (quizForReview) => insertQuiz(quizForReview),
  });

  // 正解した問題に応じてポイントを加算する
  const updateQuizPoint = useQuiz("updateQuizPoint");
  const updatePointMutation = useMutation({
    mutationFn: (userPoint) => updateQuizPoint(userPoint),
  });

  // ジャンルごとの総回答数と正解数をquiz_resultsテーブルに更新する
  // 正答率の計算は行わないことに注意！！！
  const updateCorrectPerQuiz = useQuiz("updateCorrectPerQuiz");
  const updatePercentMutation = useMutation({
    mutationFn: (quizResults) => updateCorrectPerQuiz(quizResults),
  });

  let currentQuiz; // 現在のクイズリスト(オブジェクト)
  let currentQuizText; // 現在のクイズの問題(文字列)
  let currentQuizAnswerKana; // 現在のクイズの答え(文字列)
  let currentQuizAnswerKanaArray; // 現在のクイズの答えを管理する配列

  if (!isLoading) {
    // n問目のクイズリスト
    currentQuiz = quizList[currentQuestionIndex];
    currentQuizText = quizList[currentQuestionIndex]?.quiz;
    currentQuizAnswerKana = quizList[currentQuestionIndex]?.answerKana;
    if (currentQuizAnswerKana !== undefined) {
      currentQuizAnswerKanaArray = currentQuizAnswerKana.split(""); // 現在のクイズの答えを配列に1文字ずつ格納する
    }
  }

  // 「Tap To Start!!」が表示される画面のどこかが左クリックされたら回答モードに切り替える関数
  const handleStartClick = (event) => {
    // 左クリック以外の場合は何もしない
    if (event.button !== 0) {
      return;
    }

    setTapToStart(false);
    setShouldDisplayText(true);
    questionPlay(); // 問題開始時に音声を再生
  };

  // 問題文を1文字ずつ表示させる関数を制御するuseEffect
  // shouldDisplayTextがtrueのときに関数を実行する
  useEffect(() => {
    if (shouldDisplayText) {
      const timer = setInterval(() => {
        if (displayTextIndex < currentQuizText?.length) {
          setText((prevText) => prevText + currentQuizText[displayTextIndex]);
          setDisplayTextIndex((displayTextIndex) => displayTextIndex + 1);
        } else {
          setCountdown(5);
          setIsRunning(true);
          clearInterval(timer);
        }
      }, 150); // 0.15秒ごとに表示

      return () => clearInterval(timer); // コンポーネントがアンマウントされた時にタイマーをクリア
    } else {
      return;
    }
  }, [displayTextIndex, text, shouldDisplayText]);

  // 回答の選択肢を生成する関数
  // 別の関数の中でこの関数を呼び出すことを想定している
  // 引数：correctAnswer=正解の選択肢(配列)
  // つまり引数に入れる段階で問題の答えを配列で作っておいて、それを処理の中でn文字目を取り出す
  const generateOptions = (correctAnswerArray) => {
    const selectableOptions = [];
    const correctAnswerChar = correctAnswerArray[optionIndex]; // 正解が管理された配列から1文字取り出して変数に代入
    const answerType = typeof correctAnswerArray[optionIndex];

    // ひらがなか否かを判定
    if (
      answerType === "string" &&
      /^[\u3040-\u309F]+$/.test(correctAnswerChar)
    ) {
      // ひらがなのUnicode範囲（U+3040 から U+309F）
      const hiraganaStart = 0x3040;
      const hiraganaEnd = 0x309f;

      // 使用しない文字コード
      const invalidCodes = [
        0x3040, 0x3090, 0x3091, 0x3094, 0x3095, 0x3096, 0x3097, 0x3098, 0x3099,
        0x309a, 0x309b, 0x309c, 0x309d, 0x309e, 0x309f,
      ];

      while (selectableOptions.length < 3) {
        const randomCode =
          Math.floor(Math.random() * (hiraganaEnd - hiraganaStart + 1)) +
          hiraganaStart;
        // 使用しない文字コードの場合はスキップ
        if (invalidCodes.includes(randomCode)) {
          continue;
        }
        const randomHiragana = String.fromCharCode(randomCode);
        // 生成した文字がcorrectAnswerCharと重複しないかつ、すでに配列に入っていないことを確認
        if (
          randomHiragana !== correctAnswerChar &&
          !selectableOptions.includes(randomHiragana)
        ) {
          selectableOptions.push(randomHiragana);
        }
      }
    }
    // カタカナか否かを判定
    else if (
      answerType === "string" &&
      /^[\u30A1-\u30F6ー]+$/.test(correctAnswerChar)
    ) {
      // カタカナのUnicode範囲
      const katakanaStart = 0x30a0;
      const katakanaEnd = 0x30ff;

      // 使用しない文字コード
      const invalidCodes = [
        0x30a0, 0x30f0, 0x30f1, 0x30f5, 0x30f6, 0x30f8, 0x30f9, 0x30fa, 0x30fb,
        0x30fd, 0x30fe, 0x30ff,
      ];

      // カタカナの文字コード範囲からランダムに文字を選択する
      // ランダムなUnicodeコードポイントを生成
      while (selectableOptions.length < 3) {
        const randomCodePoint =
          Math.floor(Math.random() * (katakanaEnd - katakanaStart + 1)) +
          katakanaStart;
        // 使用しない文字コードの場合はスキップ
        if (invalidCodes.includes(randomCodePoint)) {
          continue;
        }
        const randomKatakana = String.fromCharCode(randomCodePoint);
        if (
          randomKatakana !== correctAnswerChar &&
          !selectableOptions.includes(randomKatakana)
        ) {
          selectableOptions.push(randomKatakana);
        }
      }
    }
    // アルファベットの大文字か否かを判定
    else if (answerType === "string" && /^[A-Z]$/.test(correctAnswerChar)) {
      // 大文字アルファベットのUnicode範囲
      const uppercaseStart = 0x41;
      const uppercaseEnd = 0x5a;
      while (selectableOptions.length < 3) {
        // ランダムなUnicodeコードポイントを生成
        const randomCodePoint =
          Math.floor(Math.random() * (uppercaseEnd - uppercaseStart + 1)) +
          uppercaseStart;
        const upperCase = String.fromCharCode(randomCodePoint);
        if (
          upperCase !== correctAnswerChar &&
          !selectableOptions.includes(upperCase)
        ) {
          selectableOptions.push(upperCase);
        }
      }
    }
    // アルファベットの小文字か否かを判定
    else if (answerType === "string" && /^[a-z]$/.test(correctAnswerChar)) {
      // 小文字アルファベットのUnicode範囲
      const lowercaseStart = 0x61;
      const lowercaseEnd = 0x7a;
      while (selectableOptions.length < 3) {
        // ランダムなUnicodeコードポイントを生成
        const randomCodePoint =
          Math.floor(Math.random() * (lowercaseEnd - lowercaseStart + 1)) +
          lowercaseStart;
        const lowerCase = String.fromCharCode(randomCodePoint);
        if (
          lowerCase !== correctAnswerChar &&
          !selectableOptions.includes(lowerCase)
        ) {
          selectableOptions.push(lowerCase);
        }
      }
    }
    // 算用数字か否かを判定
    else if (answerType === "string" && /^[0-9]+$/.test(correctAnswerChar)) {
      // 算用数字の文字コード範囲（65296 〜 65305）からランダムに文字を選択する
      // 数字のUnicode範囲
      const digitStart = 0x30;
      const digitEnd = 0x39;
      while (selectableOptions.length < 3) {
        // ランダムなUnicodeコードポイントを生成
        const randomCodePoint =
          Math.floor(Math.random() * (digitEnd - digitStart + 1)) + digitStart;
        const randomNum = String.fromCharCode(randomCodePoint);
        if (
          randomNum !== correctAnswerChar &&
          !selectableOptions.includes(randomNum)
        ) {
          selectableOptions.push(randomNum);
        }
      }
    }

    // 正解の選択肢をランダムな位置に挿入する
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    selectableOptions.splice(correctAnswerIndex, 0, correctAnswerChar);

    setAnswerOptions(selectableOptions);
  };

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

  // 問題開始前に流す音声データ
  const [questionPlay] = useSound(questionSound);
  // 回答するボタンが押下されたときの音声データ
  const [buttonPlay] = useSound(buttonSound);
  // 問題に正解した時の音声データ
  const [correctPlay] = useSound(correctAnswerSound);
  // 問題に不正解した時の音声データ
  const [inCorrectPlay] = useSound(IncorrectAnswerSound);

  // 「回答する」ボタンが押下されたときの処理
  const handleToAnswer = () => {
    buttonPlay(); // ボタンの音を再生
    setShouldDisplayText(false); // useEffectの中の1文字ずつ表示させる関数を止める
    setShouldGenerateOptions(true); // useEffectの中のgenerateOptions関数を呼び出す
    setIsRunning(true); // カウントダウンする関数を有効にする
    setCountdown(5); // カウントダウンを5秒にセットする←これがないと全文表示された後にカウントダウンがそのまま続いてしまう
    // 回答するボタンを非表示にする
    setIsAnswerButton(false);
    // 背景を暗くする(DOM操作)
    const answerModeDiv = document.getElementById("answerMode");
    if (answerModeDiv) {
      answerModeDiv.classList.add("popup-container");
    }
    // 選択肢を出す(DOM操作)
    setIsPopUp(true);

    // ジャンルごとの総回答数をインクリメント
    switch (currentQuiz.genreId) {
      case 1:
        setQuizResults((prevState) => ({
          ...prevState,
          genre1AllAnswerNum: prevState.genre1AllAnswerNum + 1,
        }));
        break;
      case 2:
        setQuizResults((prevState) => ({
          ...prevState,
          genre2AllAnswerNum: prevState.genre2AllAnswerNum + 1,
        }));
        break;
      case 3:
        setQuizResults((prevState) => ({
          ...prevState,
          genre3AllAnswerNum: prevState.genre3AllAnswerNum + 1,
        }));
        break;
      case 4:
        setQuizResults((prevState) => ({
          ...prevState,
          genre4AllAnswerNum: prevState.genre4AllAnswerNum + 1,
        }));
        break;
      case 5:
        setQuizResults((prevState) => ({
          ...prevState,
          genre5AllAnswerNum: prevState.genre5AllAnswerNum + 1,
        }));
      case 6:
        setQuizResults((prevState) => ({
          ...prevState,
          genre6AllAnswerNum: prevState.genre6AllAnswerNum + 1,
        }));
        break;
      case 7:
        setQuizResults((prevState) => ({
          ...prevState,
          genre7AllAnswerNum: prevState.genre7AllAnswerNum + 1,
        }));
        break;
      case 8:
        setQuizResults((prevState) => ({
          ...prevState,
          genre8AllAnswerNum: prevState.genre8AllAnswerNum + 1,
        }));
        break;
      case 9:
        setQuizResults((prevState) => ({
          ...prevState,
          genre9AllAnswerNum: prevState.genre9AllAnswerNum + 1,
        }));
        break;
      case 10:
        setQuizResults((prevState) => ({
          ...prevState,
          genre10AllAnswerNum: prevState.genre10AllAnswerNum + 1,
        }));
        break;
      default:
        break;
    }
  };

  // 時間切れで不正解となった場合
  useEffect(() => {
    if (timeOver) {
      console.log("time-over-useEffect");
      setTimeOver(false);
      setCountdown(5); // カウントダウンの数字をリセットする
      setIsRunning(false); // カウントダウンする関数を無効にする
      inCorrectPlay(); // 不正解の場合の音声を流す

      // 新しいオブジェクトを作成
      const newQuizForReview = {
        upsertId: null,
        quizId: currentQuiz?.quizId,
        genreId: currentQuiz.genreId,
        userId: null, // ログイン中のユーザーID(ログインを実装してないので仮の値を入れてる)
        mistakeAt: null, // バックエンドで日付を作る
        mistakeCount: currentQuiz.mistakeCount++, // インクリメント
        reviewAt: null, // この画面では更新対象外
      };

      // 前の状態をスプレッド構文で展開し、新しいオブジェクトを追加してセット
      setQuizForReview((prevState) => [...prevState, newQuizForReview]);

      setShouldGenerateOptions(false); // useEffectの中のgenerateOptions関数の呼び出しを止める
      // 一旦答えを表示する(showResultをtrueにする)
      setShowResult(true); // 問題の答えを表示にする
      setIsAllQuizText(true); // 問題文を全文で表示させる
      setIsAnswerCorrect(false); // 「不正解です」と表示する
      setIsAnswerButton(false); // 「回答する」ボタンを非表示にする

      if (quizList.length === currentQuestionIndex + 1) {
        // 回答中かつ最後の問題に不正解
        console.log("(3-2)不正解(最終問題)");

        // 答えを表示した2.5秒後に答えを非表示にする
        setTimeout(() => {
          setShowResult(false); // 問題の答えを非表示にする
          setShowText(false); // 問題文を非表示にする
          setIsAnswerCorrect(null);
          setQuizCompleted(true); // クイズが終了したことを示す
          setIsAddMutation(true); // DB更新
        }, 3000);
        // 背景を暗くしてるやつを解除する
        const answerModeDiv = document.getElementById("answerMode");
        if (answerModeDiv) {
          answerModeDiv.classList.remove("popup-container");
        }
        setIsPopUp(false); // 背景の暗くしたやつをもとに戻す

        setTimeout(() => {
          navigate("/quiz/home");
        }, 7000);
      } else {
        console.log("回答中不正解の続き処理");
        // 答えを表示した2.5秒後に答えを非表示にする
        setTimeout(() => {
          setShowResult(false);
          setIsAllQuizText(false); // 問題文を1文字ずつ表示させる方に切り替える
          setIsAnswerCorrect(null);
        }, 3000);

        // 背景を暗くしてるやつを解除する
        const answerModeDiv = document.getElementById("answerMode");
        if (answerModeDiv) {
          answerModeDiv.classList.remove("popup-container");
        }
        setIsPopUp(false); // 背景の暗くしたやつをもとに戻す

        // inCorrectPlay(); // 不正解の場合の音声を流す
        setTimeout(() => {
          setOptionIndex(0);
          setSelectedAnswerIndex(0);
          setCountCorrect(1);
          setCurrentQuestionIndex(
            (currentQuestionIndex) => currentQuestionIndex + 1
          ); // n問目のクイズであるかを管理してるステートを更新して、次の問題へ移る
          setIsAnswerButton(true); // 「回答する」ボタンを表示する
          setDisplayTextIndex(0); // 問題文を表示するためのインデックスを0に戻す
          setText(""); // 今回の問題が入っているので、次の問題に備えて問題文を空にしておく
          setShouldDisplayText(true); // useEffectの中の1文字ずつ表示させる関数を呼び出す
          questionPlay(); // 問題開始時に音声を再生
        }, 3000);
      }
    }
  }, [timeOver]);

  // 「回答する」ボタン押下後の"選択肢を押下した際の処理"
  const handleAnswer = (e) => {
    e.preventDefault();

    // n問目が全て正解か否かを判定する
    let allCorrectFlg = countCorrect === currentQuizAnswerKana.length;

    // (1)回答中で正解だった場合(n文字目の回答が正解の場合)
    if (
      !allCorrectFlg &&
      e.target.innerText === currentQuizAnswerKanaArray[optionIndex]
    ) {
      console.log("(1)n文字目の回答が正解");

      // 回答(correct)のインデックスを次の文字へ進める
      setOptionIndex((optionIndex) => optionIndex + 1);
      setSelectedAnswerIndex((selectedAnswerIndex) => selectedAnswerIndex + 1);
      setCountCorrect((countCorrect) => countCorrect + 1);
      setCountdown(5); // カウントダウンの数字をリセットする
    }

    // n問目の途中で不正解だった場合、または、５秒以内に回答できなかった場合
    else if (e.target.innerText !== currentQuizAnswerKanaArray[optionIndex]) {
      // (3-2)クイズリストの途中
      console.log("(3-1)不正解(回答中)");
      inCorrectPlay(); // 不正解の場合の音声を流す
      setIsRunning(false); // カウントダウンする関数を無効にする
      setCountdown(5); // カウントダウンの数字をリセットする

      // 新しいオブジェクトを作成
      const newQuizForReview = {
        upsertId: null,
        quizId: currentQuiz?.quizId,
        genreId: currentQuiz.genreId,
        userId: null, // ログイン中のユーザーID(ログインを実装してないので仮の値を入れてる)
        mistakeAt: null, // バックエンドで日付を作る
        mistakeCount: currentQuiz.mistakeCount++, // インクリメント
        reviewAt: null, // この画面では更新対象外
      };

      // 前の状態をスプレッド構文で展開し、新しいオブジェクトを追加してセット
      setQuizForReview((prevState) => [...prevState, newQuizForReview]);

      setShouldGenerateOptions(false); // useEffectの中のgenerateOptions関数の呼び出しを止める
      // 一旦答えを表示する(showResultをtrueにする)
      setShowResult(true); // 問題の答えを表示にする
      setIsAllQuizText(true); // 問題文を全文で表示させる
      setIsAnswerCorrect(false); // 「不正解です」と表示する

      if (
        e.target.innerText !== currentQuizAnswerKanaArray[optionIndex] &&
        quizList.length === currentQuestionIndex + 1
      ) {
        // 回答中かつ最後の問題に不正解
        console.log("(3-2)不正解(最終問題)");

        setIsRunning(false); // カウントダウンを止める(どちらかというと表示させない)
        setCountdown(5); // 一応ね？

        // 答えを表示した2.5秒後に答えを非表示にする
        setTimeout(() => {
          setShowResult(false); // 問題の答えを非表示にする
          setShowText(false); // 問題文を非表示にする
          setIsAnswerButton(false); // 「回答する」ボタンを非表示にする
          setIsAnswerCorrect(null);
          setQuizCompleted(true); // クイズが終了したことを示す
          setIsAddMutation(true); // DB更新
        }, 3000);
        // 背景を暗くしてるやつを解除する
        const answerModeDiv = document.getElementById("answerMode");
        if (answerModeDiv) {
          answerModeDiv.classList.remove("popup-container");
        }
        setIsPopUp(false); // 背景の暗くしたやつをもとに戻す

        setTimeout(() => {
          navigate("/quiz/home");
        }, 5000);
      } else {
        console.log("回答中不正解の続き処理");
        // 答えを表示した2.5秒後に答えを非表示にする
        setTimeout(() => {
          setShowResult(false);
          setIsAllQuizText(false); // 問題文を1文字ずつ表示させる方に切り替える
          setIsAnswerCorrect(null);
        }, 3000);

        // 背景を暗くしてるやつを解除する
        const answerModeDiv = document.getElementById("answerMode");
        if (answerModeDiv) {
          answerModeDiv.classList.remove("popup-container");
        }
        setIsPopUp(false); // 背景の暗くしたやつをもとに戻す

        // inCorrectPlay(); // 不正解の場合の音声を流す
        setTimeout(() => {
          setOptionIndex(0);
          setSelectedAnswerIndex(0);
          setCountCorrect(1);
          setCurrentQuestionIndex(
            (currentQuestionIndex) => currentQuestionIndex + 1
          ); // n問目のクイズであるかを管理してるステートを更新して、次の問題へ移る
          setIsAnswerButton(true); // 「回答する」ボタンを表示する
          setDisplayTextIndex(0); // 問題文を表示するためのインデックスを0に戻す
          setText(""); // 今回の問題が入っているので、次の問題に備えて問題文を空にしておく
          setShouldDisplayText(true); // useEffectの中の1文字ずつ表示させる関数を呼び出す
          questionPlay(); // 問題開始時に音声を再生
        }, 3000);
      }
    }

    // (2)n問目の回答が全て正解だった場合(回答した回数と正解の文字数が一致してたら次の問題へ移る)
    // これじゃ最後の文字が選択されるだけでここに来るじゃん
    else if (countCorrect === currentQuizAnswerKana.length) {
      console.log(`(444)n問目の回答が全て正解`);
      correctPlay(); // 問題に正解した場合の音声を再生

      setIsRunning(false); // カウントダウンの処理を止める
      setIsAnswerButton(false); // 「回答する」ボタンを非表示する

      // ジャンルごとの正解数をインクリメント
      switch (currentQuiz.genreId) {
        case 1:
          setQuizResults((prevState) => ({
            ...prevState,
            genre1CorrectNum: prevState.genre1CorrectNum + 1,
          }));
          break;
        case 2:
          setQuizResults((prevState) => ({
            ...prevState,
            genre2CorrectNum: prevState.genre2CorrectNum + 1,
          }));
          break;
        case 3:
          setQuizResults((prevState) => ({
            ...prevState,
            genre3CorrectNum: prevState.genre3CorrectNum + 1,
          }));
          break;
        case 4:
          setQuizResults((prevState) => ({
            ...prevState,
            genre4CorrectNum: prevState.genre4CorrectNum + 1,
          }));
          break;
        case 5:
          setQuizResults((prevState) => ({
            ...prevState,
            genre5CorrectNum: prevState.genre5CorrectNum + 1,
          }));
        case 6:
          setQuizResults((prevState) => ({
            ...prevState,
            genre6CorrectNum: prevState.genre6CorrectNum + 1,
          }));
          break;
        case 7:
          setQuizResults((prevState) => ({
            ...prevState,
            genre7CorrectNum: prevState.genre7CorrectNum + 1,
          }));
          break;
        case 8:
          setQuizResults((prevState) => ({
            ...prevState,
            genre8CorrectNum: prevState.genre8CorrectNum + 1,
          }));
          break;
        case 9:
          setQuizResults((prevState) => ({
            ...prevState,
            genre9CorrectNum: prevState.genre9CorrectNum + 1,
          }));
          break;
        case 10:
          setQuizResults((prevState) => ({
            ...prevState,
            genre10CorrectNum: prevState.genre10CorrectNum + 1,
          }));
          break;
        default:
          break;
      }

      setUserPoint((userPoint) => userPoint + 1); // 正解した問題に応じてポイントを付ける。 １問正解で１ポイント加算

      setAnswerCorrectCount((answerCorrectCount) => answerCorrectCount + 1); // 問題に正解した回数を管理するステートをインクリメント

      setShouldGenerateOptions(false); // useEffectの中のgenerateOptions関数の呼び出しを止める

      // 回答モードを解除し、答えを表示させる
      setShowResult(true); // 答えを表示させる
      setIsAllQuizText(true); // 問題文を全文で表示させる
      setIsAnswerCorrect(true); // 「正解です」と表示する
      setIsPopUp(false); // 背景の暗くしたやつをもとに戻す

      // 背景を暗くしてるやつを解除する
      const answerModeDiv = document.getElementById("answerMode");
      if (answerModeDiv) {
        answerModeDiv.classList.remove("popup-container");
      }

      if (
        e.target.innerText === currentQuizAnswerKanaArray[optionIndex] &&
        quizList.length === currentQuestionIndex + 1
      ) {
        // 最後の問題に正解したとき
        // DB更新
        setIsAddMutation(true); // DB更新
        console.log("最終問題に正解");
      }

      // 2.5秒後に以下の処理を実行
      setTimeout(() => {
        if (
          e.target.innerText === currentQuizAnswerKanaArray[optionIndex] &&
          quizList.length === currentQuestionIndex + 1
        ) {
          setShowResult(false); // 答えを非表示にする
          setIsAllQuizText(false); // 問題文を1文字ずつ表示させる方に切り替える
          setCountCorrect(1); // 何文字目を回答中かを管理するステートを、次の問題を回答するため1文字目に戻す
          setCurrentQuestionIndex(
            (currentQuestionIndex) => currentQuestionIndex + 1
          ); // n問目のクイズであるかを管理してるステートを更新して、次の問題へ移る
          setSelectedAnswerIndex(0);
          setOptionIndex(0); // generateOptions関数で正解の文字を含めた回答を作るために、元に戻す
          setDisplayTextIndex(0); // 問題文を表示するためのインデックスを0に戻す
          setText(""); // 今回の問題が入っているので、次の問題に備えて問題文を空にしておく
          setShouldDisplayText(true); // useEffectの中の1文字ずつ表示させる関数を呼び出す
        } else {
          setShowResult(false); // 答えを非表示にする
          setIsAllQuizText(false); // 問題文を1文字ずつ表示させる方に切り替える
          setIsAnswerButton(true); // 「回答する」ボタンを表示する
          setCountCorrect(1); // 何文字目を回答中かを管理するステートを、次の問題を回答するため1文字目に戻す
          setCurrentQuestionIndex(
            (currentQuestionIndex) => currentQuestionIndex + 1
          ); // n問目のクイズであるかを管理してるステートを更新して、次の問題へ移る
          setSelectedAnswerIndex(0);
          setOptionIndex(0); // generateOptions関数で正解の文字を含めた回答を作るために、元に戻す
          setDisplayTextIndex(0); // 問題文を表示するためのインデックスを0に戻す
          setText(""); // 今回の問題が入っているので、次の問題に備えて問題文を空にしておく
          setShouldDisplayText(true); // useEffectの中の1文字ずつ表示させる関数を呼び出す
          questionPlay(); // 問題開始時に音声を再生 ←とりま最後の文字があってるときは鳴らすことにする
          setCountdown(5); // カウントダウンの数字を５秒に戻す
        }
      }, 3000);
    }
  };

  useEffect(() => {
    if (isAddMutation) {
      addMutation.mutate(quizForReview); // 復習テーブルに不正解の問題を追加
      updatePointMutation.mutate(userPoint); // 正解した問題に応じてポイントをuser_infoテーブルに追加する
      updatePercentMutation.mutate(quizResults); // ジャンルごとの総回答数と正解数をテーブルに更新
      setQuizAnswerUrlState(location.pathname); // ホーム画面に遷移する前にクイズ回答画面のURLを格納
      setIsAddMutation(false); // この処理でレンダリングが再実行されないようにする
    } else {
      // なにもしない
    }
  }, [isAddMutation]);

  // optionIndexとselectedAnswerIndexが更新されるごとにgenerateOptions関数を呼び出す。
  // 第2引数のいずれかの値が変わったときにuseEffectが実行される
  useEffect(() => {
    console.log("quizList?.length: " + quizList?.length);
    console.log("currentQuestionIndex: " + currentQuestionIndex);
    if (
      // countCorrect === quizList?.length ||
      quizList?.length === currentQuestionIndex
    ) {
      setIsAnswerButton(false); // 「回答する」ボタンを非表示にする
      setQuizCompleted(true); // クイズが終了したことを示す
      setIsRunning(false);
      setTimeout(() => {
        navigate("/quiz/home");
      }, 5000);
    }
    // shouldGenerateOptions(generateOptions関数の呼び出しをするか否かを判定するフラグ)がtrueなら実行
    else if (shouldGenerateOptions) {
      generateOptions(currentQuizAnswerKanaArray);
    }
  }, [optionIndex, selectedAnswerIndex, shouldGenerateOptions]);

  if (isLoading) {
    return <LoadingMotion />;
  }

  return (
    <>
      <div id="answerMode" className="default-container">
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
            display: "flex", // 要素を横に並べる
            alignItems: "center", // 垂直方向の中央揃え
            // justifyContent: "space-between", // 要素を均等に配置する
          }}
        >
          <h1 style={{ marginRight: "70px", paddingTop: "10px" }}>
            クイズ回答モード
          </h1>

          {!TapToStart && (
            <h3 style={{ marginRight: "70px" }}>{`${
              currentQuestionIndex === quizList?.length
                ? quizList?.length
                : currentQuestionIndex + 1
            }問目 / ${quizList?.length}問中`}</h3>
          )}

          {!TapToStart && (
            <>
              {showText && (
                <>
                  <h3 style={{ marginRight: "70px" }}>
                    {currentQuiz?.genreName}
                  </h3>
                  <h3
                    style={{ marginRight: "70px" }}
                  >{`${answerCorrectCount}正解 / ${quizList?.length}問中`}</h3>
                </>
              )}
            </>
          )}
          <h2 style={{ marginLeft: "auto", marginTop: "10px" }}>
            【{loginUser?.userName}】
          </h2>
        </header>

        {/* ヘッダーの真下に要素を配置 */}
        <div style={{ position: "fixed", marginTop: "-400px" }}>
          {/* 回答中に残り時間を表示する */}
          {isRunning && (
            <div
              style={{
                margin: "20px",
                fontSize: "40px",
                color: "#333333",
                padding: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                textAlign: "center",
                zIndex: 800,
              }}
            >
              <h1>回答時間：{countdown.toFixed(2)}</h1>
            </div>
          )}

          {/* 以下省略 */}
        </div>

        <div>
          <div>
            {TapToStart && (
              <div
                id="tap-to-start"
                className="tap-to-start"
                onClick={handleStartClick}
              >
                Tap To Start!!
              </div>
            )}

            {!TapToStart && (
              <>
                {showText && (
                  <h1
                    id="quiz-text"
                    style={{
                      fontSize: currentQuizText?.length > 50 ? "40px" : "50px",
                    }}
                  >
                    {isAllQuizText && currentQuizText
                      ? currentQuizText
                          ?.match(/.{1,25}/g)
                          .map((chunk, index) => (
                            <span key={index}>
                              {chunk}
                              <br />
                            </span>
                          ))
                      : text &&
                        text?.match(/.{1,25}/g).map((chunk, index) => (
                          <span key={index}>
                            {chunk}
                            <br />
                          </span>
                        ))}
                  </h1>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* 結果を表示 */}
                  {showResult && (
                    <>
                      {isAnswerCorrect ? (
                        <p style={{ fontSize: "40px", margin: "30px" }}>
                          正解です
                        </p>
                      ) : (
                        <p style={{ fontSize: "40px", margin: "30px" }}>
                          不正解です
                        </p>
                      )}

                      <p
                        style={{
                          fontSize: "40px",
                          borderBottom: "3px solid #000",
                        }}
                      >
                        A.{quizList[currentQuestionIndex]?.answer}
                      </p>
                    </>
                  )}
                </div>

                <div
                  style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                  }}
                >
                  {isAnswerButton && (
                    <img
                      style={{
                        width: "150px",
                        cursor: "pointer",
                      }}
                      src={answerButton}
                      alt="回答するボタン"
                      onClick={() => handleToAnswer()}
                    />
                  )}
                </div>
              </>
            )}

            {/* 全問題終了後のメッセージ */}
            {answerCorrectCount === quizList?.length ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {quizCompleted && (
                  <>
                    <p style={{ fontSize: "50px" }}>おめでとうございます！</p>
                    <p style={{ fontSize: "50px" }}>全問正解です！</p>
                    <p style={{ fontSize: "50px" }}>ホーム画面に遷移します。</p>
                  </>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {quizCompleted && (
                  <>
                    <p style={{ fontSize: "50px" }}>
                      終了です。お疲れさまでした。
                    </p>
                    <p style={{ fontSize: "50px" }}>ホーム画面に遷移します。</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div
            className="fixed-buttons"
            style={{
              position: "fixed" /* 要素を固定位置に配置します */,
              bottom: "20px" /* 画面下部からの距離を調整します */,
              left: "50%" /* 左端からの距離を調整します */,
              transform: "translateX(-50%)" /* 要素を中央に配置します */,
              width: "fit-content" /* 要素の幅を内容に合わせます */,
              display: "flex" /* 要素を水平に配置します */,
              justifyContent: "center" /* 要素を中央に配置します */,
              zIndex: "999" /* 他の要素の上に配置します */,
            }}
          >
            {/* 回答選択肢を表示 */}
            {!showResult &&
              isPopUp &&
              answerOptions.map((answer, index) => (
                <button
                  key={index}
                  className="choice-button"
                  style={{
                    marginRight: "60px",
                    fontSize: "40px",
                    backgroundColor: "#ffffff", // ボタンの背景色
                    color: "#333333", // ボタンの文字色
                    padding: "20px 30px", // ボタンのパディング
                    border: "2px solid #333333", // ボーダー
                    borderRadius: "5px", // ボタンの角を丸くする
                    cursor: "pointer", // カーソルをポインターにする
                    fontWeight: "bold", // ボタンの文字を太字にする
                  }}
                  onClick={(e) => handleAnswer(e)}
                >
                  {answer}
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizAnswer;
