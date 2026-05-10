package com.server.today_clothes.domain.product.VO;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
  private Long id;
  private Long sellerId;
  private String name;
  private String category;
  private Integer purchasePrice;
  private Integer salePrice;
  private Integer discountedPrice;
  private Integer stock;
  private Integer discountedStock;
  private String originalImage;
  private String aiImage;
  private String status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}