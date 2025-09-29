package com.server.today_clothes.config;

import com.server.today_clothes.jwt.JwtAuthenticationFilter;
import com.server.today_clothes.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
  private final JwtTokenProvider jwtTokenProvider;
  private final RedisTemplate<String, Object> redisTemplate;

  // 허용할 URL은 SecurityConfig 내부에서 설정하고, JwtAuthenticationFilter에는 넘기지 않음
  // JwtAuthenticationFilter는 토큰 검증에만 집중하는 역할로 변경
  private static final List<String> PERMIT_ALL_URLS = Arrays.asList(
      "/sign-in",
      "/sign-up",
      "/logout",
      "/api/**" // 예시: API 경로 중 일부를 허용할 경우
  );

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    // Spring Security가 제공하는 addFilterBefore 메서드를 사용해 필터 등록
    http
        .cors(Customizer.withDefaults())
        .httpBasic(basic -> basic.disable())
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // 권한 설정 부분을 명확하게 변경
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers(
                "/sign-in",
                "/sign-up",
                "/logout"
            ).permitAll() // 토큰 없이 접근 가능한 경로
            .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
        )
        .logout(logout -> logout.disable())

        // JWT 필터 등록
        .addFilterBefore(
            new JwtAuthenticationFilter(jwtTokenProvider, redisTemplate), // permitAllUrls 제거
            UsernamePasswordAuthenticationFilter.class
        );

    return http.build();
  }

  // 기존 CorsConfigurationSource와 PasswordEncoder 빈은 그대로 유지
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("https://today-clothes.shop", "http://today-clothes.shop"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }
}