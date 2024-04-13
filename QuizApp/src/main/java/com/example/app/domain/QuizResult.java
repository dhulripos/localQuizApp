package com.example.app.domain;

import lombok.Data;

@Data
public class QuizResult {

  private String userId; // ユーザーごとのデータを管理するので、FKとする
  private int genre1AllAnswerNum; // ジャンル1の総回答数
  private int genre1CorrectNum; // ジャンル1の総正解数
  private int genre2AllAnswerNum;
  private int genre2CorrectNum;
  private int genre3AllAnswerNum;
  private int genre3CorrectNum;
  private int genre4AllAnswerNum;
  private int genre4CorrectNum;
  private int genre5AllAnswerNum;
  private int genre5CorrectNum;
  private int genre6AllAnswerNum;
  private int genre6CorrectNum;
  private int genre7AllAnswerNum;
  private int genre7CorrectNum;
  private int genre8AllAnswerNum;
  private int genre8CorrectNum;
  private int genre9AllAnswerNum;
  private int genre9CorrectNum;
  private int genre10AllAnswerNum;
  private int genre10CorrectNum;
  
  // 正答率を格納する
  private int genre1CorrectPercent;
  private int genre2CorrectPercent;
  private int genre3CorrectPercent;
  private int genre4CorrectPercent;
  private int genre5CorrectPercent;
  private int genre6CorrectPercent;
  private int genre7CorrectPercent;
  private int genre8CorrectPercent;
  private int genre9CorrectPercent;
  private int genre10CorrectPercent;

}
