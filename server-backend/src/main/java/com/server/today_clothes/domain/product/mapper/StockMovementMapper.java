package com.server.today_clothes.domain.product.mapper;

import com.server.today_clothes.domain.product.VO.StockMovement;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StockMovementMapper {
  void save(StockMovement stockMovement);
  List<StockMovement> findByProductId(Long productId);
  List<StockMovement> findByProductIdAndType(@Param("productId") Long productId, @Param("type") String type);
}