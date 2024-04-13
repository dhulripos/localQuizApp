package com.example.app.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.app.filter.ReactFilter;

@Configuration
public class ApplicationConfig implements WebMvcConfigurer {
//  //ここの下にAuthFilterを入れる
//  @Bean
//  FilterRegistrationBean<ApiAuthFilter>filterConfing(){
//      FilterRegistrationBean<ApiAuthFilter> bean = new FilterRegistrationBean<>();
//      bean.setFilter(new ApiAuthFilter());
//      bean.addUrlPatterns("/*");
//      return bean;
//  }

  @Bean
  FilterRegistrationBean<ReactFilter> reactFilterConfig() {
    FilterRegistrationBean<ReactFilter> bean = new FilterRegistrationBean<>();
    bean.setFilter(new ReactFilter());
    bean.setOrder(1);
    return bean;
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**").allowedOrigins("http://localhost:3000").allowedMethods("GET", "POST", "PUT", "DELETE")
        .allowedHeaders("Content-Type").allowCredentials(true);

  }
}
