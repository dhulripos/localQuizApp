package com.example.app.domain;

import lombok.Data;

@Data
public class Review {
  // upsert文をかける時に使用する復習テーブルのPK(quizIdとuserIdを結合した文字列)
  private String upsertId;
  // クイズID
  private int quizId;
  // ジャンルID
  private int genreId;
  // 間違えたしたユーザーID
  private String userId;
  // 最後にクイズに間違えた日
  private String mistakeAt;
  // クイズに間違えた回数
  private int mistakeCount;
  // 最後にクイズを復習した日
  private String reviewAt;

}
