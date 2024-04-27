package com.example.app.service;

import com.example.app.domain.UserInfo;

public interface UserService {
  
  /**
   * ユーザー作成
   * @param userInfo 画面から入力されたユーザ情報
   * @return insertに成功したか否か
   * @throws Exception
   */
  boolean insertUserInfo(UserInfo userInfo) throws Exception;
  
  /**
   * ユーザー編集
   * @param userInfo 画面から入力されたユーザ情報
   * @throws Exception
   */
  void updateUserInfo(UserInfo userInfo) throws Exception;
  
  /**
   * ユーザーIDでユーザー検索
   * @param userId ユーザID
   * @return 特定のユーザ情報
   * @throws Exception
   */
  UserInfo getUserInfoByUserId(String userId) throws Exception;

}
