package com.server.today_clothes.controller;


import com.server.today_clothes.dto.UserDto;
import com.server.today_clothes.jwt.JwtLogout;
import com.server.today_clothes.jwt.JwtToken;
import com.server.today_clothes.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;
  private final JwtLogout jwtLogout;

  @PostMapping("/sign-up")
  public ResponseEntity<?> join(@RequestBody UserDto userDto) {
    try {
      userService.saveUser(userDto);
      return ResponseEntity.ok().build();
    }catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
  }
  @PostMapping("/sign-in")
  public ResponseEntity<?> signIn(@RequestBody UserDto userDto) {
    try {
      UserDto userFromDb = userService.findByUserCode(userDto.getUserCode());
      String username = userFromDb.getUsername();

      String password = userDto.getPassword();
      log.info("userDto passwrod:{}",password);

      JwtToken jwtToken = userService.signIn(username,password);

      jwtToken.setUser(userFromDb);

      log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());
      return ResponseEntity.ok(jwtToken);

    } catch (UsernameNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body("사용자를 찾을 수 없습니다.");
    }catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
  }
  @PostMapping("/logout")
  public ResponseEntity<String> logout(@RequestHeader("Authorization") String bearerToken) {
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      String accessToken = bearerToken.substring(7);
      log.info("Extracted Access Token: {}", accessToken);
      jwtLogout.logout(accessToken);

      return ResponseEntity.ok("로그아웃 성공");
    }
    return ResponseEntity.badRequest().body("잘못된 토큰 형식입니다.");
  }


}
