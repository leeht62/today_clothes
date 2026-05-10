package com.server.today_clothes.domain.product.controller;

import com.server.today_clothes.domain.product.VO.Product;
import com.server.today_clothes.domain.product.dto.ProductRequestDto;
import com.server.today_clothes.domain.product.dto.ProductUpdateRequestDto;
import com.server.today_clothes.domain.product.dto.StockInRequestDto;
import com.server.today_clothes.domain.product.service.ProductService;
import com.server.today_clothes.domain.seller.VO.Seller;
import com.server.today_clothes.domain.seller.service.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/seller/products")
@RequiredArgsConstructor
public class SellerProductController {

  private final ProductService productService;
  private final SellerService sellerService;

  // 상품 등록
  @PostMapping
  public ResponseEntity<Void> register(@RequestBody ProductRequestDto request) {
    String userCode = SecurityContextHolder.getContext().getAuthentication().getName();
    Seller seller = sellerService.findSellerByUserCode(userCode);


    Product product = Product.builder()
        .sellerId(request.getSellerId())
        .name(request.getName())
        .category(request.getCategory())
        .purchasePrice(request.getPurchasePrice())
        .salePrice(request.getSalePrice())
        .stock(request.getStock())
        .originalImage(request.getOriginalImage())
        .build();

    productService.registerProduct(product);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  // 상품 수정
  @PutMapping("/{productId}")
  public ResponseEntity<Void> update(@PathVariable Long productId,
                                     @RequestBody ProductUpdateRequestDto request) {

    Product product = Product.builder()
        .id(productId)
        .name(request.getName())
        .category(request.getCategory())
        .salePrice(request.getSalePrice())
        .status(request.getStatus())
        .build();

    productService.updateProduct(product);
    return ResponseEntity.ok().build();
  }
  // 재고 입고
  @PostMapping("/{productId}/stock/in")
  public ResponseEntity<Void> stockIn(@PathVariable Long productId,
                                      @RequestBody StockInRequestDto request) {
    productService.increaseStock(productId, request.getQuantity(), request.getNote());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{productId}/discount")
  public ResponseEntity<Void> startDiscount(@PathVariable Long productId,
                                            @RequestBody ProductUpdateRequestDto request) {
    productService.startDiscountSale(productId, request.getDiscountedStock(), request.getDiscountedPrice());
    return ResponseEntity.ok().build();
  }

}
