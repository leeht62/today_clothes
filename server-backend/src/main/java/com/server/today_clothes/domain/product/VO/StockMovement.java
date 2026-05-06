package com.server.today_clothes.domain.product.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {
  private Long id;
  private Long productId;
  private String type;
  private Integer quantity;
  private String note;
  private LocalDateTime createdAt;
}