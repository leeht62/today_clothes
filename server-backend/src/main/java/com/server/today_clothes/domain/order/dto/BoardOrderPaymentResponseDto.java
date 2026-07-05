package com.server.today_clothes.domain.order.dto;

import com.server.today_clothes.domain.payment.dto.PaymentResponseDto;
import lombok.Getter;

@Getter
public class BoardOrderPaymentResponseDto {
  private final OrderResponseDto order;
  private final PaymentResponseDto payment;

  public BoardOrderPaymentResponseDto(OrderResponseDto order, PaymentResponseDto payment) {
    this.order = order;
    this.payment = payment;
  }
}
