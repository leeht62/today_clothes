package com.server.today_clothes.jwt;

import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class JwtLogout {
  private final RedisTemplate<String, Object> redisTemplate;
  private final JwtTokenProvider jwtTokenProvider;

  public void logout(String accessToken) {
    try {
      if (jwtTokenProvider.validateToken(accessToken)) {
        Date expiration = Jwts.parserBuilder()
            .setSigningKey(jwtTokenProvider.getKey())
            .build()
            .parseClaimsJws(accessToken)
            .getBody()
            .getExpiration();

        long now = System.currentTimeMillis();
        long ttl = expiration.getTime() - now;

        redisTemplate.opsForValue().set("logout:" + accessToken, "LOGOUT", ttl, TimeUnit.MILLISECONDS);
        log.info("Token added to Redis blacklist: {}", accessToken);
      }
    } catch (Exception e) {
      log.error("Logout failed for token {}: {}", accessToken, e.getMessage());
    }
  }
}