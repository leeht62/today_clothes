package com.server.today_clothes.global.config;


import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscountStockRedisService {

  private final RedisTemplate<String, Object> redisTemplate;

  public int tryPurchaseDiscount(Long productId, Long userId) {
    String stockKey = "product:" + productId + ":discounted_stock";
    String userKey = "user:" + userId + ":product:" + productId + ":discount";

    // 중복 체크
    Boolean isNew = redisTemplate.opsForValue()
        .setIfAbsent(userKey, "1", Duration.ofDays(1));
    if (Boolean.FALSE.equals(isNew)) return -2;

    // 재고 차감
    Long remaining = redisTemplate.opsForValue().decrement(stockKey);
    if (remaining < 0) {
      redisTemplate.opsForValue().increment(stockKey);
      redisTemplate.delete(userKey);
      return -1;
    }

    return 1;
  }

  // 서버 재시작 시 또는 할인 시작 시 Redis에 재고 세팅
  public void initDiscountedStock(Long productId, int stock) {
    String stockKey = "product:" + productId + ":discounted_stock";
    redisTemplate.opsForValue().set(stockKey, stock);
  }

  // DB 실패 시 Redis 롤백
  public void rollback(Long productId, Long userId) {
    String stockKey = "product:" + productId + ":discounted_stock";
    String userKey = "user:" + userId + ":product:" + productId + ":discount";
    redisTemplate.opsForValue().increment(stockKey);
    redisTemplate.delete(userKey);
  }

  //할인 중인 상품 목록 불러와 Redis 세팅. 데이터 정합성 보장
  @EventListener(ApplicationReadyEvent.class)
  public void syncDiscountedStockToRedis() {

  }

}