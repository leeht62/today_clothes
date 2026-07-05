package com.server.today_clothes.domain.board.dto;

import com.server.today_clothes.domain.board.VO.Board;
import lombok.Getter;

@Getter
public class ProductInfo {
  private Long id;
  private String name;
  private String category;
  private Integer salePrice;
  private String originalImage;
  private String aiImage;
  private String displayImage;

  public ProductInfo(Board board) {
    var product = board.getProduct();

    this.id = product.getId();
    this.name = product.getName();
    this.category = product.getCategory();
    this.salePrice = product.getSalePrice();
    this.originalImage = product.getOriginalImage();
    this.aiImage = product.getAiImage();

    this.displayImage =
        product.getAiImage() != null && !product.getAiImage().isBlank()
            ? product.getAiImage()
            : product.getOriginalImage();
  }
}
