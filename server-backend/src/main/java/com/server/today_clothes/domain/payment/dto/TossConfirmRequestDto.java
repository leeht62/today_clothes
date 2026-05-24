package com.server.today_clothes.domain.payment.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TossConfirmRequestDto {
  private String paymentKey;
  private String orderId;
  private Long amount;
}
