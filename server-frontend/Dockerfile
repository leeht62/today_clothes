# 1단계: 빌드 환경 설정
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# 2단계: 경량 웹 서버 설정
FROM nginx:1.24-alpine

# Nginx의 기본 웹 루트 디렉토리에 리액트 빌드 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 기본 Nginx 설정 파일 대신 커스텀 설정 파일 사용 (선택 사항)
# COPY nginx.conf /etc/nginx/nginx.conf

# 컨테이너 시작 시 Nginx 실행
CMD ["nginx", "-g", "daemon off;"]