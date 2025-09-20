package com.server.today_clothes.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.today_clothes.dto.MessageDto;
import com.server.today_clothes.mapper.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RedisService {
  private final RedisTemplate<String, String> redisTemplate;
  private final BoardMapper boardMapper;
  private final ObjectMapper objectMapper;


  // 게시글 좋아요 증가
  public void incrementBoardLike(Long boardId) {
    ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();
    zSetOps.incrementScore("board:likes", boardId.toString(), 1);
  }

  // 게시글 좋아요 감소 (취소)
  public void decrementBoardLike(Long boardId) {
    ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();
    zSetOps.incrementScore("board:likes", boardId.toString(), -1);
  }

  // 좋아요 순으로 상위 N개 조회
  public List<String> getTopBoards(int topN) {
    ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();
    return new ArrayList<>(zSetOps.reverseRange("board:likes", 0, topN - 1));
  }

  // 특정 게시글 좋아요 수 조회
  public Double getBoardLikeCount(Long boardId) {
    ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();
    return zSetOps.score("board:likes", boardId.toString());
  }

  public void publish(ChannelTopic topic, MessageDto message) {
    try {
      String json = objectMapper.writeValueAsString(message);
      redisTemplate.convertAndSend(topic.getTopic(), json);
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    }
  }

}
