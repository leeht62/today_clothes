package com.server.today_clothes.domain.product.service;
import com.server.today_clothes.domain.product.VO.Product;
import com.server.today_clothes.domain.product.VO.StockMovement;
import com.server.today_clothes.domain.product.mapper.ProductMapper;
import com.server.today_clothes.domain.product.mapper.StockMovementMapper;
import com.server.today_clothes.global.config.DiscountStockRedisService;
import org.springframework.security.access.AccessDeniedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

  private final ProductMapper productMapper;
  private final StockMovementMapper stockMovementMapper;
  private final DiscountStockRedisService discountStockRedisService;

  // 상품 등록
  public void registerProduct(Product product) {
    productMapper.save(product);
  }

  // 상품 단건 조회
  public Product findProduct(Long id) {
    Product product = productMapper.findById(id);
    if (product == null) throw new IllegalArgumentException("존재하지 않는 상품입니다.");
    return product;
  }

  public Product findProductOwnedBySeller(Long productId, Long sellerId) {
    Product product = findProduct(productId);

    if (!product.getSellerId().equals(sellerId)) {
      throw new AccessDeniedException("본인 상품만 관리할 수 있습니다.");
    }

    return product;
  }


  // 전체 상품 조회
  public List<Product> findAllProducts(String category, String status) {
    return productMapper.findAll(category, status);
  }

  // 판매자별 상품 조회
  public List<Product> findProductsBySeller(Long sellerId) {
    return productMapper.findAllBySellerId(sellerId);
  }

  // 상품 정보 수정
  public void updateProduct(Product product) {
    productMapper.update(product);
  }

  // 입고 처리
  @Transactional
  public void increaseStock(Long productId, int quantity, String note) {

    productMapper.increaseStock(productId, quantity);

    StockMovement movement = new StockMovement();
    movement.setProductId(productId);
    movement.setType("IN");
    movement.setQuantity(quantity);
    movement.setNote(note);
    stockMovementMapper.save(movement);
  }

  // 출고 처리
  @Transactional
  public void decreaseStock(Long productId, int quantity, String note) {
    Product product = findProduct(productId);

    if (quantity <= 0) {
      throw new IllegalArgumentException("차감 수량은 1 이상이어야 합니다.");
    }

    int updated = productMapper.decreaseStock(productId, quantity);

    if (updated == 0) {
      throw new IllegalStateException("재고가 부족합니다. 현재 재고: " + product.getStock());
    }

    StockMovement movement = new StockMovement();
    movement.setProductId(productId);
    movement.setType("OUT");
    movement.setQuantity(quantity);
    movement.setNote(note);
    stockMovementMapper.save(movement);
  }

  // 상품 삭제
  @Transactional
  public void deleteProduct(Long id) {
    productMapper.detachBoardsFromProduct(id);
    productMapper.deleteById(id);

  }

  public void startDiscountSale(Long productId, int discountedStock, int discountedPrice) {
    Product product = findProduct(productId);
    product.setDiscountedStock(discountedStock);
    product.setDiscountedPrice(discountedPrice);
    productMapper.update(product);
    productMapper.updateDiscountedStock(productId, discountedStock);

    // Redis에 재고 세팅
    discountStockRedisService.initDiscountedStock(productId, discountedStock);
  }

  @Transactional
  public void reserveDiscountStock(Long productId, Long userId, int quantity) {
    if (quantity <= 0) {
      throw new IllegalArgumentException("주문 수량은 1 이상이어야 합니다.");
    }

    int result = discountStockRedisService.tryReserveDiscount(productId, userId, quantity);

    if (result == -1) {
      throw new IllegalStateException("할인 재고가 부족합니다.");
    }

    if (result == -2) {
      throw new IllegalStateException("할인 상품은 한 번만 구매할 수 있습니다.");
    }

    int updated = productMapper.decreaseDiscountedStockSafe(productId, quantity);

    if (updated == 0) {
      discountStockRedisService.rollbackDiscountReservation(productId, userId, quantity);
      throw new IllegalStateException("할인 재고가 부족합니다.");
    }

    StockMovement movement = new StockMovement();
    movement.setProductId(productId);
    movement.setType("OUT");
    movement.setQuantity(quantity);
    movement.setNote("할인 주문 재고 선점 - userId: " + userId);
    stockMovementMapper.save(movement);
  }

  @Transactional
  public void rollbackDiscountStock(Long productId, Long userId, int quantity, String note) {
    if (quantity <= 0) {
      return;
    }

    productMapper.increaseDiscountedStock(productId, quantity);
    discountStockRedisService.rollbackDiscountReservation(productId, userId, quantity);

    StockMovement movement = new StockMovement();
    movement.setProductId(productId);
    movement.setType("IN");
    movement.setQuantity(quantity);
    movement.setNote(note);
    stockMovementMapper.save(movement);
  }

  public void rollbackDiscountRedisOnly(Long productId, Long userId, int quantity) {
    discountStockRedisService.rollbackDiscountReservation(productId, userId, quantity);
  }
}