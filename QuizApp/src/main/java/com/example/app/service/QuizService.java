package com.example.app.service;

import java.util.List;

import com.example.app.domain.Genre;
import com.example.app.domain.Quiz;
import com.example.app.domain.QuizResult;
import com.example.app.domain.Review;

public interface QuizService {

  // クイズを取得する
  List<Quiz> getQuizzes(int genreId, Integer num) throws Exception;

  // Genreテーブルから全てのジャンルを取得する
  List<Genre> getAllGenre() throws Exception;

  // Genreテーブルからidに対応したジャンルを取得する
  List<Genre> getGenreById(int genreId) throws Exception;

  // 復習するクイズ(一覧画面)を取得する
  List<Quiz> getReview(String userId, int page, int numPerPage) throws Exception;

  // 復習画面(一覧)でトータルページを取得する
  int getReviewTotalPages(String userId, int numPerPage) throws Exception;

  // 復習するクイズ(明細画面)を取得する
  Quiz getDetailReview(String userId, int quizId) throws Exception;

  // クイズ検索画面で表示するクイズを取得する
  List<Quiz> getSearchQuiz(String word, int page, int numPerPage) throws Exception;

  // クイズ検索画面でトータルページを取得する
  int getSearchTotalPages(String word, int numPerPage) throws Exception;

  // クイズ検索画面から明細画面に遷移した際に表示するデータを取得する
  Quiz getSearchDetail(Integer quizId) throws Exception;

  // ジャンルごとの総回答数と正解数をquiz_resultsテーブルに更新する
  void updateCorrectPerQuiz(QuizResult quizResult) throws Exception;

  // クイズ回答で間違えた問題をDBに登録する
  void insertQuizForReview(List<Review> quiz) throws Exception;

  // 正解した問題に応じてポイントをuser_infoテーブルに加算する
  void updateQuizPoint(int userPoint, String userId) throws Exception;

  // 各ジャンルごとの正答率を計算して返す
  QuizResult calculateGenreAccuracy(String userId) throws Exception;

}
