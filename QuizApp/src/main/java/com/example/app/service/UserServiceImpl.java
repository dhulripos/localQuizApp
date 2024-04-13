package com.example.app.service;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.domain.UserInfo;
import com.example.app.mapper.UserInfoMapper;

@Service
public class UserServiceImpl implements UserService {

  @Autowired
  private UserInfoMapper UIm;

  // ユーザー作成
  @Override
  public boolean insertUserInfo(UserInfo userInfo) throws Exception {

    UserInfo DBUserInfo = UIm.selectByUserId(userInfo.getUserId());

    System.out.println("DBUserInfo: " + DBUserInfo);

    // 登録しようとしているユーザーIDが既に存在する場合falseを返す
    if (DBUserInfo != null && userInfo.getUserId().equals(DBUserInfo.getUserId())) {
      return false;
    }

    // 登録しようとするユーザーIDがDBに存在しなければuser_infoテーブルに追加
    userInfo.setUserPoint(0); // 作成したばかりなのでポイントは0
    userInfo.setUserRank("なし"); // とりまランクは運用しない

    // パスワードハッシュ化
    String hashedPassword = BCrypt.hashpw(userInfo.getUserPW(), BCrypt.gensalt());
    // ハッシュ化したPWをセット
    userInfo.setUserPW(hashedPassword);

    // userCreatedAt,userUpdatedAtの日付を作る
    Date date = new Date();
    // 日付フォーマットを指定してSimpleDateFormatオブジェクトを作成
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
    // 指定されたフォーマットで日付を文字列として取得
    String formattedDate = sdf.format(date);
    userInfo.setUserCreatedAt(formattedDate);
    userInfo.setUserUpdatedAt(formattedDate);

    try {
      UIm.insertUserInfo(userInfo); // user_infoテーブルに追加
    } catch (Exception e) {
      throw new Exception("ユーザー情報の挿入中に問題が発生");
    }

    try {
      UIm.createQuizResult(userInfo.getUserId()); // quiz_resultsテーブルを作成する
    } catch (Exception e) {
      throw new Exception("復習テーブル作成中に問題が発生");
    }

    return true;
  }

  // ユーザー編集
  @Override
  public void updateUserInfo(UserInfo userInfo) throws Exception {
    // パスワードハッシュ化
    String hashedPassword = BCrypt.hashpw(userInfo.getUserPW(), BCrypt.gensalt());
    // ハッシュ化したPWをセット
    userInfo.setUserPW(hashedPassword);

    // userUpdatedAtの日付を作る
    Date date = new Date();
    // 日付フォーマットを指定してSimpleDateFormatオブジェクトを作成
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
    // 指定されたフォーマットで日付を文字列として取得
    String formattedDate = sdf.format(date);
    // ユーザー情報の更新日付をセット
    userInfo.setUserUpdatedAt(formattedDate);

    try {
      // DB更新
      UIm.updateUserInfo(userInfo);
    } catch (Exception e) {
      throw new Exception("ユーザー情報の変更中に問題が発生");
    }

  }

  // ユーザーIDでユーザー検索
  @Override
  public UserInfo getUserInfoByUserId(String userId) throws Exception {
    UserInfo userInfo = UIm.getUserInfoByUserId(userId);
    if (userInfo == null) {
      return null;
    }
    return userInfo;
  }

}
