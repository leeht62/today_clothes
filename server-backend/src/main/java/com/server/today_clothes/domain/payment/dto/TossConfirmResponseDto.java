package com.server.today_clothes.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TossConfirmResponseDto {
  private String paymentKey;
  private String orderId;
  private String status;
  private String method;
  private Long totalAmount;
  private String approvedAt;
}