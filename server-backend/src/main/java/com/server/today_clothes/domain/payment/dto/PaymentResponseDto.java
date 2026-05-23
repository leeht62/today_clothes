package com.server.today_clothes.domain.payment.dto;

import com.server.today_clothes.domain.payment.VO.Payment;
import com.server.today_clothes.domain.payment.VO.PaymentStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PaymentResponseDto {
  private final Long id;
  private final Long orderId;
  private final Long userId;
  private final String tossOrderId;
  private final String paymentKey;
  private final String idempotencyKey;
  private final Long amount;
  private final PaymentStatus status;
  private final LocalDateTime paidAt;
  private final LocalDateTime createdAt;
  private final LocalDateTime updatedAt;

  public PaymentResponseDto(Payment payment) {
    this.id = payment.getId();
    this.orderId = payment.getOrderId();
    this.userId = payment.getUserId();
    this.tossOrderId = payment.getTossOrderId();
    this.paymentKey = payment.getPaymentKey();
    this.idempotencyKey = payment.getIdempotencyKey();
    this.amount = payment.getAmount();
    this.status = payment.getStatus();
    this.paidAt = payment.getPaidAt();
    this.createdAt = payment.getCreatedAt();
    this.updatedAt = payment.getUpdatedAt();
  }
}