package com.server.today_clothes.domain.product.dto;

import com.server.today_clothes.domain.product.VO.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class ProductResponseDto {
  private Long id;
  private String name;
  private String category;
  private Integer salePrice;
  private Integer discountedPrice;
  private Integer stock;
  private String aiImage;
  private String status;

  public ProductResponseDto(Product product) {
    this.id = product.getId();
    this.name = product.getName();
    this.category = product.getCategory();
    this.salePrice = product.getSalePrice();
    this.discountedPrice = product.getDiscountedPrice();
    this.stock = product.getStock();
    this.aiImage = product.getAiImage();
    this.status = product.getStatus();
  }
}
