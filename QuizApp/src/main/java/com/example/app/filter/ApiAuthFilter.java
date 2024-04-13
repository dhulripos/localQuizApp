//package com.example.app.filter;
//
//import java.io.IOException;
//
//import com.example.app.domain.CompanyData;
//
//import jakarta.servlet.Filter;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.ServletRequest;
//import jakarta.servlet.ServletResponse;
//import jakarta.servlet.annotation.WebFilter;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
//
//@WebFilter("/*")
//public class ApiAuthFilter implements Filter {
//
//    static final int SC_UNAUTHORIZED = 401;
//
//    @Override
//    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//            throws IOException, ServletException {
//        HttpServletRequest req = (HttpServletRequest) request;
//        HttpServletResponse res = (HttpServletResponse) response;
//
//        if (req.getMethod().equals("OPTIONS")) {
//            // OPTIONSメソッドの場合はフィルタを適用せずに処理を継続する
//            chain.doFilter(request, response);
//            return;
//        }
//
//        if (req.getRequestURI().contains("/login") && req.getRequestURI().endsWith("/api/login")) {
//            chain.doFilter(request, response);
//            return;
//        }
//
//        if (req.getRequestURI().contains("/prefecture") && req.getRequestURI().endsWith("/api/prefecture")) {
//            chain.doFilter(request, response);
//            return;
//        }
//        
//        if (req.getRequestURI().contains("/users/add") && req.getRequestURI().endsWith("/api/users/add")) {
//            chain.doFilter(request, response);
//            return;
//        }
//        
//        if (req.getRequestURI().contains("/users/addDone") && req.getRequestURI().endsWith("/api/users/addDone")) {
//            chain.doFilter(request, response);
//            return;
//        }
//        
//        if (req.getRequestURI().contains("/users/checkDuplicate") && req.getRequestURI().endsWith("/api/users/checkDuplicate")) {
//            chain.doFilter(request, response);
//            return;
//        }
//        
//        HttpSession session = req.getSession();
//        CompanyData loginUser = (CompanyData) session.getAttribute("loginUser");
//        if (loginUser == null) {
//            // ログインユーザーが存在しない場合は401エラーを返す
//            System.out.println("Error:無効なユーザー");
//            res.setStatus(SC_UNAUTHORIZED);
//            return;
//        }
//        chain.doFilter(request, response);
//    }
//
//}
