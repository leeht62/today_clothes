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

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {

  private final JwtTokenProvider jwtTokenProvider;
  private final RedisTemplate<String, Object> redisTemplate;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;

    // 인증이 필요없는 경로는 바로 통과
    String requestURI = httpRequest.getRequestURI();
    if (shouldNotFilter(requestURI)) {
      chain.doFilter(request, response);
      return;
    }

    try {
      // 1. Request Header에서 JWT 토큰 추출
      String token = resolveToken(httpRequest);

      // 2. validateToken으로 토큰 유효성 검사
      if (token != null && jwtTokenProvider.validateToken(token)) {
        String isLogout = (String) redisTemplate.opsForValue().get("logout:" + token);

        if (isLogout != null) {
          // RuntimeException 대신 401 응답 반환
          httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
          httpResponse.getWriter().write("{\"error\":\"이미 로그아웃된 토큰입니다.\"}");
          return;
        }

        // 토큰이 유효할 경우 토큰에서 Authentication 객체를 가지고 와서 SecurityContext에 저장
        Authentication authentication = jwtTokenProvider.getAuthentication(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
      }
    } catch (Exception e) {
      // 토큰 처리 중 오류가 발생해도 요청을 계속 진행
      logger.error("JWT 토큰 처리 중 오류 발생: " + e.getMessage());
    }

    chain.doFilter(request, response);
  }

  // 인증이 필요없는 경로 확인
  private boolean shouldNotFilter(String requestURI) {
    return requestURI.equals("/sign-up") ||
        requestURI.equals("/sign-in") ||
        requestURI.equals("/logout");
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