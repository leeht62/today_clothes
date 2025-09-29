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
import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {

  private final JwtTokenProvider jwtTokenProvider;
  private final RedisTemplate<String, Object> redisTemplate;

  // permitAll 경로
  private static final List<String> PERMIT_ALL_URLS = Arrays.asList(
      "/sign-in",
      "/sign-up",
      "/logout"
  );

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;
    String path = httpRequest.getRequestURI();
    System.out.println("[JwtAuthenticationFilter] 진입: " + path);
    // 1. permitAll 경로면 필터 건너뛰기
    if (PERMIT_ALL_URLS.stream().anyMatch(path::startsWith)) {
      System.out.println("[JwtAuthenticationFilter] PERMIT_ALL 경로, 필터 건너뜀: " + path);
      chain.doFilter(request, response);

      return;
    }
    System.out.println("[JwtAuthenticationFilter] 필터 적용 경로: " + path);
    // 2. Request Header에서 JWT 토큰 추출
    String token = resolveToken(httpRequest);

    // 3. 토큰이 존재하면 검증
    if (token != null && jwtTokenProvider.validateToken(token)) {
      // 4. 로그아웃 체크
      String isLogout = (String) redisTemplate.opsForValue().get("logout:" + token);
      if (isLogout != null) {
        // 이미 로그아웃된 토큰이면 403
        httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
        httpResponse.setContentType("application/json");
        httpResponse.getWriter().write("{\"error\": \"이미 로그아웃된 토큰입니다.\"}");
        return;
      }
      // 5. 유효한 토큰이면 SecurityContext에 Authentication 저장
      Authentication authentication = jwtTokenProvider.getAuthentication(token);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    // 6. permitAll이 아니고 토큰이 없으면 인증 안된 상태로 그냥 다음 필터
    chain.doFilter(request, response);
  }

  private String resolveToken(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }
}
