package com.server.today_clothes.domain.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductAiImageResponseDto {
  private Long productId;
  private String aiImageUrl;
}