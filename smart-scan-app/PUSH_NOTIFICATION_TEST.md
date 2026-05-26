# Expo Push Notification 테스트 가이드

## 개요
이 문서는 smart-scan-app의 Android Expo Push Notification 기능을 테스트하는 방법을 설명합니다.

## 사전 요구사항
- Android 실제 기기 (에뮬레이터/시뮬레이터에서는 푸시 토큰 발급이 안됩니다)
- EAS CLI 설치
- Expo 계정

## 빌드 및 테스트 절차

### 1. 패키지 확인
필요한 패키지들이 이미 설치되어 있는지 확인:
```bash
# 만약 패키지가 누락되었다면 실행:
npx expo install expo-notifications expo-device expo-constants
```

### 2. EAS Preview APK 빌드
```bash
# Android APK 빌드 (preview 프로필 사용)
eas build --platform android --profile preview
```

### 3. 앱 설치 및 실행
1. 빌드가 완료되면 QR 코드 또는 다운로드 링크를 통해 APK를 Android 기기에 설치
2. 앱을 실행하면 자동으로 푸시 알림 권한 요청
3. 권한을 허용하면 콘솔에 Expo Push Token이 출력됨

### 4. 토큰 확인
앱 실행 후 개발자 도구 콘솔에서 다음과 같은 로그 확인:
```
📱 Expo Push Token: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
서버로 토큰 저장 예정: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

### 5. 푸시 알림 테스트
[Expo Push Notification Tool](https://expo.dev/notifications)을 사용하여 테스트:
1. 발급받은 토큰을 입력
2. 메시지 작성 후 전송
3. 앱에서 알림 수신 확인

## 주요 설정 파일

### eas.json
- preview 프로필에 `android.buildType: "apk"` 설정으로 APK 생성

### app.json
- `expo-notifications` 플러그인 추가
- Android 알림 권한 (`RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK`) 설정
- `useNextNotificationsApi: true` 설정

### src/utils/pushNotifications.js
- 알림 채널 설정 (Android 8+ 필수)
- 권한 요청 및 토큰 발급
- 에러 핸들링

## 트러블슈팅

### 토큰 발급 실패
- 실제 기기에서 테스트하고 있는지 확인
- 앱 권한 설정에서 알림 허용했는지 확인
- EAS Project ID가 올바르게 설정되었는지 확인

### 알림 수신 안됨
- 기기 알림 설정 확인
- 앱이 백그라운드/포그라운드 상태에서 모두 테스트
- Expo Push Notification Tool의 응답 메시지 확인

## 개발 참고사항
- 현재 서버 연동은 TODO 상태로 구현되어 있음
- 실제 백엔드 API 완성 후 `savePushTokenToServer` 함수에서 서버로 토큰 전송 구현 필요
- 알림 수신/클릭 이벤트는 현재 콘솔 로그로만 처리됨