package com.server.today_clothes.domain.seller.mapper;

import com.server.today_clothes.domain.seller.VO.Seller;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SellerMapper {
  void save(Seller seller);
  Seller findByUserId(Long id);
  Seller findById(Long id);
  void update(Seller seller);
}
