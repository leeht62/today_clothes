# Today Clothes Frontend

Spring Boot 백엔드와 연동되는 React 프론트엔드 애플리케이션입니다.

## 기능

- **사용자 인증**: 회원가입, 로그인, 로그아웃
- **게시글 관리**: 게시글 목록 조회, 작성, 좋아요
- **AI 날씨 의상 추천**: 날씨 기반 의상 이미지 생성
- **실시간 순위**: 인기 게시글 순위 조회
- **반응형 디자인**: TailwindCSS를 사용한 모던한 UI

## 기술 스택

- React 18
- React Router DOM
- Axios (HTTP 클라이언트)
- TailwindCSS (스타일링)
- Vite (빌드 도구)

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## API 연동

이 프론트엔드는 다음 Spring Boot API 엔드포인트와 연동됩니다:

### 인증 API
- `POST /sign-up` - 회원가입
- `POST /sign-in` - 로그인
- `POST /logout` - 로그아웃

### 게시글 API
- `GET /boards/getBoard` - 게시글 목록 조회
- `GET /boards/{id}/read` - 게시글 상세 조회
- `POST /boards/write` - 게시글 작성
- `PUT /boards/{id}/modify` - 게시글 수정
- `PATCH /boards/{id}/delete` - 게시글 삭제
- `POST /boards/{id}/like` - 게시글 좋아요
- `POST /boards/{id}/unlike` - 게시글 좋아요 취소
- `GET /boards/top` - 인기 게시글 조회

### 날씨 API
- `GET /weather-image` - AI 의상 이미지 생성
- `GET /find-all-weather` - 모든 날씨 데이터 조회
- `GET /find-one-weather/{id}` - 특정 날씨 데이터 조회

### 댓글 API
- `GET /{boardId}/comment` - 댓글 조회
- `POST /{boardId}/weatherComments` - 날씨 댓글 작성
- `POST /{boardId}/boardComments` - 게시글 댓글 작성
- `PUT /{boardId}/boardComments/{commentId}` - 댓글 수정
- `PATCH /admin/{commentId}/deletecomment` - 댓글 삭제
- `POST /{boardId}/comment` - 댓글 작성

## 환경 설정

백엔드 서버가 `http://localhost:8080`에서 실행되어야 합니다.

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── Layout.jsx      # 메인 레이아웃
├── contexts/           # React Context
│   └── AuthContext.jsx # 인증 상태 관리
├── lib/                # 유틸리티 및 API 클라이언트
│   └── api.js          # Axios API 클라이언트
├── pages/              # 페이지 컴포넌트
│   ├── Home.jsx        # 홈페이지
│   ├── Login.jsx       # 로그인 페이지
│   ├── Register.jsx    # 회원가입 페이지
│   ├── Posts.jsx       # 게시글 페이지
│   ├── Weather.jsx     # 날씨 페이지
│   └── Ranking.jsx     # 순위 페이지
├── App.jsx             # 메인 앱 컴포넌트
├── main.jsx            # 앱 진입점
└── index.css           # 글로벌 스타일
```

## 주요 기능 설명

### 인증 시스템
- JWT 토큰 기반 인증
- 자동 토큰 갱신
- 로그인 상태 유지

### 게시글 시스템
- CRUD 기능 완전 지원
- 실시간 좋아요 기능
- 반응형 카드 레이아웃

### AI 날씨 추천
- 로그인 사용자만 접근 가능
- 날씨 기반 의상 이미지 생성
- 생성된 이미지 저장 및 조회

### 실시간 순위
- 좋아요 수 기반 순위 계산
- 동적 순위 업데이트
- 사용자 정의 표시 개수

## 개발 가이드

### 새로운 페이지 추가
1. `src/pages/` 폴더에 새 컴포넌트 생성
2. `src/App.jsx`에 라우트 추가
3. `src/components/Layout.jsx`에 네비게이션 링크 추가

### API 엔드포인트 추가
1. `src/lib/api.js`에 새 API 함수 추가
2. 필요한 페이지에서 import하여 사용

### 스타일 수정
- TailwindCSS 클래스 사용
- 커스텀 스타일은 `src/index.css`에 추가
