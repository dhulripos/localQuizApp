package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.domain.Genre;
import com.example.app.domain.Quiz;
import com.example.app.domain.QuizResult;
import com.example.app.domain.Review;

@Mapper
public interface QuizMapper {

  // 個別ジャンルのクイズを取得する
  List<Quiz> getQuizzes(@Param("genreId") int genreId, @Param("num") Integer num) throws Exception;

  // Genreテーブルから全てのジャンルを取得する
  List<Genre> getAllGenre() throws Exception;

  // Genreテーブルからidに対応したジャンルを取得する
  List<Genre> getGenreById(@Param("genreId") int genreId);

  // 復習するクイズを取得する(一覧画面)
  List<Quiz> getReview(@Param("userId") String userId, @Param("offset") int offset, @Param("numPerPage") int numPerPage)
      throws Exception;

  // 復習するクイズ(明細画面)を取得する
  Quiz getDetailReview(String userId, int quizId) throws Exception;

  // クイズ検索画面で表示するクイズを取得する
  List<Quiz> getSearchQuiz(String word, int offset, int numPerPage) throws Exception;

  // クイズ検索画面から明細画面に遷移した際に表示するデータを取得する
  Quiz getSearchDetail(Integer quizId) throws Exception;

  // ジャンルごとの総回答数と正解数をquiz_resultsテーブルに更新する
  void updateCorrectPerQuiz(QuizResult quizResult) throws Exception;

  // 復習画面のトータルページを計算するのに使用する
  double gerReviewCount(String userId) throws Exception;

  // クイズ検索画面でトータルページを取得する
  int getSearchCount(String word) throws Exception;

  // クイズ回答で間違えた問題をDBに登録する
  void insertQuizForReview(List<Review> quiz) throws Exception;

  // 正解した問題に応じてポイントをuser_infoテーブルに加算する
  void updateQuizPoint(int userPoint, String userId) throws Exception;

  // 各ジャンルごとの正答率を計算して返す
  QuizResult calculateGenreAccuracy(String userId) throws Exception;

}
