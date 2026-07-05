package com.server.today_clothes.global.s3;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignedUrlRequestDto {
  private String fileName;
  private String contentType;
}