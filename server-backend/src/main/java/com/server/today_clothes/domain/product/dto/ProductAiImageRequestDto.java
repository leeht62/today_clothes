package com.server.today_clothes.domain.product.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductAiImageRequestDto {
  private Long productId;
  private String originalImage;
  private String productName;
  private String category;
}