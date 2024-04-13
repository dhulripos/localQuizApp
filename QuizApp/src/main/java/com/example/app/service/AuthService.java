package com.example.app.service;

import com.example.app.domain.UserInfo;

public interface AuthService {
  
  public UserInfo authUserLogin(String userId, String userPW) throws Exception;

}
