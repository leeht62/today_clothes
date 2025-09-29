package com.server.today_clothes.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {
  private final JwtTokenProvider jwtTokenProvider;
  private final RedisTemplate<String, Object> redisTemplate;
  private final List<String> permitAllUrls;


  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    String path = httpRequest.getRequestURI();

    // 1. 허용된 경로인지 먼저 확인하고, 해당하면 필터 체인을 계속 진행 후 즉시 반환
    if (permitAllUrls.contains(path)) {
      chain.doFilter(request, response);
      return;
    }

    // 2. 허용된 경로가 아닐 경우에만 JWT 토큰 검증 로직 실행
    String token = resolveToken((HttpServletRequest) request);
    HttpServletResponse res = (HttpServletResponse) response;

    // 3. validateToken으로 토큰 유효성 검사
    if (token != null && jwtTokenProvider.validateToken(token)) {
      String isLogout = (String) redisTemplate.opsForValue().get("logout:" + token);
      if (isLogout != null) {
        res.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
        res.setContentType("application/json");
        res.getWriter().write("{\"error\": \"이미 로그아웃된 토큰입니다.\"}");
        return; // 필터 체인 중단
      }
      // 토큰이 유효할 경우 토큰에서 Authentication 객체를 가지고 와서 SecurityContext에 저장
      Authentication authentication = jwtTokenProvider.getAuthentication(token);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    // 4. 다음 필터로 진행
    chain.doFilter(request, response);
  }

  // Request Header에서 토큰 정보 추출
  private String resolveToken(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }
}