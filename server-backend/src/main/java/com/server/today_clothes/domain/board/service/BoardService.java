package com.server.today_clothes.domain.board.service;


import com.server.today_clothes.domain.board.VO.Board;
import com.server.today_clothes.domain.board.dto.BoardDetailDto;
import com.server.today_clothes.domain.product.service.ProductService;
import com.server.today_clothes.domain.seller.VO.Seller;
import com.server.today_clothes.domain.seller.service.SellerService;
import com.server.today_clothes.global.notification.websocket.MessageService;
import com.server.today_clothes.global.config.RedisService;
import com.server.today_clothes.domain.user.VO.User;
import com.server.today_clothes.domain.board.dto.BoardDto;
import com.server.today_clothes.domain.comment.dto.MessageDto;
import com.server.today_clothes.domain.board.mapper.BoardMapper;
import com.server.today_clothes.domain.user.mapper.UserMapper;
import com.server.today_clothes.domain.weather.mapper.WeatherMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
  private final BoardMapper boardMapper;
  private final UserMapper userMapper;
  private final WeatherMapper weatherMapper;
  private final RedisService redisService;
  private final RedisTemplate<String, Object> redisTemplate;
  private final MessageService messageService;
  private final ProductService productService;
  private final SellerService sellerService;

  public BoardDto saveSellerProductBoard(BoardDto boardDto, String username) {
    User user = userMapper.findByUserName(username).orElseThrow();
    Seller seller = sellerService.findSellerByUserName(username);

    productService.findProductOwnedBySeller(boardDto.getProductId(), seller.getId());

    Board board = new Board(boardDto);
    board.setUser(user);

    boardMapper.save(board);

    return new BoardDto(board);
  }

  public void deleteBoard(Long id){
    boardMapper.deleteById(id);
  }

  public BoardDto findBoard(Long id){
    Board board=boardMapper.findById(id);
    BoardDto dto = new BoardDto();
    dto.setId(board.getId());
    dto.setTitle(board.getTitle());
    dto.setProductId(board.getProductId());
    dto.setContent(board.getContent());
    dto.setWeatherId(board.getWeather() != null ? board.getWeather().getId() : null);
    return dto;
  }

  public BoardDetailDto findBoardDetail(Long id) {
    Board board = boardMapper.findById(id);
    return new BoardDetailDto(board);
  }

  public List<BoardDto> findAllBoard(){
    List<Board> boardDtos=boardMapper.findAll();
    List<BoardDto> BoardDtoList = new ArrayList<>();
    for(Board board : boardDtos){
      BoardDto mainDto = new BoardDto(board);
      BoardDtoList.add(mainDto);
    }
    return BoardDtoList;
  }
  public Double getBoardLikeCount(Long boardId) {
    return redisService.getBoardLikeCount(boardId);
  }
  public void update(BoardDto boardDto){
    Board board=new Board(boardDto);
    boardMapper.update(board);
  }

  // 좋아요 취소
  public void unlikeBoard(Long boardId, String userName) {
    User user =  userMapper.findByUserName(userName).orElseThrow();
    boardMapper.deleteLike(user.getId(), boardId);
    redisService.decrementBoardLike(boardId);
  }

  // 좋아요 순 상위 게시글 조회
  public List<BoardDto> findTopBoards(int topN) {
    List<String> topBoardIds = redisService.getTopBoards(topN);
    List<BoardDto> topBoards = new ArrayList<>();
    for(String idStr : topBoardIds){
      Long id = Long.parseLong(idStr);
      topBoards.add(findBoard(id));
    }
    return topBoards;
  }
  //좋아요 추가+ 글쓴이에게 메시지 발송
  public void likeBoard(Long boardId, String userName) {
    Board board = boardMapper.findById(boardId);
    User user =  userMapper.findByUserName(userName).orElseThrow();
    boardMapper.insertLike(user.getId(), boardId);
    redisService.incrementBoardLike(boardId);

    MessageDto event = new MessageDto(
        "LIKE",
        "회원 " + userName + "님이 게시글을 좋아합니다.",
        board.getUser().getUsername(),
        boardId
    );
    messageService.publishNotification(board.getUser().getUsername(), event);
  }



}
