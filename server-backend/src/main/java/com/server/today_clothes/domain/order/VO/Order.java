package com.server.today_clothes.domain.order.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
  private Long id;
  private Long userId;
  private Long productId;
  private Integer quantity;
  private Long unitPrice;
  private Long discountPrice;
  private OrderType orderType;
  private Long totalAmount;
  private OrderStatus status;
  private LocalDateTime reservedUntil;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}