![header](https://capsule-render.vercel.app/api?type=waving&color=D8BFD8&height=150&section=header&text=today%20clothes&fontSize=40&fontColor=333333&desc=clothes%20e-commerce&descAlignY=70&descAlign=50)
## 👕1. 프로젝트 소개
Today Clothes는 FastAPI 기반 AI 이미지 처리 서버와 Spring Boot 백엔드를 연동한 AI 기반 의류 커머스 플랫폼입니다. 판매자는 의류 상품과 이미지를 등록할 수 있으며, AI 서버는 업로드된 이미지를 배경 제거 및 날씨 기반 스타일 이미지로 변환합니다. 사용자는 현재 날씨에 어울리는 의류 이미지를 확인하고, 상품을 주문 및 결제할 수 있습니다. 또한 생성된 코디 이미지와 상품 정보를 게시글로 공유하며 다른 사용자와 소통할 수 있습니다.

## ✨ 프로젝트 목표 (Solution)
사용자는 날씨 정보를 확인하더라도 실제로 어떤 옷차림이 적절한지 빠르게 판단하기 어렵고, 판매자는 상품 이미지를 날씨나 계절 상황에 맞게 가공해 노출하는 데 추가적인 비용과 시간이 필요합니다.

Today Clothes는 이 문제를 해결하기 위해 판매자가 등록한 의류 이미지를 AI가 날씨 기반 스타일 이미지로 변환하고, 사용자가 해당 이미지를 바탕으로 상품을 탐색·구매할 수 있도록 설계했습니다. 또한 주문, 결제, 재고, 할인 판매 흐름을 백엔드에서 관리하여 단순 추천을 넘어 실제 구매까지 이어지는 서비스를 목표로 했습니다.


## ⚙2. 개발 환경
* JDK 버젼 : JDK 17.  
* 데이터베이스 : PostgreSQL, Redis
* 개발 도구: IntelliJ IDEA,Visual Studio Code
* Java 17, Spring Boot 3.x, Gradle, Docker / Docker Compose

## ⚙️ 3. 기술 스택

* **Backend**
  <br>![Spring Boot](https://img.shields.io/badge/spring%20boot-%236DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white) ![WebSocket](https://img.shields.io/badge/websocket-%23ED8B00.svg?style=for-the-badge&logo=websocket&logoColor=white)
* **Frontend**
  <br>![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* **AI Server**
  <br>![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
* **Database**
  <br>![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
* **Infrastructure**
  <br>![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white) ![Docker Compose](https://img.shields.io/badge/docker%20compose-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![AWS EC2](https://img.shields.io/badge/AWS%20EC2-%23FF9900.svg?style=for-the-badge&logo=amazonec2&logoColor=white)

## 🕸️ 4. 아키텍처
<div align="center">
  <img width="500" height="855" alt="today-clothes drawios" src="https://github.com/user-attachments/assets/19fb0303-0794-46cc-aa03-df5c9487a9ed" />
</div>

## 📚 ERD
<div align="center">
 <img width="1448" height="1086" alt="ChatGPT Image 2026년 6월 16일 오전 10_11_34" src="https://github.com/user-attachments/assets/6f1acfe8-0461-4ef3-aee1-f690ee83e5e5" />
</div>


## ✨ 5. 주요 기능 소개

- 회원가입 / 로그인 / 로그아웃
- JWT 기반 인증 처리
- FastAPI 서버와 연동한 날씨 기반 AI 코디 추천
- 추천 결과 조회 및 저장
- 게시글 작성 / 조회 / 수정 / 삭제
- 댓글 작성 및 조회
- 게시글 좋아요 기능
- Redis 기반 좋아요 집계
- Redis Pub/Sub + WebSocket 기반 실시간 알림

### ❶ AI 의상제작 과정 
| ai 의상제작 | 저장된 의상 확인 | 작성된 게시글 |
| :---: | :---: | :---: |
|![ai 의상제작](https://github.com/user-attachments/assets/b430ae76-f43c-4d1f-be42-84bbede28a4e)| ![저장된 의상 확인](https://github.com/user-attachments/assets/23d69d5d-dd14-4c15-bf91-5903593a8cd2)|![겨울](https://github.com/user-attachments/assets/d227a56b-cfce-4091-bab2-b03d4aee286e)|

### ❷ 게시글 
|로그인 및 회원가입 | 실시간 순위 | 좋아요 기능 |
| :---: | :---: | :---: |
|![로그인 및 회원가입](https://github.com/user-attachments/assets/bbd86038-e30a-4267-9597-213664b308ad)| ![실시간 순위](https://github.com/user-attachments/assets/4359cac6-7bc0-4b4e-986e-d4d12b791dfc) | ![좋아요 기능](https://github.com/user-attachments/assets/e3d07a54-c37c-4bb9-b957-080ad68c67b7)



---

## 📂 6. 프로젝트 구조

```bash
today_clothes/
├─ frontend/               # React 프론트엔드
├─ server-backend/         # Spring Boot 백엔드
├─ ai-backend/             # FastAPI AI 서버
└─ README.md
```

### server-backend 주요 구조

```bash
server-backend/
├─ src/main/java/com/server/today_clothes
│  ├─ config/              # 보안, Redis, Web 설정
│  ├─ controller/          # API 엔드포인트
│  ├─ dto/                 # 요청/응답 DTO
│  ├─ jwt/                 # JWT 관련 로직
│  ├─ mapper/              # MyBatis Mapper 인터페이스
│  ├─ notification/        # Redis Pub/Sub, WebSocket 알림
│  ├─ service/             # 비즈니스 로직
│  └─ VO/                  # 도메인 객체
├─ src/main/resources
│  ├─ mapper/              # MyBatis XML
│  ├─ application.properties
│  └─ schema.sql
├─ Dockerfile
├─ docker-compose.yml
└─ build.gradle
```

---

## 📖 7. API 요약

### 인증

| Method | URL | 설명 |
| :--- | :--- | :--- |
| `POST` | `/sign-up` | 회원가입 |
| `POST` | `/sign-in` | 로그인 및 JWT 발급 |
| `POST` | `/logout` | 로그아웃 |

### 날씨 추천

| Method | URL | 설명 |
| :--- | :--- | :--- |
| `GET` | `/weather-image` | AI 코디 추천 생성 |
| `GET` | `/find-all-weather` | 사용자의 추천 결과 전체 조회 |
| `GET` | `/find-one-weather/{id}` | 추천 결과 단건 조회 |

### 게시판

| Method | URL | 설명 |
| :--- | :--- | :--- |
| `GET` | `/boards/getBoard` | 게시글 전체 조회 |
| `GET` | `/boards/{boardId}/read` | 게시글 상세 조회 |
| `POST` | `/boards/write` | 게시글 작성 |
| `PUT` | `/boards/{boardId}/modify` | 게시글 수정 |
| `PATCH` | `/boards/{boardId}/delete` | 게시글 삭제 |
| `POST` | `/boards/{boardId}/like` | 좋아요 |
| `POST` | `/boards/{boardId}/unlike` | 좋아요 취소 |
| `GET` | `/boards/top` | 인기 게시글 조회 |
| `GET` | `/boards/{boardId}/likes/count` | 좋아요 수 조회 |

### 댓글

| Method | URL | 설명 |
| :--- | :--- | :--- |
| `GET` | `/{boardId}/comment` | 댓글 조회 |
| `POST` | `/{boardId}/comment` | 댓글 작성 |
| `PATCH` | `/admin/{commentId}/deletecomment` | 댓글 삭제 |

---


## 🔑 8. 기술 선택 이유

### Spring Boot

- 인증, API 서버, 비즈니스 로직 구성을 안정적으로 구현하기 위해 사용했습니다.
- 다양한 Spring 생태계를 함께 활용하기 좋았습니다.

### FastAPI

- AI 관련 기능을 별도 서버로 분리해 역할을 명확히 나누기 위해 사용했습니다.
- Python 기반 AI 로직과의 연결이 자연스럽다는 장점이 있었습니다.

### PostgreSQL

- 사용자, 게시글, 댓글과 같은 정형 데이터를 안정적으로 관리하기 위해 사용했습니다.

### Redis

- 좋아요 집계와 실시간 알림 처리에서 빠른 응답이 필요해 사용했습니다.
- Pub/Sub와 캐시 기능을 함께 활용할 수 있었습니다.

### WebSocket

- 좋아요/댓글 이벤트를 실시간으로 사용자에게 전달하기 위해 사용했습니다.




