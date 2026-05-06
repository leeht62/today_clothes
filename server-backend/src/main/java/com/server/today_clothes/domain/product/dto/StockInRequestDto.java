package com.server.today_clothes.domain.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockInRequestDto {
  private Integer quantity;
  private String note;
}
