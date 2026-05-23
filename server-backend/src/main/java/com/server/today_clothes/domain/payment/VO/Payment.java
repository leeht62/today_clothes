package com.server.today_clothes.domain.payment.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
  private Long id;
  private Long orderId;
  private Long userId;
  private String tossOrderId;
  private String paymentKey;
  private String idempotencyKey;
  private Long amount;
  private PaymentStatus status;
  private LocalDateTime paidAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

}
