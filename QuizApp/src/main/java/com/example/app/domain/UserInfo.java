package com.example.app.domain;

import lombok.Data;

@Data
public class UserInfo {
  // ユーザーID
  private String userId;
  // ユーザ名
  private String userName;
  // PW
  private String userPW;
  // クイズポイント
  private int userPoint;
  // クイズランク
  private String userRank;
  // 最終ログイン日
  private String lastLoginDate;
  // ユーザー作成日
  private String userCreatedAt;
  // ユーザー情報更新日
  private String userUpdatedAt;

}
