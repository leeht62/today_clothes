package com.server.today_clothes.domain.order.dto;

import com.server.today_clothes.domain.order.VO.OrderType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequestDto {
  private Long userId;
  private Long productId;
  private Integer quantity;
  private OrderType orderType;
}