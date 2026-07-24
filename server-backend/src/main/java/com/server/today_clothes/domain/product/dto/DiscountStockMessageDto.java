package com.server.today_clothes.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiscountStockMessageDto {
  private Long productId;
  private int remainingStock;
}