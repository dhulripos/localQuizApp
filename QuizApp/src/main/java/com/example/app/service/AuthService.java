package com.example.app.service;

import com.example.app.domain.UserInfo;

public interface AuthService {
  
  /**
   * ログイン時のユーザ認証をする
   * @param userId ユーザID
   * @param userPW パスワード
   * @return ユーザ情報
   * @throws Exception
   */
  public UserInfo authUserLogin(String userId, String userPW) throws Exception;

}
