package com.example.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.domain.UserInfo;
import com.example.app.service.AuthService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class LoginController {

  @Autowired
  private AuthService as;

  // 画面側の「/quiz-app/login」が呼び出されたときの処理
  // 既にログインしているか確認
  @GetMapping("/user/login")
  public ResponseEntity<UserInfo> getUserLogin(HttpSession session) throws Exception {
    // セッションに認証状態を取り出し
    UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");

    // "ログイン済みでない"場合
    if (userInfo == null) {
      System.out.println("GetUserLoninController: ログイン済みでない");
      return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }
    // "ログイン済み"の場合
    System.out.println("GetUserLoninController: ログイン済み");
    return new ResponseEntity<>(userInfo, HttpStatus.OK);
  }

  // ログイン画面からフォームが送信されてきたときの処理
  @PostMapping("/user/login")
  public ResponseEntity<UserInfo> postLogin(@RequestParam("userId") String userId, @RequestParam("pass") String pass,
      HttpSession session) throws Exception {

    UserInfo userInfo2 = as.authUserLogin(userId, pass);

    // ログインID、またはパスワードが不正
    if (userInfo2 == null) {
      return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    // 認証に成功したらセッションにuserInfoを格納(バックエンドのセッション管理のため)
    session.setAttribute("userInfo", userInfo2);

    // ログ
    System.out.println(userInfo2.getUserId() + "logged in");

    // フロント側でセッションの管理のためにユーザー情報を返す
    return new ResponseEntity<>(userInfo2, HttpStatus.OK);

  }

}
