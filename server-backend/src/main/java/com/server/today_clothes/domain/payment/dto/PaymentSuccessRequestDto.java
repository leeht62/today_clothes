package com.server.today_clothes.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentSuccessRequestDto {
  private String paymentKey;
  private String orderId;
  private Long amount;
}