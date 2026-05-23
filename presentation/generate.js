const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "SmartScan Hub — 1차 발표";

// ── 색상 테마 ──
const BG       = "0D1117";
const BG2      = "161B22";
const ACCENT   = "00C896";
const ORANGE   = "F5A623";
const BLUE     = "1E88E5";
const PURPLE   = "AB47BC";
const RED      = "EF5350";
const TEXT     = "FFFFFF";
const MUTED    = "8B949E";
const BORDER   = "30363D";

const makeShadow = () => ({ type:"outer", blur:8, offset:3, color:"000000", opacity:0.3, angle:135 });

// ── 슬라이드 헤더 공통 ──
function addHeader(slide, title, sub="") {
  slide.addShape(pres.shapes.RECTANGLE, { x:0.35, y:0.22, w:0.06, h:0.55, fill:{color:ACCENT}, line:{color:ACCENT} });
  slide.addText(title, { x:0.5, y:0.18, w:8.8, h:0.62, fontSize:26, bold:true, color:TEXT, fontFace:"Arial", margin:0 });
  if (sub) slide.addText(sub, { x:0.5, y:0.78, w:8.8, h:0.28, fontSize:10, color:MUTED, fontFace:"Arial", margin:0 });
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:1.0, w:10, h:0.015, fill:{color:BORDER}, line:{color:BORDER} });
}

// ════════════════════════════════════════
// SLIDE 1 — 표지
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:"070D14" };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0,    w:10, h:2.4,  fill:{color:"0A1020"}, line:{color:"0A1020"} });
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:3.55, w:10, h:2.08, fill:{color:"0A1020"}, line:{color:"0A1020"} });
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:2.38, w:10, h:0.04, fill:{color:ACCENT},   line:{color:ACCENT} });
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:3.53, w:10, h:0.04, fill:{color:ACCENT},   line:{color:ACCENT} });

  s.addText("두고간 물건을 알려주는", { x:0.5, y:0.42, w:9, h:0.55, fontSize:19, color:MUTED, align:"center", fontFace:"Arial" });
  s.addText("Smart-Scan Hub", { x:0.5, y:0.95, w:9, h:1.25, fontSize:56, bold:true, color:ACCENT, align:"center", fontFace:"Arial Black" });
  s.addText("UHF RFID 기반 노터치 소지품 자동 체크 시스템", { x:0.5, y:2.48, w:9, h:0.48, fontSize:14, color:TEXT, align:"center", fontFace:"Arial" });

  s.addText([
    { text:"5조  |  ", options:{ color:MUTED } },
    { text:"김준표  박준영  이동주  임재영  황찬영", options:{ color:TEXT, bold:true } }
  ], { x:0.5, y:3.65, w:9, h:0.42, fontSize:14, align:"center", fontFace:"Arial" });
  s.addText("2026년  |  IoT 융합 프로젝트  1차 발표", { x:0.5, y:4.2, w:9, h:0.3, fontSize:11, color:MUTED, align:"center", fontFace:"Arial" });
}

// ════════════════════════════════════════
// SLIDE 2 — 목차
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "목차", "INDEX");

  const items = [
    ["01","팀원 역할 분담"],
    ["02","기술 스택"],
    ["03","프로젝트 개요"],
    ["04","스케줄 & 마일스톤"],
    ["05","시스템 아키텍처 / 네트워크 구성"],
    ["06","CI/CD 파이프라인"],
    ["07","DB 스키마"],
    ["08","프론트엔드 구성 / UI"],
    ["09","백엔드 구성 / 챗봇 구현"],
    ["10","기대 결과물"],
  ];

  items.forEach(([num, text], i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const x = col === 0 ? 0.5 : 5.35;
    const y = 1.12 + row * 0.84;
    const active = num === "04";

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w:0.48, h:0.48,
      fill:{ color: active ? ACCENT : BG2 },
      line:{ color: active ? ACCENT : BORDER }
    });
    s.addText(num, { x, y, w:0.48, h:0.48, fontSize:10, bold:true, align:"center", valign:"middle", color: active ? "000000" : ACCENT, margin:0 });
    s.addText(text, { x:x+0.56, y:y+0.06, w:4.3, h:0.36, fontSize:13, color:TEXT, fontFace:"Arial", margin:0 });
  });
}

// ════════════════════════════════════════
// SLIDE 3 — 팀원 역할 분담
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "팀원 역할 분담", "Roles & Responsibilities");

  const roles = [
    ["황찬영", "클라우드 + Lambda + 인프라",
     "Supabase 설정 / DB 스키마\nLambda 4개 / Terraform\nCI/CD / Raspberry Pi RFID", ACCENT],
    ["이동주", "백엔드",
     "FastAPI (Render)\n비즈니스 로직 (CRUD)\n가족관리 / 대시보드", BLUE],
    ["임재영 / 김준표", "프론트엔드",
     "웹사이트 (HTML/CSS/JS)\nsupabase-js 연동\nS3 + CloudFront 배포", ORANGE],
    ["박준영", "카카오 챗봇",
     "카카오 오픈빌더\n챗봇 시나리오 설계\nLambda chatbot 연동", PURPLE],
  ];

  roles.forEach(([name, role, desc, color], i) => {
    const x = i < 2 ? 0.4 : 5.25;
    const y = i % 2 === 0 ? 1.1 : 3.0;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:4.5, h:1.8, fill:{color:BG2}, line:{color:color, width:1.5}, shadow:makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:4.5, h:0.07, fill:{color:color}, line:{color:color} });
    s.addText(name,  { x:x+0.14, y:y+0.12, w:4.2, h:0.36, fontSize:15, bold:true, color:TEXT, fontFace:"Arial", margin:0 });
    s.addText(role,  { x:x+0.14, y:y+0.48, w:4.2, h:0.26, fontSize:10, color:color, fontFace:"Arial", margin:0 });
    s.addText(desc,  { x:x+0.14, y:y+0.74, w:4.2, h:0.95, fontSize:10, color:MUTED, fontFace:"Arial", wrap:true, margin:0 });
  });

  // 협업 인터페이스 한 줄
  s.addShape(pres.shapes.RECTANGLE, { x:0.4, y:4.87, w:9.2, h:0.42, fill:{color:"0A1628"}, line:{color:BLUE} });
  s.addText("협업 방식: 주 2회 온라인 Discord 미팅  +  GitHub PR 코드 리뷰  +  Notion 문서 공유", { x:0.55, y:4.9, w:9, h:0.35, fontSize:10, color:BLUE, fontFace:"Arial", margin:0 });
}

// ════════════════════════════════════════
// SLIDE 4 — 스케줄 & 마일스톤
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "프로젝트 스케줄 & 마일스톤", "총 15주차  |  2026.03.02 ~ 2026.06.14  |  1차 발표: 7주차  |  최종 발표: 15주차");

  const milestones = [
    ["M1", "기획 & 설계",         "1~3주 / 3/2~3/22",   "팀 구성, 아키텍처 설계, DB 스키마, 역할 분담",              "✅ 완료",   ACCENT],
    ["M2", "인프라 & 백엔드",     "4~5주 / 3/23~4/5",   "Supabase, Lambda 4개, FastAPI 9개 API, CI/CD, 챗봇",         "✅ 완료",   ACCENT],
    ["M3", "프론트엔드 착수",     "6주 / 4/6~4/12",      "웹 UI 구현 시작, S3+CloudFront 배포 구성",                   "🔄 진행중", ORANGE],
    ["🎯", "1차 발표",            "7주 / 4/13~4/19",     "프로젝트 기획 & 설계 발표",                                  "⏳ 예정",   RED],
    ["⏸", "중간고사",            "8주 / 4/20~4/26",     "중간고사 기간",                                               "—",         MUTED],
    ["M4", "프론트 완성 + HW 연결","9~10주 / 4/27~5/10", "웹 UI 완성, 장비 도착 후 Pi + RFID 리더기 물리 연결",        "⏳ 예정",   BLUE],
    ["M5", "RFID 실제 동작 테스트","11~12주 / 5/11~5/24","RFID 실제 통신 테스트, 스캔→Lambda→이메일 전체 흐름 검증",   "⏳ 예정",   BLUE],
    ["M6", "최종 점검 & 데모 준비","13~14주 / 5/25~6/7", "전체 통합 테스트, 버그 수정, 발표자료 제작",                 "⏳ 예정",   BLUE],
    ["🏁", "최종 발표 (2차)",      "15주 / 6/8~6/14",    "최종 발표 및 실제 RFID 시연",                                "⏳ 예정",   RED],
  ];

  // Header row
  const hY = 1.1;
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:hY, w:9.3, h:0.32, fill:{color:"1C2333"}, line:{color:BORDER} });
  [["단계",0.35,0.5],["마일스톤",0.88,1.15],["주차/기간",2.06,1.3],["주요 작업",3.39,3.95],["상태",7.37,1.28]]
    .forEach(([t,x,w]) => s.addText(t, { x, y:hY, w, h:0.32, fontSize:9, bold:true, color:MUTED, valign:"middle", align:"center", margin:0 }));

  milestones.forEach(([step, name, period, desc, status, color], i) => {
    const ry = hY + 0.32 + i * 0.434;
    const isSpecial = ["🎯","🏁"].includes(step);
    const isDim = step === "⏸";
    const bg = isSpecial ? "130808" : i%2===0 ? BG : "0D1117";

    s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:ry, w:9.3, h:0.433, fill:{color:bg}, line:{color:"21262D"} });
    s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:ry, w:0.04, h:0.433, fill:{color:isDim?BORDER:color}, line:{color:isDim?BORDER:color} });

    const tc = isDim ? MUTED : color;
    s.addText(step,   { x:0.4,  y:ry, w:0.46, h:0.433, fontSize:9,  bold:true, color:tc, align:"center", valign:"middle", margin:0 });
    s.addText(name,   { x:0.89, y:ry, w:1.14, h:0.433, fontSize:9,  bold:isSpecial, color:isDim?MUTED:TEXT, valign:"middle", margin:0, wrap:true });
    s.addText(period, { x:2.05, y:ry, w:1.31, h:0.433, fontSize:8,  color:MUTED, align:"center", valign:"middle", margin:0, wrap:true });
    s.addText(desc,   { x:3.38, y:ry, w:3.97, h:0.433, fontSize:8.5, color:isDim?MUTED:TEXT, valign:"middle", margin:0, wrap:true });
    const sc = status.includes("완료") ? ACCENT : status.includes("진행") ? ORANGE : MUTED;
    s.addText(status, { x:7.36, y:ry, w:1.29, h:0.433, fontSize:9, color:sc, align:"center", valign:"middle", margin:0 });
  });
}

// ════════════════════════════════════════
// SLIDE 5 — 아키텍처 / 네트워크 구성  [이미지 삽입 필요]
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "시스템 아키텍처 / 네트워크 구성", "SmartScan Hub — 3-Zone Network Architecture");

  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:1.08, w:9.3, h:4.28, fill:{color:BG2}, line:{color:BORDER, dashType:"dash", width:1.5} });
  s.addText("[ 이미지 삽입 ]", { x:0.35, y:2.5, w:9.3, h:0.6, fontSize:20, color:BORDER, align:"center", valign:"middle", margin:0 });
  s.addText("카카오톡으로 전송한  SmartScan Hub — 네트워크 구성도  이미지를 여기에 삽입하세요", { x:0.35, y:3.15, w:9.3, h:0.45, fontSize:11, color:MUTED, align:"center", margin:0 });
}

// ════════════════════════════════════════
// SLIDE 6 — CI/CD  [이미지 삽입 필요]
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "CI/CD — 깃허브 액션 파이프라인", "main 브랜치 push 시 3개 대상 자동 배포");

  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:1.08, w:9.3, h:4.28, fill:{color:BG2}, line:{color:BORDER, dashType:"dash", width:1.5} });
  s.addText("[ 이미지 삽입 ]", { x:0.35, y:2.5, w:9.3, h:0.6, fontSize:20, color:BORDER, align:"center", valign:"middle", margin:0 });
  s.addText("카카오톡으로 전송한  CI/CD 파이프라인 다이어그램  이미지를 여기에 삽입하세요", { x:0.35, y:3.15, w:9.3, h:0.45, fontSize:11, color:MUTED, align:"center", margin:0 });
}

// ════════════════════════════════════════
// SLIDE 7 — DB 스키마
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "DB 스키마 (Supabase PostgreSQL)", "9개 테이블  |  RLS 적용  |  복합 인덱스 4개  |  View + RPC 함수 포함");

  const tables = [
    ["profiles",       "id(UUID,PK), name, email, phone, age, role",               "사용자 프로필 (Supabase Auth 연동)", ACCENT],
    ["families",       "id, owner_id(FK→profiles), name",                           "가족 그룹",                         BLUE],
    ["family_members", "id, family_id, profile_id, name, phone, email, role",       "가족 구성원 (Owner 관리)",           BLUE],
    ["devices",        "id, serial_number, family_id, name, is_active",             "RFID 리더기 기기",                   ORANGE],
    ["items",          "id, member_id(FK→family_members), name, is_required",       "소지품 (구성원별 개인 소유)",         ORANGE],
    ["tags",           "id, tag_uid, item_id, device_id, label",                    "RFID 태그 (소지품에 부착)",           PURPLE],
    ["scan_logs",      "id, device_id, tag_uid, rssi, scanned_at",                  "RFID 스캔 이력",                     PURPLE],
    ["notifications",  "id, member_id, type, title, message, is_read, sent_via",   "알림 기록 (누락/원격/시스템)",        RED],
    ["kakao_links",    "kakao_user_id(PK), member_id(FK), device_id(FK)",           "카카오 챗봇 연동 (ID ↔ 구성원)",     RED],
  ];

  tables.forEach(([name, cols, desc, color], i) => {
    const col = i < 5 ? 0 : 1;
    const row = i < 5 ? i : i - 5;
    const x = col === 0 ? 0.35 : 5.25;
    const y = 1.12 + row * 0.89;

    s.addShape(pres.shapes.RECTANGLE, { x, y, w:4.6, h:0.84, fill:{color:BG2}, line:{color:"21262D"} });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.04, h:0.84, fill:{color:color}, line:{color:color} });
    s.addText("`" + name + "`", { x:x+0.1, y:y+0.04, w:4.0, h:0.3, fontSize:11, bold:true, color:color, fontFace:"Consolas", margin:0 });
    s.addText(cols,  { x:x+0.1, y:y+0.32, w:4.42, h:0.26, fontSize:7.8, color:MUTED, fontFace:"Consolas", margin:0, wrap:true });
    s.addText(desc,  { x:x+0.1, y:y+0.58, w:4.42, h:0.22, fontSize:9, color:TEXT, fontFace:"Arial", margin:0 });
  });
}

// ════════════════════════════════════════
// SLIDE 8 — 프론트엔드
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "프론트엔드 구성 / 로직", "HTML / CSS / JavaScript  +  supabase-js  |  S3 + CloudFront 정적 호스팅");

  // 왼쪽: 구현 페이지 목록
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:1.1, w:4.2, h:4.26, fill:{color:BG2}, line:{color:BORDER} });
  s.addText("구현 페이지", { x:0.5, y:1.18, w:3.9, h:0.32, fontSize:13, bold:true, color:ACCENT, margin:0 });

  const pages = [
    ["회원가입 / 로그인",   "Supabase Auth 이메일 인증"],
    ["가족 구성원 관리",    "Owner/Member 역할 기반"],
    ["소지품 + 태그 관리",  "구성원별 개인 소지품"],
    ["기기 등록",           "시리얼 넘버 입력"],
    ["가족 대시보드",       "Supabase Realtime WebSocket"],
    ["원격 알림 발송",      "부모 → 자녀 직접 알림"],
  ];
  pages.forEach(([title, sub], i) => {
    const py = 1.56 + i * 0.59;
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:py, w:3.9, h:0.52, fill:{color:"0D1117"}, line:{color:BORDER} });
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:py, w:0.04, h:0.52, fill:{color:ORANGE}, line:{color:ORANGE} });
    s.addText(title, { x:0.62, y:py+0.02, w:3.6, h:0.26, fontSize:10, bold:true, color:TEXT, fontFace:"Arial", margin:0 });
    s.addText(sub,   { x:0.62, y:py+0.27, w:3.6, h:0.22, fontSize:9,  color:MUTED, fontFace:"Arial", margin:0 });
  });

  // 오른쪽: UI 스크린샷 placeholder
  s.addShape(pres.shapes.RECTANGLE, { x:4.75, y:1.1, w:4.9, h:4.26, fill:{color:BG2}, line:{color:BORDER, dashType:"dash"} });
  s.addText("[ UI 스크린샷 삽입 ]", { x:4.75, y:2.8, w:4.9, h:0.6, fontSize:15, color:BORDER, align:"center", margin:0 });
}

// ════════════════════════════════════════
// SLIDE 9 — 백엔드 / 챗봇
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "백엔드 구성 / 챗봇 구현", "FastAPI (Render)  +  AWS Lambda 4개  +  카카오 오픈빌더");

  // Lambda 4개 카드
  const lambdas = [
    ["inbound",  "스캔 수신",  "scan_logs INSERT\n→ RPC 누락 체크\n→ outbound 호출", ACCENT],
    ["outbound", "누락 알림",  "notifications INSERT\n→ Resend 이메일 발송",          ORANGE],
    ["remote",   "원격 알림",  "가족 구성원에게\n직접 알림 발송",                      BLUE],
    ["chatbot",  "챗봇 응답",  "카카오 Webhook\n→ DB 조회/등록",                       PURPLE],
  ];
  lambdas.forEach(([name, role, desc, color], i) => {
    const x = 0.35 + i * 2.3;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.1, w:2.18, h:1.62, fill:{color:BG2}, line:{color:color, width:1.5}, shadow:makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.1, w:2.18, h:0.06, fill:{color:color}, line:{color:color} });
    s.addText("λ  " + name, { x:x+0.1, y:1.15, w:1.95, h:0.3,  fontSize:11, bold:true, color:color, fontFace:"Consolas", margin:0 });
    s.addText(role,         { x:x+0.1, y:1.45, w:1.95, h:0.25, fontSize:10, color:TEXT,  fontFace:"Arial", margin:0 });
    s.addText(desc,         { x:x+0.1, y:1.72, w:1.95, h:0.88, fontSize:9,  color:MUTED, fontFace:"Arial", wrap:true, margin:0 });
  });

  // 챗봇 구현 상세
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:2.82, w:4.55, h:2.54, fill:{color:BG2}, line:{color:PURPLE, width:1.2} });
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:2.82, w:4.55, h:0.06, fill:{color:PURPLE}, line:{color:PURPLE} });
  s.addText("카카오 챗봇 구현", { x:0.48, y:2.9, w:4.3, h:0.3, fontSize:12, bold:true, color:PURPLE, margin:0 });
  const chatItems = [
    "카카오 오픈빌더 Webhook 방식 연동",
    "버튼형 UI (기기 등록 / 목록 확인 / 물품 추가·삭제 / 기기 해제)",
    "카카오 ID → kakao_links 테이블로 사용자 매핑",
    "미연동 사용자 → smartscan-hub.com 안내 메시지 발송",
  ];
  s.addText(chatItems.map(t=>"•  "+t).join("\n"), { x:0.48, y:3.25, w:4.3, h:2.0, fontSize:10, color:TEXT, lineSpacingMultiple:1.5, margin:0 });

  // 챗봇 스크린샷 placeholder
  s.addShape(pres.shapes.RECTANGLE, { x:5.1, y:2.82, w:4.55, h:2.54, fill:{color:BG2}, line:{color:BORDER, dashType:"dash"} });
  s.addText("[ 챗봇 구현 스크린샷 삽입 ]", { x:5.1, y:3.9, w:4.55, h:0.5, fontSize:13, color:BORDER, align:"center", margin:0 });
}

// ════════════════════════════════════════
// SLIDE 10 — 기대 결과물
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:BG };
  addHeader(s, "기대 결과물", "제품 진화 & 사업화 전망");

  // ── 3단계 진화 ──
  const stages = [
    ["기존 제품들\n(AirTag / SmartTag)", "분실 후 사후 추적 방식\n개당 3~4만원, OS 종속\n자동 다중 스캔 불가",          "1A1A1A", MUTED, MUTED],
    ["프로토타입\n(SmartScan Hub)",       "UHF RFID 자동 다중 스캔\n웹 + 챗봇 + 이메일 알림\n가족 단위 소지품 관리",     BG2, BLUE, TEXT],
    ["상용화 최종 제품",                  "Orange Pi → 원가 50% 절감\n월 9,900원 HaaS 구독 모델\n캡티브 포털 자동 WiFi", ACCENT, "000000","000000"],
  ];
  stages.forEach(([title, desc, fill, titleC, textC], i) => {
    const x = 0.35 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.1, w:2.95, h:1.96, fill:{color:fill}, line:{color: i===2?ACCENT:BORDER, width:i===2?2:1} });
    s.addText(title, { x:x+0.1, y:1.16, w:2.75, h:0.54, fontSize:11, bold:true, color:titleC, align:"center", wrap:true, margin:0 });
    s.addText(desc,  { x:x+0.1, y:1.72, w:2.75, h:1.2,  fontSize:10, color:textC, align:"center", lineSpacingMultiple:1.4, wrap:true, margin:0 });
    if (i < 2) s.addText("→", { x:x+2.82, y:1.85, w:0.38, h:0.45, fontSize:20, color:MUTED, align:"center", valign:"middle", margin:0 });
  });

  // ── OS / 환경 비교표 ──
  s.addText("작동 OS / 환경 비교", { x:0.35, y:3.13, w:4.5, h:0.28, fontSize:11, bold:true, color:TEXT, margin:0 });
  s.addText("태그 3개 기준  소지품 4개째부터 SmartScan Hub가 저렴", { x:5.0, y:3.13, w:4.65, h:0.28, fontSize:10, color:MUTED, align:"right", margin:0 });

  const compRows = [
    [{ text:"항목",          options:{bold:true,color:TEXT,   fill:{color:"1C2333"}} },
     { text:"SmartScan Hub", options:{bold:true,color:ACCENT, fill:{color:"1C2333"}} },
     { text:"Apple AirTag",  options:{bold:true,color:MUTED,  fill:{color:"1C2333"}} },
     { text:"Samsung SmartTag2", options:{bold:true,color:MUTED,fill:{color:"1C2333"}} }],
    ["기기 구동 OS",      "Armbian Linux (Orange Pi)",         "전용 U1칩 (OS 없음)",   "전용 BLE칩 (OS 없음)"],
    ["사용자 앱",         "웹 브라우저 + 카카오톡",            "iOS/iPadOS 전용",       "Android 전용 (SmartThings)"],
    ["스마트폰 제한",     "없음 (모든 기기 접속)",             "iPhone 필수 (iOS 14.5+)","Samsung Galaxy 권장"],
    ["스마트폰 없이 작동","✅  독립 작동",                     "❌",                    "❌"],
    ["태그 추가 단가",    "~1,000원 / 개",                     "39,000원 / 개",         "39,000~45,000원 / 개"],
  ];
  s.addTable(compRows, {
    x:0.35, y:3.44, w:9.3, h:2.2,
    color:TEXT, fontSize:9, fontFace:"Arial",
    border:{ pt:0.5, color:BORDER },
    fill:{ color:BG2 },
    colW:[1.9, 2.7, 2.35, 2.35],
    rowH:0.36,
  });
}

// ════════════════════════════════════════
// SLIDE 11 — Q&A
// ════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color:"070D14" };
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:2.45, w:10, h:0.05, fill:{color:ACCENT}, line:{color:ACCENT} });
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:3.5,  w:10, h:0.05, fill:{color:ACCENT}, line:{color:ACCENT} });
  s.addText("Thank You",        { x:0.5, y:0.7,  w:9, h:0.6,  fontSize:20, color:MUTED,  align:"center", fontFace:"Arial" });
  s.addText("Q & A",            { x:0.5, y:1.2,  w:9, h:1.15, fontSize:66, bold:true, color:TEXT, align:"center", fontFace:"Arial Black" });
  s.addText("감사합니다",        { x:0.5, y:2.55, w:9, h:0.8,  fontSize:30, bold:true, color:TEXT, align:"center", fontFace:"Arial" });
  s.addText("들어주셔서 감사합니다.", { x:0.5, y:3.6, w:9, h:0.4, fontSize:14, color:MUTED, align:"center", fontFace:"Arial" });
  s.addText("SmartScan Hub  —  5조  |  IoT 융합 프로젝트", { x:0.5, y:5.0, w:9, h:0.3, fontSize:11, color:MUTED, align:"center", fontFace:"Arial" });
}

pres.writeFile({ fileName: "SmartScanHub_발표자료.pptx" })
  .then(() => console.log("✅ PPTX 생성 완료: SmartScanHub_발표자료.pptx"))
  .catch(e => { console.error("❌ 오류:", e); process.exit(1); });
