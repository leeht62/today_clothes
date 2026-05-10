package com.server.today_clothes.domain.product.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductUpdateRequestDto {
  private String name;
  private String category;
  private Integer salePrice;
  private Integer discountedStock;
  private Integer discountedPrice;
  private String status;
}
