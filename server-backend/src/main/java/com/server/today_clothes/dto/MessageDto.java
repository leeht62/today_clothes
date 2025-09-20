package com.server.today_clothes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto implements Serializable {
  private String type;
  private String message;
  private String receiver;
  private Long boardId;
}
