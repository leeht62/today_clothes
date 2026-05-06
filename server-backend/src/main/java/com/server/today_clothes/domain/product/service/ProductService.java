package com.server.today_clothes.domain.product.service;
import com.server.today_clothes.domain.product.VO.Product;
import com.server.today_clothes.domain.product.VO.StockMovement;
import com.server.today_clothes.domain.product.mapper.ProductMapper;
import com.server.today_clothes.domain.product.mapper.StockMovementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

  private final ProductMapper productMapper;
  private final StockMovementMapper stockMovementMapper;

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

  // 전체 상품 조회 (카테고리, 상태 필터)
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

  // 입고 처리 (IN)
  @Transactional
  public void increaseStock(Long productId, int quantity, String note) {
    Product product = findProduct(productId);

    int newStock = product.getStock() + quantity;
    productMapper.updateStock(productId, newStock);

    StockMovement movement = new StockMovement();
    movement.setProductId(productId);
    movement.setType("IN");
    movement.setQuantity(quantity);
    movement.setNote(note);
    stockMovementMapper.save(movement);
  }

  // 출고 처리 (OUT) - 음수재고 방지 패턴
  @Transactional
  public void decreaseStock(Long productId, int quantity, String note) {
    Product product = findProduct(productId);

    if (product.getStock() < quantity) {
      throw new IllegalStateException("재고가 부족합니다. 현재 재고: " + product.getStock());
    }

    int newStock = product.getStock() - quantity;
    productMapper.updateStock(productId, newStock);

    StockMovement movement = new StockMovement();
    movement.setProductId(productId);
    movement.setType("OUT");
    movement.setQuantity(quantity);
    movement.setNote(note);
    stockMovementMapper.save(movement);
  }

  // 재고 조정 (ADJUST)
  @Transactional
  public void adjustStock(Long productId, int newStock, String note) {
    findProduct(productId);

    if (newStock < 0) {
      throw new IllegalArgumentException("재고는 0 이상이어야 합니다.");
    }

    productMapper.updateStock(productId, newStock);

    StockMovement movement = new StockMovement();
    movement.setProductId(productId);
    movement.setType("ADJUST");
    movement.setQuantity(newStock);
    movement.setNote(note);
    stockMovementMapper.save(movement);
  }

  // 상품 삭제
  public void deleteProduct(Long id) {
    productMapper.deleteById(id);
  }
}