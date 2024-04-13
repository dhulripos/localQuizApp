package com.example.app.filter;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

public class ReactFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;

    String requestURI = req.getRequestURI();
    String requestMethod = req.getMethod();

    System.out.println(requestMethod + ": " + requestURI);

    // プリフライト・リクエストは無視する
    if (req.getMethod().equals("OPTIONS")) {
      chain.doFilter(request, response);
      return;
    }
    // 特定のURLのみReactアプリのindex.htmlを配信する
    if (!requestURI.startsWith("/api/") && !requestURI.endsWith(".css") && !requestURI.endsWith(".js")) {
      req.getRequestDispatcher("/index.html").forward(request, response);
      return;
    }

    chain.doFilter(request, response);
  }

}
