# Today Clothes EC2 Deployment Notes

이 문서는 `devcourse-testing.shop` 배포 과정에서 진행한 EC2, Route 53, Nginx, React, HTTPS, Docker 관련 작업 순서를 정리한 기록입니다.

## 1. EC2 접속 준비

1. AWS EC2 Medium 인스턴스를 생성했습니다.
2. `ssmkey.pem` 키 파일을 받았습니다.
3. Git Bash에서 SSH로 EC2에 접속했습니다.
4. EC2에 Java를 설치했습니다.
5. GitHub 저장소를 clone 했습니다.

```bash
git clone <repository-url>
```

## 2. 도메인 연결

가비아에서 구매한 도메인:

```txt
devcourse-testing.shop
```

Route 53 Hosted Zone을 생성하고, Route 53에서 받은 NS 4개를 가비아 네임서버에 등록했습니다.

```txt
ns-786.awsdns-34.net
ns-39.awsdns-04.com
ns-1974.awsdns-54.co.uk
ns-1194.awsdns-21.org
```

Route 53에는 A 레코드를 생성했습니다.

```txt
devcourse-testing.shop       A    3.34.212.43
www.devcourse-testing.shop   A    3.34.212.43
```

DNS 확인:

```bash
dig @8.8.8.8 devcourse-testing.shop A +short
dig @8.8.8.8 www.devcourse-testing.shop A +short
```

정상 응답:

```txt
3.34.212.43
```

## 3. Nginx HTTP 설정

EC2에 Nginx를 설치했습니다.

```bash
sudo apt update
sudo apt install nginx -y
```

Nginx 설정 파일을 생성했습니다.

```bash
sudo nano /etc/nginx/sites-available/today-clothes
```

설정 내용:

```nginx
server {
    listen 80;
    server_name devcourse-testing.shop www.devcourse-testing.shop;

    root /var/www/today-clothes;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

설정 활성화:

```bash
sudo ln -s /etc/nginx/sites-available/today-clothes /etc/nginx/sites-enabled/today-clothes
sudo rm /etc/nginx/sites-enabled/default
```

검사 및 재시작:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 4. React 프론트 배포

프론트엔드 디렉터리로 이동했습니다.

```bash
cd ~/today_clothes/server-frontend
```

Node.js와 npm을 설치했습니다.

```bash
sudo apt install nodejs npm -y
```

프론트 빌드:

```bash
npm install
npm run build
```

빌드 결과를 Nginx 정적 파일 경로로 복사했습니다.

```bash
sudo mkdir -p /var/www/today-clothes
sudo cp -r dist/* /var/www/today-clothes/
sudo chown -R www-data:www-data /var/www/today-clothes
sudo systemctl restart nginx
```

HTTP 확인:

```bash
curl -I http://devcourse-testing.shop
curl -I http://www.devcourse-testing.shop
curl -I http://localhost
```

정상 응답:

```txt
HTTP/1.1 200 OK
```

## 5. HTTPS 적용

Certbot을 설치했습니다.

```bash
sudo apt install certbot python3-certbot-nginx -y
```

인증서 발급:

```bash
sudo certbot --nginx -d devcourse-testing.shop -d www.devcourse-testing.shop
```

처음에는 Nginx 설정의 `server_name`이 `.com`으로 되어 있어 자동 설치가 실패했습니다.

잘못된 설정:

```nginx
server_name devcourse-testing.com www.devcourse-testing.com;
```

올바른 설정:

```nginx
server_name devcourse-testing.shop www.devcourse-testing.shop;
```

수정 후 Nginx 검사 및 reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

이미 발급된 인증서를 Nginx에 설치했습니다.

```bash
sudo certbot install --cert-name devcourse-testing.shop
```

성공 메시지:

```txt
Successfully deployed certificate for devcourse-testing.shop
Successfully deployed certificate for www.devcourse-testing.shop
```

HTTPS 확인:

```bash
curl -I https://devcourse-testing.shop
curl -I https://www.devcourse-testing.shop
```

## 6. 최신 프론트 반영

EC2에서 최신 코드를 받으려고 `git pull`을 실행했을 때, EC2에서 생성된 `dist` 변경 때문에 pull이 막혔습니다.

에러:

```txt
error: Your local changes to the following files would be overwritten by merge:
        server-frontend/dist/index.html
```

해결:

```bash
cd ~/today_clothes
git restore server-frontend/dist
git clean -fd server-frontend/dist
git pull
```

이후 프론트 재빌드 및 재배포:

```bash
cd ~/today_clothes/server-frontend
npm install
npm run build
sudo rm -rf /var/www/today-clothes/*
sudo cp -r dist/* /var/www/today-clothes/
sudo chown -R www-data:www-data /var/www/today-clothes
sudo systemctl reload nginx
```

브라우저에서 이전 화면이 보이면 강력 새로고침 또는 시크릿 창으로 확인합니다.

```txt
Ctrl + F5
```

## 7. Docker / Spring Boot 배포 준비

Docker가 설치되어 있지 않은 상태였습니다.

```txt
Command 'docker' not found
```

Docker 설치:

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

그 후 SSH를 종료하고 다시 접속해야 `docker` 그룹 권한이 적용됩니다.

```bash
exit
```

다시 접속 후 확인:

```bash
docker --version
docker ps
```

`docker compose`가 없으면 Compose 플러그인을 수동 설치합니다.

```bash
sudo apt install curl -y
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
docker compose version
```

## 8. 백엔드 환경변수

백엔드 환경변수 파일 위치:

```txt
server-backend/.env
```

필요한 값:

```env
SPRING_JWT_SECRET=...
TOSS_SECRET_KEY=...

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=today-clothes-images
AWS_S3_PUBLIC_BASE_URL=https://today-clothes-images.s3.ap-northeast-2.amazonaws.com

SERVICE_KEY=...
OPEN_AI_API_KEY=...
STABLE_DIFFUSION_API_KEY=...
```

`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`는 `docker-compose.yml`에 이미 정의되어 있으므로 별도로 넣지 않아도 됩니다.

주의:

```env
STABLE_DIFFUSION_API_KEY=키값 <- 이렇게 쓰면 안 됨
```

올바른 형태:

```env
STABLE_DIFFUSION_API_KEY=키값
```

## 9. 프론트 환경변수

Toss 클라이언트 키는 프론트 빌드용 환경변수입니다.

파일 위치:

```txt
server-frontend/.env.production
```

내용:

```env
VITE_TOSS_CLIENT_KEY=...
```

반영하려면 다시 빌드해야 합니다.

```bash
cd ~/today_clothes/server-frontend
npm run build
sudo rm -rf /var/www/today-clothes/*
sudo cp -r dist/* /var/www/today-clothes/
sudo systemctl reload nginx
```

정리:

```txt
VITE_TOSS_CLIENT_KEY -> server-frontend/.env.production
TOSS_SECRET_KEY      -> server-backend/.env
```

## 10. Spring / Docker Compose 실행

백엔드 디렉터리로 이동:

```bash
cd ~/today_clothes/server-backend
```

JAR 빌드:

```bash
chmod +x gradlew
./gradlew clean bootJar -x test
```

Docker Compose 실행:

```bash
docker compose up -d --build
```

컨테이너 확인:

```bash
docker ps
```

예상 컨테이너:

```txt
spring-server
fastapi-server
postgres-db
redis-cache
```

로그 확인:

```bash
docker logs spring-server
docker logs fastapi-server
```

실시간 로그:

```bash
docker logs -f spring-server
```

API 확인:

```bash
curl -I http://localhost:8080/boards/getBoard
curl -I https://devcourse-testing.shop/api/boards/getBoard
```

## 11. 배포 중 확인된 이슈

### 11.1 로그인 Invalid CORS request

원인:

백엔드 CORS 설정이 `http://localhost:3000`만 허용하고 있었습니다.

수정 대상:

```txt
server-backend/src/main/java/com/server/today_clothes/global/config/WebConfig.java
```

추가해야 하는 origin:

```txt
http://localhost:3000
http://devcourse-testing.shop
http://www.devcourse-testing.shop
https://devcourse-testing.shop
https://www.devcourse-testing.shop
```

WebSocket 설정도 배포 도메인을 허용해야 합니다.

수정 대상:

```txt
server-backend/src/main/java/com/server/today_clothes/global/notification/websocket/WebSocketConfig.java
```

### 11.2 S3 상품 이미지 업로드 CORS 에러

증상:

```txt
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

원인:

브라우저가 S3 Presigned URL로 직접 `PUT` 업로드하는데, S3 버킷 CORS에 배포 도메인이 없었습니다.

수정 대상:

```txt
S3 bucket: today-clothes-images
Permissions -> CORS
```

설정 예시:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://devcourse-testing.shop",
      "https://www.devcourse-testing.shop"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 11.3 게시글 삭제 후 홈 API 500

증상:

```txt
/api/boards/top?count=4&type=GENERAL 500
/api/boards/top?count=4&type=PRODUCT 500
```

원인 추정:

삭제된 게시글 ID가 Redis 좋아요 랭킹 `board:likes`에 남아 있고, 백엔드가 그 ID로 DB 조회 후 null을 처리하지 않아 500이 발생했습니다.

임시 해결:

```bash
docker exec -it redis-cache redis-cli
```

Redis 안에서:

```redis
ZRANGE board:likes 0 -1 WITHSCORES
ZREM board:likes 게시글ID
```

랭킹 전체 초기화:

```redis
DEL board:likes
```

근본 해결:

1. 게시글 삭제 시 Redis 랭킹에서도 제거
2. `/boards/top` 조회 시 DB에 없는 게시글은 skip
3. 다른 사람 글 삭제 방지를 위해 백엔드에서 작성자/관리자 권한 체크

## 12. 현재 진행 상태 요약

완료:

```txt
EC2 생성
도메인 Route 53 연결
Nginx HTTP 설정
React 프론트 배포
HTTPS 적용
프론트 최신 반영 방법 정리
```

남은 작업:

```txt
Docker 설치 최종 확인
server-backend/.env 구성
Spring/FastAPI/Postgres/Redis Docker Compose 실행
백엔드 CORS 수정 반영
WebSocket CORS 수정 반영
S3 CORS 설정 완료
Redis 좋아요 랭킹 삭제 이슈 수정
```

