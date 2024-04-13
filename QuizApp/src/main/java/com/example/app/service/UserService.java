package com.example.app.service;

import com.example.app.domain.UserInfo;

public interface UserService {
  
  // ユーザー作成
  boolean insertUserInfo(UserInfo userInfo) throws Exception;
  
  // ユーザー編集
  void updateUserInfo(UserInfo userInfo) throws Exception;
  
  // ユーザーIDでユーザー検索
  UserInfo getUserInfoByUserId(String userId) throws Exception;

}
