package com.example.app.service;

import java.util.List;

import com.example.app.domain.Genre;
import com.example.app.domain.Quiz;
import com.example.app.domain.QuizResult;
import com.example.app.domain.Review;

public interface QuizService {

  /**
   * クイズを取得する
   * @param genreId ジャンルID
   * @param num 問題数
   * @return
   * @throws Exception
   */
  List<Quiz> getQuizzes(int genreId, Integer num) throws Exception;

  /**
   * Genreテーブルから全てのジャンルを取得する
   * @return ジャンルテーブルの全ジャンル
   * @throws Exception
   */
  List<Genre> getAllGenre() throws Exception;

  /**
   * Genreテーブルからidに対応したジャンルを取得する
   * @param ジャンルID
   * @return  ジャンルIDが0なら全ジャンル、それ以外なら特定のジャンル
   */
  List<Genre> getGenreById(int genreId) throws Exception;

  /**
   * 復習するクイズ(一覧画面)を取得する
   * @param userId ユーザID
   * @param page 現在のページ数
   * @param numPerPage 1ページ当たりの表示件数
   * @return 復習テーブルから取得した間違えたことのある問題
   * @throws Exception
   */
  List<Quiz> getReview(String userId, int page, int numPerPage) throws Exception;

  /**
   * 復習画面(一覧)でトータルページを取得する
   * @param userId ユーザID
   * @param numPerPage 1ページ当たりの表示件数
   * @return 復習画面に表示するトータルページ数
   * @throws Exception
   */
  int getReviewTotalPages(String userId, int numPerPage) throws Exception;

  /**
   * 復習するクイズ(明細画面)を取得する
   * @param userId ユーザID
   * @param quizId クイズID
   * @return クイズ詳細画面に表示するクイズデータ
   * @throws Exception
   */
  Quiz getDetailReview(String userId, int quizId) throws Exception;

  /**
   * クイズ検索画面で表示するクイズを取得する
   * @param word 検索ワード
   * @param page 現在のページ数
   * @param numPerPage 1ページ当たりの表示件数
   * @return 検索されたワードに該当するクイズデータ
   * @throws Exception
   */
  List<Quiz> getSearchQuiz(String word, int page, int numPerPage) throws Exception;

  /**
   * クイズ検索画面でトータルページを取得する
   * @param word 検索ワード
   * @param numPerPage 1ページ当たりの表示件数
   * @return 検索画面で表示するトータルページ数
   * @throws Exception
   */
  int getSearchTotalPages(String word, int numPerPage) throws Exception;

  /**
   * クイズ検索画面から明細画面に遷移した際に表示するデータを取得する
   * @param quizId クイズID
   * @return クイズ検索画面から明細画面に入ったときに表示するクイズデータ
   * @throws Exception
   */
  Quiz getSearchDetail(Integer quizId) throws Exception;

  /**
   * ジャンルごとの総回答数と正解数をquiz_resultsテーブルに更新する
   * @param quizResult クイズ回答後に結果
   * @throws Exception
   */
  void updateCorrectPerQuiz(QuizResult quizResult) throws Exception;

  /**
   * クイズ回答で間違えた問題をDBに登録する
   * @param quiz クイズ回答で不正解となった問題
   * @throws Exception
   */
  void insertQuizForReview(List<Review> quiz) throws Exception;

  /**
   * 正解した問題に応じてポイントをuser_infoテーブルに加算する
   * @param userPoint ユーザーポイント
   * @param userId ユーザID
   * @throws Exception
   */
  void updateQuizPoint(int userPoint, String userId) throws Exception;

  /**
   * 各ジャンルごとの正答率を計算して返す
   * @param userId ユーザーID
   * @return ユーザーごとの各ジャンルごとの正答率
   * @throws Exception
   */
  QuizResult calculateGenreAccuracy(String userId) throws Exception;

}
