package com.server.today_clothes.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RedisConfigChecker implements CommandLineRunner {

  @Value("${spring.data.redis.host}")
  private String redisHost;

  @Value("${spring.data.redis.port}")
  private int redisPort;

  @Override
  public void run(String... args) {
    System.out.println(">>> Redis Config Host: " + redisHost + ", Port: " + redisPort);
  }
}
