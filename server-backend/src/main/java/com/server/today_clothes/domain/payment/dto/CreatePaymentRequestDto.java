package com.server.today_clothes.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePaymentRequestDto {
  private Long orderId;
  private Long userId;
}