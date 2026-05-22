// Design Ref: §4.3 — S03 Solution (paper theme, header + 2-col feature list + diff table)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const leftContainer = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.25 },
  },
}

const featureItem = {
  hidden:  { x: -20, opacity: 0 },
  visible: {
    x: 0, opacity: 1,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const FEATURES = [
  {
    icon: '🔒',
    title: '현관 통과 시 자동 다중 스캔',
    sub: 'UHF RFID 상시 스캔 → 0.1초 내 다중 인식',
  },
  {
    icon: '📱',
    title: '누락 즉시 이메일 알림',
    sub: 'Lambda → Resend API → 3초 이내',
  },
  {
    icon: '📊',
    title: '실시간 대시보드',
    sub: 'Supabase Realtime WebSocket',
  },
  {
    icon: '🏠',
    title: 'HaaS 구독형 서비스',
    sub: '월 7,999원 · 가족 단위 관리',
  },
]

const DIFF_ROWS = [
  { aspect: '감지 방식',  smart: 'UHF RFID 자동',   air: '✗ 수동',      phone: '△ 앱 수동' },
  { aspect: '알림 시점',  smart: '출발 전 현관',     air: '✗ 분실 후',   phone: '△ 직접 설정' },
  { aspect: '설치 방법',  smart: 'HaaS 기기 구독',  air: '✗ 태그 구매', phone: '✗ 앱 설정' },
  { aspect: '가족 관리',  smart: '다계정 지원',      air: '✗ 단일 기기', phone: '△ 제한적' },
]

export default function S03Solution({ slideNum, total }) {
  return (
    <SlideLayout theme="paper" slideNum={slideNum} total={total}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '8vh 5vw 5vh',
          gap: '2vh',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '1vw',
              color: 'var(--accent)',
              letterSpacing: '0.3vw',
              textTransform: 'uppercase',
              marginBottom: '0.8vh',
            }}
          >
            솔루션 소개
          </p>
          <h2
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: '5vw',
              fontWeight: 900,
              color: 'var(--ink-1)',
              lineHeight: 1,
            }}
          >
            SmartScan Hub
          </h2>
        </motion.div>

        {/* 2-column body */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '60% 40%',
            gap: '3vw',
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Left: feature list */}
          <motion.div
            variants={leftContainer}
            initial="hidden"
            animate="visible"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0.4vh',
            }}
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={featureItem}
                style={{
                  borderLeft: '3px solid var(--accent)',
                  paddingLeft: '1vw',
                  paddingTop: '1.2vh',
                  paddingBottom: '1.2vh',
                  marginBottom: '1vh',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.45vw',
                    fontWeight: 700,
                    color: 'var(--ink-1)',
                    marginBottom: '0.3vh',
                  }}
                >
                  {f.icon} {f.title}
                </p>
                <p
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.05vw',
                    color: 'var(--ink-3)',
                    fontWeight: 400,
                  }}
                >
                  {f.sub}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: differentiation table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '1.45vw',
                fontWeight: 700,
                color: 'var(--ink-1)',
                marginBottom: '1.5vh',
              }}
            >
              차별화 포인트
            </p>

            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1.2fr 0.9fr 1fr',
                gap: '0',
                background: 'var(--ink-1)',
                borderRadius: '0.4vw 0.4vw 0 0',
                padding: '0.8vh 0.8vw',
              }}
            >
              {['구분', 'SmartScan', 'AirTag', '스마트폰'].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.85vw',
                    color: h === 'SmartScan' ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                    letterSpacing: '0.06vw',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Table rows */}
            {DIFF_ROWS.map((row, i) => (
              <div
                key={row.aspect}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.2fr 0.9fr 1fr',
                  gap: '0',
                  padding: '0.9vh 0.8vw',
                  borderBottom: '1px solid var(--line)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.025)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.05vw',
                    color: 'var(--ink-3)',
                    fontWeight: 500,
                  }}
                >
                  {row.aspect}
                </span>
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.05vw',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  }}
                >
                  ✓ {row.smart}
                </span>
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.05vw',
                    color: 'var(--ink-4)',
                  }}
                >
                  {row.air}
                </span>
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.05vw',
                    color: 'var(--ink-4)',
                  }}
                >
                  {row.phone}
                </span>
              </div>
            ))}

            {/* HaaS badge */}
            <div
              style={{
                marginTop: '2vh',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8vw',
                background: 'rgba(0,168,107,0.1)',
                border: '1.5px solid var(--accent)',
                borderRadius: '0.5vw',
                padding: '1.2vh 1.4vw',
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '2.2vw',
                  color: 'var(--accent)',
                  lineHeight: 1,
                }}
              >
                월 7,999원
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.95vw',
                  color: 'var(--accent)',
                  letterSpacing: '0.08vw',
                  textTransform: 'uppercase',
                }}
              >
                HaaS 구독
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </SlideLayout>
  )
}
