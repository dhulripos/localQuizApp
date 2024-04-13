package com.example.app.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.jboss.logging.Logger;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class CommonLogAspect {
  
  /** ロガー(Logback) */
  private final Logger log = Logger.getLogger(CommonLogAspect.class);
  
  /** 
   * 指定したメソッドの開始、終了ログを出力する
   * 
   * <p>また例外発生時には加えて例外内容をログに出力する
   * 
   * @param jp 処理を挿入する場所の情報
   * @return 指定したメソッドの戻り値
   * 
   */
  @Around("execution(* com.example.app..*(..))")
  public Object writeLog(ProceedingJoinPoint jp) {
    Object returnObj = null;
    // 開始ログを出力
    log.info("start:"+ jp.getSignature().toString());
    
    try {
      // JoinPointのメソッドを実行
      returnObj = jp.proceed();
    } catch(Throwable t) {
      // エラーログを出力
      log.error(t.toString());
    }
    
    // 終了ログを出力
    log.info("end:"+jp.getSignature().toString());
    
    // このようにしないと、Controllerクラスの場合は次画面への遷移が行えない
    return returnObj;
  }

}
