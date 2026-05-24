package com.server.today_clothes.domain.order.dto;

import com.server.today_clothes.domain.order.VO.Order;
import com.server.today_clothes.domain.order.VO.OrderStatus;
import com.server.today_clothes.domain.order.VO.OrderType;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OrderResponseDto {
  private final Long id;
  private final Long userId;
  private final Long productId;
  private final Integer quantity;
  private final Long unitPrice;
  private final Long discountPrice;
  private final OrderType orderType;
  private final Long totalAmount;
  private final OrderStatus status;
  private final LocalDateTime reservedUntil;
  private final LocalDateTime createdAt;
  private final LocalDateTime updatedAt;

  public OrderResponseDto(Order order) {
    this.id = order.getId();
    this.userId = order.getUserId();
    this.productId = order.getProductId();
    this.quantity = order.getQuantity();
    this.unitPrice = order.getUnitPrice();
    this.discountPrice = order.getDiscountPrice();
    this.orderType = order.getOrderType();
    this.totalAmount = order.getTotalAmount();
    this.status = order.getStatus();
    this.reservedUntil = order.getReservedUntil();
    this.createdAt = order.getCreatedAt();
    this.updatedAt = order.getUpdatedAt();
  }
}