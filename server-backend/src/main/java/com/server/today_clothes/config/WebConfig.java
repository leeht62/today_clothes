package com.server.today_clothes.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins(
            "https://today-clothes.shop",
            "https://www.today-clothes.shop"
        )
        .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
        .allowCredentials(true)
        .allowedHeaders("*");
  }
}