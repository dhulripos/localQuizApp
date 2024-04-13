package com.example.app.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.app.domain.UserInfo;

@Mapper
public interface UserInfoMapper {

  // ログイン時にフォームから送信された情報をDBと照合する
  // ユーザー作成時に既に存在するユーザーがいないか確認するために使う
  UserInfo selectByUserId(String userId) throws Exception;

  void insertLastLoginDate(String userId, String lastLoginDate) throws Exception;

  // ユーザー作成
  void insertUserInfo(UserInfo userInfo) throws Exception;
  // ユーザー作成時にquiz_resultsテーブルを作成
  void createQuizResult(String userId) throws Exception;

  // ユーザー編集
  void updateUserInfo(UserInfo userInfo) throws Exception;

  // ユーザーIDでユーザー検索
  UserInfo getUserInfoByUserId(String userId) throws Exception;

}
