package com.server.today_clothes.domain.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductRequestDto {
  private Long sellerId;
  private String name;
  private String category;
  private Integer purchasePrice;
  private Integer salePrice;
  private Integer stock;
  private String originalImage;
}
