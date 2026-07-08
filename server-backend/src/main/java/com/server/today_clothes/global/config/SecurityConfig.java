package com.server.today_clothes.global.config;

import com.server.today_clothes.global.jwt.JwtAuthenticationFilter;
import com.server.today_clothes.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {
  private final JwtTokenProvider jwtTokenProvider;
  private final RedisTemplate<String, Object> redisTemplate;




  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    log.info("[SecurityConfig] SecurityFilterChain Bean 생성됨");
    System.out.println("[SecurityConfig] SecurityFilterChain Bean 생성됨");

    return http
        .cors(Customizer.withDefaults())
        // REST API이므로 basic auth 및 csrf 보안을 사용하지 않음
        .httpBasic(basic -> basic.disable())
        .csrf(csrf -> csrf.disable())


        // JWT를 사용하기 때문에 세션을 사용하지 않음
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // 요청에 대한 권한 설정
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/sign-in", "/sign-up").permitAll()
            .requestMatchers(HttpMethod.GET, "/payments/success", "/payments/fail").permitAll()
            .requestMatchers("/logout").authenticated()
            .requestMatchers(HttpMethod.GET, "/boards/**").permitAll()
            .requestMatchers("/ws/**").permitAll()
            .requestMatchers("/weather-image", "/find-all-weather").authenticated()
            .requestMatchers(HttpMethod.POST, "/boards/**").authenticated()
            .requestMatchers(HttpMethod.PUT, "/boards/**").authenticated()
            .requestMatchers(HttpMethod.PATCH, "/boards/**").authenticated()
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .logout(logout -> logout.disable())
        // JWT 필터 등록
        .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider,redisTemplate), UsernamePasswordAuthenticationFilter.class)

        .build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    // BCrypt Encoder 사용
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }
}




