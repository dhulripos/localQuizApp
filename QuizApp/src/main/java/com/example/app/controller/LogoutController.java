package com.example.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class LogoutController {
  
  @GetMapping("/logout")
  public ResponseEntity<String> logout(HttpSession session) {

//    UserInfo loginUser = (UserInfo) session.getAttribute("loginUser");
    // ログ
//    System.out.println(loginUser.getUserId() + "logged out");

    session.invalidate();

    return new ResponseEntity<>("logout", HttpStatus.OK);

  }

}
