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
  void update(Product product);
  void updateStock(@Param("id") Long id, @Param("stock") int stock);
  void deleteById(Long id);
}