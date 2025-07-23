package com.server.today_clothes.VO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Board {
  private Long id;
  private User user;
  private String title;
  private String content;
  private LocalDateTime Date;

}
