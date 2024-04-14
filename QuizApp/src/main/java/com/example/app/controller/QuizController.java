package com.example.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.domain.Genre;
import com.example.app.domain.Quiz;
import com.example.app.domain.QuizResult;
import com.example.app.domain.Review;
import com.example.app.domain.UserInfo;
import com.example.app.service.QuizService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class QuizController {

  @Autowired
  private QuizService qs;

  private static final int NUM_PER_PAGE = 4;

  /*
   * クイズ回答時に出題するクイズを取得するAPI
   * @param genre ジャンル(個別か全ジャンルか)。全ジャンル=genreId=0,個別はそれ以外
   */
  @GetMapping("/QuizList/{genreId}/{num}")
  public ResponseEntity<List<Quiz>> getQuizList(@PathVariable Integer genreId, @PathVariable Integer num)
      throws Exception {
    // genreがnullとかジャンルがDBにない場合のエラー処理
    if (genreId == null || num == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    } else if (qs.getGenreById(genreId) == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }
    List<Quiz> quizList = qs.getQuizzes(genreId, num);
    return new ResponseEntity<>(quizList, HttpStatus.OK);
  }

  // クイズジャンルを取得する
  @GetMapping("/get/genres")
  public ResponseEntity<List<Genre>> getGenreList() throws Exception {
    List<Genre> genreList = qs.getAllGenre();
    return new ResponseEntity<>(genreList, HttpStatus.OK);
  }

  /*
   * クイズ回答終了後、不正解となった問題を復習テーブルにinsertする処理
   * @param quizId,genreId,userId,mistakeAt(インクリメント),mistakeCount(インクリメント),reviewAt(更新の必要はないのでnull)
   */
  @PostMapping("/insert/quiz/for/review")
  public ResponseEntity<String> insertQuizForReview(@RequestBody List<Review> quizForReview, HttpSession session)
      throws Exception {
    
    // 送られてきたリストが空の場合
    if (quizForReview.isEmpty()) {
      return new ResponseEntity<>("There is no object to insert into DB", HttpStatus.OK);
    }

    // セッションが切れている場合
    UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
    if (userInfo == null) {
      return new ResponseEntity<>("Session Error", HttpStatus.BAD_REQUEST);
    }
    // セッションがControllerでしか使えないので、ここでuserIdをセットする
//    for (int i = 0; i < quizForReview.size(); i++) {
//      quizForReview.get(i).setUserId(userInfo.getUserId());
//    }
    quizForReview.stream().forEach(q -> {
      q.setUserId(userInfo.getUserId());
    });

    // 復習テーブルにinsertする
    qs.insertQuizForReview(quizForReview);
    return new ResponseEntity<>("success to insert object into DB", HttpStatus.OK);
  }

  // クイズ回答で正解した問題に応じてポイントを加算する
  @PutMapping("/update/quiz/point/by/user")
  public ResponseEntity<String> updateQuizPointByUser(@RequestParam(name = "userPoint") Integer userPoint,
      HttpSession session) throws Exception {
    // 全問不正解の場合
    if (userPoint <= 0) {
      return new ResponseEntity<>("There is no point to update userPoint", HttpStatus.BAD_REQUEST);
    }

    // セッションが切れている場合
    UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
    if (userInfo == null) {
      return new ResponseEntity<>("Session Error", HttpStatus.BAD_REQUEST);
    }

    qs.updateQuizPoint(userPoint, userInfo.getUserId());
    return new ResponseEntity<>("success to update", HttpStatus.OK);
  }

  // クイズ回答で"ジャンルごとの"総問題数と正解数をquiz_resultsテーブルに記録する
  // 正答率の計算は、ホーム画面で表示するときに行うため、このメソッドでは元データを更新するだけとする
  @PutMapping("/calc/correct/per/quiz")
  public ResponseEntity<String> updateCorrectPerQuiz(@RequestBody QuizResult quizResult, HttpSession session)
      throws Exception {
    // セッションが切れている場合
    UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
    if (userInfo == null) {
      return new ResponseEntity<>("Session Error", HttpStatus.BAD_REQUEST);
    }
    // バックエンドでユーザーIDをセット
    quizResult.setUserId(userInfo.getUserId());
    qs.updateCorrectPerQuiz(quizResult);
    return new ResponseEntity<>("success to update quiz_results", HttpStatus.OK);
  }

  // 復習画面(一覧)
  @GetMapping("/quiz/review")
  public ResponseEntity<List<Quiz>> getReviewList(@RequestParam(name = "page", defaultValue = "1") Integer page,
      HttpSession session) throws Exception {
    // セッションから取得したログインユーザーのIDでDBを検索
    // セッションが切れている場合
    UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
    if (userInfo == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }
    List<Quiz> quizList = qs.getReview(userInfo.getUserId(), page, NUM_PER_PAGE);

    if (quizList.isEmpty()) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    int totalPages = qs.getReviewTotalPages(userInfo.getUserId(), NUM_PER_PAGE);
    // とりまListの0番目に入れとく
    quizList.get(0).setTotalPages(totalPages);
    return new ResponseEntity<>(quizList, HttpStatus.OK);
  }

  // 復習画面(明細)
  @GetMapping("/quiz/detail/review")
  public ResponseEntity<Quiz> getDetailReview(@RequestParam(name = "quizId") Integer quizId, HttpSession session)
      throws Exception {

    // セッションから取得したログインユーザーのIDでDBを検索
    // セッションが切れている場合
    UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
    if (userInfo == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    Quiz quiz = qs.getDetailReview(userInfo.getUserId(), quizId);

    if (quiz == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(quiz, HttpStatus.OK);
  }

  // クイズ検索画面
  @GetMapping("/quiz/search")
  public ResponseEntity<List<Quiz>> getSearchList(@RequestParam(name = "page", defaultValue = "1") Integer page,
      @RequestParam(name = "word") String word, HttpSession session) throws Exception {
    if (word == null || word.equals("")) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    List<Quiz> searchList = qs.getSearchQuiz(word, page, NUM_PER_PAGE);
    if (searchList.isEmpty()) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    int totalPages = qs.getSearchTotalPages(word, NUM_PER_PAGE);
    searchList.get(0).setTotalPages(totalPages);
    return new ResponseEntity<>(searchList, HttpStatus.OK);
  }

  // クイズ検索画面から明細画面に遷移
  @GetMapping("/quiz/search/detail")
  public ResponseEntity<Quiz> getSearchDetail(@RequestParam(name = "quizId") Integer quizId, HttpSession session)
      throws Exception {
    Quiz quiz = qs.getSearchDetail(quizId);

    if (quiz == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(quiz, HttpStatus.OK);
  }

  // 正答率を表すグラフで使用する値を返す
  @GetMapping("/genre/accuracy/calculate")
  public ResponseEntity<QuizResult> calculateGenreAccuracy(HttpSession session) throws Exception {

    // セッションから取得したログインユーザーのIDでDBを検索
    // セッションが切れている場合
    UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
    if (userInfo == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    QuizResult quizResult = qs.calculateGenreAccuracy(userInfo.getUserId());
    return new ResponseEntity<>(quizResult, HttpStatus.OK);
  }

}
