package com.server.today_clothes.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOriginPatterns(
            "http://localhost:3000",
            "http://devcourse-testing.shop",
            "http://www.devcourse-testing.shop",
            "https://devcourse-testing.shop",
            "https://www.devcourse-testing.shop"
        )
        .allowCredentials(false)
        .allowedMethods("*");
  }
}