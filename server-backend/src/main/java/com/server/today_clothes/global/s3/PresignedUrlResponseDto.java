package com.server.today_clothes.global.s3;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class PresignedUrlResponseDto {
  private String uploadUrl;
  private String objectKey;
  private String imageUrl;
  private String method;
  private Instant expiresAt;
}