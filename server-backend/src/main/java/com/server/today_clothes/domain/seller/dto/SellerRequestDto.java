package com.server.today_clothes.domain.seller.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SellerRequestDto {
  private String shopName;
  private String address;
  private String phone;
}
