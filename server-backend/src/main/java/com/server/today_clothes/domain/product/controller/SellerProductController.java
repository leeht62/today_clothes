package com.server.today_clothes.domain.product.controller;

import com.server.today_clothes.domain.product.VO.Product;
import com.server.today_clothes.domain.product.client.ProductAiImageClient;
import com.server.today_clothes.domain.product.dto.*;
import com.server.today_clothes.domain.product.service.ProductService;
import com.server.today_clothes.domain.seller.VO.Seller;
import com.server.today_clothes.domain.seller.service.SellerService;
import com.server.today_clothes.global.s3.PresignedUrlRequestDto;
import com.server.today_clothes.global.s3.PresignedUrlResponseDto;
import com.server.today_clothes.global.s3.S3PresignedUrlService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/seller/products")
@RequiredArgsConstructor
public class SellerProductController {

  private final ProductService productService;
  private final SellerService sellerService;
  private final S3PresignedUrlService  s3PresignedUrlService;
  private final ProductAiImageClient productAiImageClient;

  @PostMapping("/images/presigned-url")
  public ResponseEntity<PresignedUrlResponseDto> createProductImageUploadUrl(
      @RequestBody PresignedUrlRequestDto request
  ) {
    String userName = SecurityContextHolder.getContext().getAuthentication().getName();
    Seller seller = sellerService.findSellerByUserName(userName);

    PresignedUrlResponseDto response = s3PresignedUrlService.createProductImageUploadUrl(
        seller.getId(),
        request.getFileName(),
        request.getContentType()
    );

    return ResponseEntity.ok(response);
  }


  // 상품 등록
  @PostMapping
  public ResponseEntity<ProductResponseDto> register(@RequestBody ProductRequestDto request) {
    String userName = SecurityContextHolder.getContext().getAuthentication().getName();
    Seller seller = sellerService.findSellerByUserName(userName);

    String originalImageUrl = s3PresignedUrlService.buildImageUrl(
        seller.getId(),
        request.getOriginalImageKey()
    );

    Product product = Product.builder()
        .sellerId(seller.getId())
        .name(request.getName())
        .category(request.getCategory())
        .purchasePrice(request.getPurchasePrice())
        .salePrice(request.getSalePrice())
        .stock(request.getStock())
        .originalImage(originalImageUrl)
        .status("ACTIVE")
        .build();

    productService.registerProduct(product);

    return ResponseEntity.status(HttpStatus.CREATED).body(new ProductResponseDto(product));
  }

  @GetMapping
  public ResponseEntity<List<ProductResponseDto>> getMyProducts() {
    String userName = SecurityContextHolder.getContext().getAuthentication().getName();
    Seller seller = sellerService.findSellerByUserName(userName);

    List<ProductResponseDto> products = productService.findProductsBySeller(seller.getId())
        .stream()
        .map(ProductResponseDto::new)
        .collect(Collectors.toList());

    return ResponseEntity.ok(products);
  }

  @PostMapping("/{productId}/ai-image")
  public ResponseEntity<ProductResponseDto> requestAiImage(@PathVariable Long productId) {
    String userName = SecurityContextHolder.getContext().getAuthentication().getName();
    Seller seller = sellerService.findSellerByUserName(userName);

    Product product = productService.findProductOwnedBySeller(productId, seller.getId());

    if (product.getOriginalImage() == null || product.getOriginalImage().isBlank()) {
      throw new IllegalStateException("원본 이미지가 없는 상품입니다.");
    }

    ProductAiImageRequestDto request = ProductAiImageRequestDto.builder()
        .productId(product.getId())
        .originalImage(product.getOriginalImage())
        .productName(product.getName())
        .category(product.getCategory())
        .build();

    ProductAiImageResponseDto aiResponse = productAiImageClient.requestAiImage(request);

    Product updateProduct = Product.builder()
        .id(product.getId())
        .aiImage(aiResponse.getAiImageUrl())
        .build();

    productService.updateProduct(updateProduct);

    product.setAiImage(aiResponse.getAiImageUrl());

    return ResponseEntity.ok(new ProductResponseDto(product));
  }

  // 상품 수정
  @PutMapping("/{productId}")
  public ResponseEntity<Void> update(@PathVariable Long productId,
                                     @RequestBody ProductUpdateRequestDto request) {

    String userName = SecurityContextHolder.getContext().getAuthentication().getName();
    Seller seller = sellerService.findSellerByUserName(userName);

    productService.findProductOwnedBySeller(productId, seller.getId());

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
    String userName = SecurityContextHolder.getContext().getAuthentication().getName();
    Seller seller = sellerService.findSellerByUserName(userName);

    productService.findProductOwnedBySeller(productId, seller.getId());
    productService.increaseStock(productId, request.getQuantity(), request.getNote());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{productId}/discount")
  public ResponseEntity<Void> startDiscount(@PathVariable Long productId,
                                            @RequestBody ProductUpdateRequestDto request) {
    String userName = SecurityContextHolder.getContext().getAuthentication().getName();
    Seller seller = sellerService.findSellerByUserName(userName);

    productService.findProductOwnedBySeller(productId, seller.getId());
    productService.startDiscountSale(productId, request.getDiscountedStock(), request.getDiscountedPrice());
    return ResponseEntity.ok().build();
  }

}
