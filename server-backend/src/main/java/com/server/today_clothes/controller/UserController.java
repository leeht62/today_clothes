package com.server.today_clothes.controller;


import com.server.today_clothes.VO.User;
import com.server.today_clothes.dto.UserDto;
import com.server.today_clothes.jwt.JwtToken;
import com.server.today_clothes.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;
  @PostMapping("/sign-up")
  public ResponseEntity<?> join(@RequestBody UserDto userDto) {
    try {
      userService.saveUser(userDto);
      return ResponseEntity.ok().build();
    }catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
  }



}
