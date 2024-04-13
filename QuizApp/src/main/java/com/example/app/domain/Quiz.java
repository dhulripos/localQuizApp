package com.example.app.domain;

import lombok.Data;

@Data
public class Quiz {
  // クイズID
  private int quizId;
  // クイズ
  private String quiz;
  // 答え
  private String answer;
  // 答え(かなカナ)
  private String answerKana;
  // ジャンルID
  private int genreId;
  // ジャンル名
  private String genreName;
  // 作成したユーザーID
  private String userId;
  // 作成日
  private String createdAt;
  // 更新日
  private String updatedAt;
  // 不備フラグ
  private boolean issueFlag;
  // 不備摘発日
  private String issueDiscoverdAt;
  // 削除フラグ
  private boolean deleteFlag;
  // 最後にクイズに間違えた日
  private String mistakeAt;
  // クイズに間違えた回数
  private int mistakeCount;
  // 最後にクイズを復習した日
  private String reviewAt;
  // 復習画面や一覧画面のトータルページ数
  private int totalPages;
  
  Quiz(int quizId){
    if (quizId == 0) {
      throw new IllegalArgumentException("クイズIDには0以上を指定してください。");
    }
  }

}
