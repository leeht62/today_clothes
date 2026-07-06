package com.server.today_clothes.domain.product.mapper;

import com.server.today_clothes.domain.product.VO.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductMapper {
  void save(Product product);
  Product findById(Long id);
  List<Product> findAll(@Param("category") String category, @Param("status") String status);
  List<Product> findAllBySellerId(Long sellerId);
  void updateDiscountedStock(@Param("id") Long id, @Param("discountedStock") int discountedStock);
  int decreaseDiscountedStockSafe(@Param("id") Long id, @Param("quantity") int quantity);
  void increaseDiscountedStock(@Param("id") Long id, @Param("quantity") int quantity);
  void update(Product product);
  void increaseStock(@Param("id") Long id, @Param("quantity") int quantity);
  int decreaseStock(@Param("id") Long id, @Param("quantity") int quantity);
  void deleteById(Long id);
  void detachBoardsFromProduct(Long productId);
}