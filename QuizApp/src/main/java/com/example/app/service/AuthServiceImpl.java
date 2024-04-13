package com.example.app.service;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.domain.UserInfo;
import com.example.app.mapper.UserInfoMapper;

@Service
public class AuthServiceImpl implements AuthService {

  @Autowired
  private UserInfoMapper UImapper;

  // フォームから送信されたユーザー情報がDBの情報と一致するか確認
  @Override
  public UserInfo authUserLogin(String userId, String userPW) throws Exception {
    UserInfo userInfo = UImapper.selectByUserId(userId);

    // DBの情報と一致しない場合
    if (userInfo == null) {
      System.out.println("AuthServiceImpl: DBの情報と不一致");
      return null;
    }

    if (!BCrypt.checkpw(userPW, userInfo.getUserPW())) {
      System.out.println("AuthServiceImpl: パスワードが不正");
      return null;
    }
    
    // 最終ログイン日を更新
    Date date = new Date();
    // 日付フォーマットを指定してSimpleDateFormatオブジェクトを作成
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
    // 指定されたフォーマットで日付を文字列として取得
    String formattedDate = sdf.format(date);
    userInfo.setLastLoginDate(formattedDate);
    // 最終ログイン日をDBにインサート
    UImapper.insertLastLoginDate(userInfo.getUserId(), userInfo.getLastLoginDate());
    
    // フロントにPW返したくないから空文字ぶち込む
    userInfo.setUserPW("");

    return userInfo;
  }

}
