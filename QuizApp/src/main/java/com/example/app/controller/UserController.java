package com.example.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.domain.UserInfo;
import com.example.app.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class UserController {

  @Autowired
  private UserService us;

  // ユーザー作成
  @PostMapping("/add/user")
  public ResponseEntity<String> postAddUser(@RequestBody UserInfo userInfo) throws Exception {
    boolean insertJudge;
    try {
      insertJudge = us.insertUserInfo(userInfo);
    } catch (Exception e) {
      // ServiceクラスのExceptionをキャッチし、HTTPステータスとエラーメッセージを返す
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ServiceError: " + e.getMessage());
    }

    if (!insertJudge) {
      return new ResponseEntity<>("failed to insert userInfo", HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<>("success to insert userInfo", HttpStatus.OK);
  }

  // ユーザー編集
  @PutMapping("/edit/user")
  public ResponseEntity<UserInfo> putUpdateUser(@RequestBody UserInfo userInfo, HttpSession session) throws Exception {
    System.out.println("updateUser: userInfo" + userInfo);
    // セッションに認証状態を取り出し
    UserInfo sessionUserInfo = (UserInfo) session.getAttribute("userInfo");
    System.out.println("sessionUserInfo: " + sessionUserInfo);

    // セッションのユーザー情報がない場合
    if (sessionUserInfo == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    // ★重要★
    // ユーザーIDは変更できない仕様にした
    // 復習テーブルの主キーであるupsert_idがユーザーIDとクイズIDを結合した文字列のため、
    // ユーザーIDが変更されると復習画面に影響が出る

    userInfo.setUserId(sessionUserInfo.getUserId());

    try {
      // DB更新
      us.updateUserInfo(userInfo);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    // DB更新後のユーザー情報を取得
    UserInfo latestUserInfo = us.getUserInfoByUserId(userInfo.getUserId());

    // 認証に成功したらセッションにuserInfoを格納(バックエンドのセッション管理のため)
    session.setAttribute("userInfo", latestUserInfo);

    // フロントのRecoil更新のためDB更新後のユーザー情報を返す
    return new ResponseEntity<>(latestUserInfo, HttpStatus.OK);
  }

  // バックエンドのセッション情報をもとにuser_infoテーブルからユーザー情報を取得する
  @GetMapping("/get/userInfo")
  public ResponseEntity<UserInfo> getUserInfoById(HttpSession session) throws Exception {
    // セッションに認証状態を取り出し
    UserInfo sessionUserInfo = (UserInfo) session.getAttribute("userInfo");
    // セッションのユーザー情報がない場合
    if (sessionUserInfo == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }
    // セッションにあるユーザーIDでDB検索
    UserInfo userInfo = us.getUserInfoByUserId(sessionUserInfo.getUserId());
    // DB検索の結果がnullの場合
    if (userInfo == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(userInfo, HttpStatus.OK);
  }

}
