package com.server.today_clothes.domain.product.controller;

import com.server.today_clothes.domain.product.dto.ProductResponseDto;
import com.server.today_clothes.domain.product.dto.PurchaseRequestDto;
import com.server.today_clothes.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
  private final ProductService productService;

  // 전체 상품 조회
  @GetMapping
  public ResponseEntity<List<ProductResponseDto>> getProducts(
      @RequestParam(required = false) String category,
      @RequestParam(required = false, defaultValue = "ACTIVE") String status) {
    List<ProductResponseDto> products = productService.findAllProducts(category, status)
        .stream()
        .map(ProductResponseDto::new)
        .collect(Collectors.toList());
    return ResponseEntity.ok(products);
  }

  // 상품 단건 조회
  @GetMapping("/{productId}")
  public ResponseEntity<ProductResponseDto> getProduct(@PathVariable Long productId) {
    return ResponseEntity.ok(new ProductResponseDto(productService.findProduct(productId)));
  }

  // 구매 및 재고차감
  @PostMapping("/{productId}/purchase")
  public ResponseEntity<Void> purchase(@PathVariable Long productId,
                                       @RequestBody PurchaseRequestDto request) {
    productService.decreaseStock(productId, request.getQuantity(), "구매");
    return ResponseEntity.ok().build();
  }
}
