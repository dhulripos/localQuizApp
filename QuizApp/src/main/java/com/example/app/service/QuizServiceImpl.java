package com.example.app.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.domain.Genre;
import com.example.app.domain.Quiz;
import com.example.app.domain.QuizResult;
import com.example.app.domain.Review;
import com.example.app.mapper.QuizMapper;

@Service
public class QuizServiceImpl implements QuizService {

  @Autowired
  private QuizMapper qm;

  @Override
  public List<Quiz> getQuizzes(int genreId, Integer num) throws Exception {
    List<Quiz> quizList = qm.getQuizzes(genreId, num);
    return quizList;
  }

  @Override
  public List<Genre> getGenreById(int genreId) {
    return qm.getGenreById(genreId);
  }

  // 復習画面(一覧)
  @Override
  public List<Quiz> getReview(String userId, int page, int numPerPage) throws Exception {
    int offset = numPerPage * (page - 1);
    List<Quiz> quizList = qm.getReview(userId, offset, numPerPage);
    return quizList;

  }

  // クイズ回答で間違えた問題をDBに登録する
  @Override
  public void insertQuizForReview(List<Review> quiz) throws Exception {
    // mistakeAtの日付を作る
    Date date = new Date();
    // 日付フォーマットを指定してSimpleDateFormatオブジェクトを作成
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
    // 指定されたフォーマットで日付を文字列として取得
    String formattedDate = sdf.format(date);
    // 生成した日付を各オブジェクトのmistakeAtにセット
    // 復習テーブルのPKを作る
//    for (int i = 0; i < quiz.size(); i++) {
//      quiz.get(i).setMistakeAt(formattedDate);
//      quiz.get(i).setUpsertId(quiz.get(i).getQuizId() + quiz.get(i).getUserId());
//    }
    quiz.stream().forEach(q -> {
      q.setMistakeAt(formattedDate);
      q.setUpsertId(q.getQuizId() + q.getUserId());
    });
    qm.insertQuizForReview(quiz);
  }

  // Genreテーブルから全てのジャンルを取得する
  @Override
  public List<Genre> getAllGenre() throws Exception {
    List<Genre> genreList = qm.getAllGenre();
    Genre newGenre = new Genre();
    newGenre.setGenreId(0);
    newGenre.setGenreName("全て");
    // リストの先頭に新しいジャンルを挿入する
    genreList.add(0, newGenre);
    return genreList;
  }

  // 正解した問題に応じてポイントをuser_infoテーブルに加算する
  @Override
  public void updateQuizPoint(int userPoint, String userId) throws Exception {
    qm.updateQuizPoint(userPoint, userId);

  }

  // 復習するクイズ(明細画面)を取得する
  @Override
  public Quiz getDetailReview(String userId, int quizId) throws Exception {
    Quiz quiz = qm.getDetailReview(userId, quizId);
    return quiz;
  }

  // ジャンルごとの総回答数と正解数をquiz_resultsテーブルに更新する
  @Override
  public void updateCorrectPerQuiz(QuizResult quizResult) throws Exception {
    qm.updateCorrectPerQuiz(quizResult);
  }

  // 復習画面(一覧)でトータルページを計算する
  @Override
  public int getReviewTotalPages(String userId, int numPerPage) throws Exception {
    double totalNum = qm.gerReviewCount(userId);
    int totalPages = (int) Math.ceil(totalNum / numPerPage);
    return totalPages;
  }

  // クイズ検索画面で表示するクイズを取得する
  @Override
  public List<Quiz> getSearchQuiz(String word, int page, int numPerPage) throws Exception {
    int offset = numPerPage * (page - 1);
    List<Quiz> quizList = qm.getSearchQuiz(word, offset, numPerPage);
    return quizList;
  }

  // クイズ検索画面でトータルページを取得する
  @Override
  public int getSearchTotalPages(String word, int numPerPage) throws Exception {
    double totalNum = qm.getSearchCount(word);
    int totalPages = (int) Math.ceil(totalNum / numPerPage);
    return totalPages;
  }

  // クイズ検索画面から明細画面に遷移した際に表示するデータを取得する
  @Override
  public Quiz getSearchDetail(Integer quizId) throws Exception {
    Quiz quiz = qm.getSearchDetail(quizId);
    return quiz;
  }

  // 各ジャンルごとの正答率を計算して返す(計算はSQLでやってるので、値を返すだけ)
  @Override
  public QuizResult calculateGenreAccuracy(String userId) throws Exception {
    QuizResult quizResult = qm.calculateGenreAccuracy(userId);
    return quizResult;
  }

}
