package com.server.today_clothes.controller;


import com.server.today_clothes.dto.UserDto;
import com.server.today_clothes.dto.UserLoginDto;
import com.server.today_clothes.jwt.JwtLogout;
import com.server.today_clothes.jwt.JwtToken;
import com.server.today_clothes.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  public JwtToken signIn(@RequestBody UserDto userDto) {
    log.info("로그인한 userDto = {}",userDto);
    log.info("로그인한 usercodessss = {}",userDto.getUserCode());
    UserDto userFromDb = userService.findByUserCode(userDto.getUserCode());
    log.info("로그인한 userFromDb = {}",userFromDb);
    log.info("로그인한 usercodess = {}",userDto.getUserCode());
    log.info("로그인한 usercodesss = {}",userDto.getUsername());
    String username = userFromDb.getUsername();
    String usercodes = userFromDb.getUserCode();
    log.info("로그인한 username = {}",username);
    log.info("로그인한 usercode = {}",usercodes);
    System.out.println("로그인한 usercode"+usercodes);
    JwtToken jwtToken = userService.signIn(username);

    jwtToken.setUser(userFromDb);

    log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());
    return jwtToken;
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
