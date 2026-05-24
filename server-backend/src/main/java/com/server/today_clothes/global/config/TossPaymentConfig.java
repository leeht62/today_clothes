package com.server.today_clothes.global.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "toss.payment")
public class TossPaymentConfig {
  private String secretKey;
  private String confirmUrl;
}