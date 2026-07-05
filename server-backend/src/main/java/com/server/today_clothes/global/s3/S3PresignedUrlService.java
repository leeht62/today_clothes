package com.server.today_clothes.global.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3PresignedUrlService {

  private final S3Presigner s3Presigner;

  @Value("${aws.s3.bucket}")
  private String bucket;

  @Value("${aws.s3.public-base-url}")
  private String publicBaseUrl;

  public PresignedUrlResponseDto createProductImageUploadUrl(
      Long sellerId,
      String fileName,
      String contentType
  ) {
    validateImageContentType(contentType);

    String extension = extractExtension(fileName);
    String objectKey = "products/" + sellerId + "/" + UUID.randomUUID() + extension;

    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
        .bucket(bucket)
        .key(objectKey)
        .contentType(contentType)
        .build();

    Duration duration = Duration.ofMinutes(10);

    PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
        .signatureDuration(duration)
        .putObjectRequest(putObjectRequest)
        .build();

    String uploadUrl = s3Presigner.presignPutObject(presignRequest)
        .url()
        .toString();

    String imageUrl = publicBaseUrl + "/" + objectKey;

    return new PresignedUrlResponseDto(
        uploadUrl,
        objectKey,
        imageUrl,
        "PUT",
        Instant.now().plus(duration)
    );
  }

  public String buildImageUrl(Long sellerId, String objectKey) {
    validateSellerObjectKey(sellerId, objectKey);
    return publicBaseUrl + "/" + objectKey;
  }

  public void validateSellerObjectKey(Long sellerId, String objectKey) {
    String expectedPrefix = "products/" + sellerId + "/";

    if (!StringUtils.hasText(objectKey) || !objectKey.startsWith(expectedPrefix)) {
      throw new IllegalArgumentException("잘못된 상품 이미지 경로입니다.");
    }
  }

  private void validateImageContentType(String contentType) {
    if (!StringUtils.hasText(contentType) || !contentType.startsWith("image/")) {
      throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
    }
  }

  private String extractExtension(String fileName) {
    if (!StringUtils.hasText(fileName)) {
      return "";
    }

    int dotIndex = fileName.lastIndexOf(".");
    if (dotIndex < 0) {
      return "";
    }

    return fileName.substring(dotIndex).toLowerCase();
  }
}