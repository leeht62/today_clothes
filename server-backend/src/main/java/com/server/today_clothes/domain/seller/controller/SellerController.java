package com.server.today_clothes.domain.seller.controller;

import com.server.today_clothes.domain.seller.VO.Seller;
import com.server.today_clothes.domain.seller.dto.SellerRequestDto;
import com.server.today_clothes.domain.seller.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/seller")
@RequiredArgsConstructor
public class SellerController {

  private final SellerService sellerService;

  @PostMapping("/register")
  public ResponseEntity<Void> register(@RequestBody SellerRequestDto request) {
    String userCode = SecurityContextHolder.getContext().getAuthentication().getName();
    sellerService.registerSeller(userCode, request);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @GetMapping("/me")
  public ResponseEntity<Seller> getMyInfo() {
    String userCode = SecurityContextHolder.getContext().getAuthentication().getName();
    return ResponseEntity.ok(sellerService.findSellerByUserCode(userCode));
  }

  @PutMapping("/me")
  public ResponseEntity<Void> updateMyInfo(@RequestBody SellerRequestDto request) {
    String userCode = SecurityContextHolder.getContext().getAuthentication().getName();
    sellerService.updateSeller(userCode, request);
    return ResponseEntity.ok().build();
  }
}