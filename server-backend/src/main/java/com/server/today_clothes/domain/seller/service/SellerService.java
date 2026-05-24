package com.server.today_clothes.domain.seller.service;

import com.server.today_clothes.domain.seller.VO.Seller;
import com.server.today_clothes.domain.seller.dto.SellerRequestDto;
import com.server.today_clothes.domain.seller.mapper.SellerMapper;
import com.server.today_clothes.domain.user.VO.User;
import com.server.today_clothes.domain.user.mapper.UserMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerService {

  private final SellerMapper sellerMapper;
  private final UserMapper userMapper;

  // 판매자 등록
  @Transactional
  public void registerSeller(String userName, SellerRequestDto request) {
    User user = userMapper.findByUserName(userName)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

    if (sellerMapper.findByUserId(user.getId()) != null) {
      throw new IllegalStateException("이미 판매자로 등록된 계정입니다.");
    }

    Seller seller = new Seller();
    seller.setUserId(user.getId());
    seller.setShopName(request.getShopName());
    seller.setAddress(request.getAddress());
    seller.setPhone(request.getPhone());
    sellerMapper.save(seller);

    // role을 ROLE_SELLER로 변경
    user.setRole("ROLE_SELLER");
    userMapper.update(user);
  }

  // userCode로 seller 조회 (컨트롤러에서 JWT → userCode → seller)
  public Seller findSellerByUserName(String userName) {
    User user = userMapper.findByUserName(userName)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
    Seller seller = sellerMapper.findByUserId(user.getId());
    if (seller == null) throw new IllegalStateException("판매자 정보가 없습니다.");
    return seller;
  }

  // shop 정보 수정
  @Transactional
  public void updateSeller(String userName, SellerRequestDto request) {
    Seller seller = findSellerByUserName(userName);
    seller.setShopName(request.getShopName());
    seller.setAddress(request.getAddress());
    seller.setPhone(request.getPhone());
    sellerMapper.update(seller);
  }
}