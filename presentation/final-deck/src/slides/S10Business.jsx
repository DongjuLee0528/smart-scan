// Design Ref: §4.10 — S10 Business (paper theme, 3-col biz model + closing Q&A)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const colItem = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const HAAS_FEATURES = [
  '하드웨어 대여 포함',
  '서비스 이용료 포함',
  '장비 회수 · 리퍼비시',
  '가족 구성원 무제한',
]

const ROADMAP_ITEMS = [
  { icon: '🔒', label: 'Supabase RLS 보안 강화' },
  { icon: '📲', label: 'SMS · 푸시 알림 추가' },
  { icon: '🔄', label: 'OTA 업데이트 체계' },
  { icon: '🌍', label: '다중 가족 확장' },
  { icon: '📈', label: '망각 패턴 분석 AI' },
]

export default function S10Business({ slideNum, total }) {
  return (
    <SlideLayout theme="paper" slideNum={slideNum} total={total}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '7vh 0 3vh',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ padding: '0 5vw', marginBottom: '1.5vh' }}
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
            사업화 가능성
          </p>
          <h2
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: '4vw',
              fontWeight: 900,
              color: 'var(--ink-1)',
              lineHeight: 1,
            }}
          >
            비즈니스 모델
          </h2>
        </motion.div>

        {/* 3-column body */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            flex: 1,
            padding: '2vh 5vw',
            gap: 0,
            minHeight: 0,
          }}
        >
          {/* Column 1: HaaS Model */}
          <motion.div
            variants={colItem}
            style={{
              borderRight: '1px solid var(--line)',
              paddingRight: '3vw',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5vh',
            }}
          >
            <p
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '1.6vw',
                fontWeight: 700,
                color: 'var(--ink-1)',
              }}
            >
              HaaS 구독 모델
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4vw' }}>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '5vw',
                  color: 'var(--accent)',
                  lineHeight: 1,
                }}
              >
                ₩7,999
              </span>
              <span
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '1.5vw',
                  color: 'var(--ink-2)',
                  fontWeight: 500,
                }}
              >
                /월
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
              {HAAS_FEATURES.map((f) => (
                <div
                  key={f}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6vw',
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.15vw',
                    color: 'var(--ink-2)',
                  }}
                >
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1vw' }}>
                    ✓
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Cost Analysis */}
          <motion.div
            variants={colItem}
            style={{
              borderRight: '1px solid var(--line)',
              padding: '0 3vw',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5vh',
            }}
          >
            <p
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '1.6vw',
                fontWeight: 700,
                color: 'var(--ink-1)',
              }}
            >
              인프라 비용 분석
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
              {/* Before */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1vh 1.2vw',
                  background: 'rgba(229,57,53,0.06)',
                  borderRadius: '0.4vw',
                  border: '1px solid rgba(229,57,53,0.2)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.05vw',
                    color: 'var(--ink-3)',
                  }}
                >
                  기존 AWS
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw' }}>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '1.1vw',
                      color: 'var(--warn)',
                      fontWeight: 700,
                    }}
                  >
                    ~₩50,000/월
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.6vw',
                      color: 'var(--warn)',
                      border: '1px solid var(--warn)',
                      borderRadius: '0.2vw',
                      padding: '0.1vh 0.4vw',
                    }}
                  >
                    Before
                  </span>
                </div>
              </div>

              {/* After */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1vh 1.2vw',
                  background: 'rgba(0,168,107,0.06)',
                  borderRadius: '0.4vw',
                  border: '1px solid rgba(0,168,107,0.2)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.05vw',
                    color: 'var(--ink-3)',
                  }}
                >
                  현재
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw' }}>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '1.1vw',
                      color: 'var(--accent)',
                      fontWeight: 700,
                    }}
                  >
                    거의 ₩0/월
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.6vw',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      borderRadius: '0.2vw',
                      padding: '0.1vh 0.4vw',
                    }}
                  >
                    After
                  </span>
                </div>
              </div>

              {/* Saving */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '1vh 0',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2.8vw',
                    color: 'var(--hi)',
                    letterSpacing: '0.05vw',
                  }}
                >
                  ~97% 절감
                </span>
              </div>
            </div>

            <p
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '1vw',
                color: 'var(--ink-4)',
                lineHeight: 1.5,
              }}
            >
              Supabase 무료 티어 + Render 무료 티어 + Lambda 프리티어
            </p>
          </motion.div>

          {/* Column 3: Roadmap */}
          <motion.div
            variants={colItem}
            style={{
              paddingLeft: '3vw',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5vh',
            }}
          >
            <p
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '1.6vw',
                fontWeight: 700,
                color: 'var(--ink-1)',
              }}
            >
              향후 계획
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              {ROADMAP_ITEMS.map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8vw',
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '1.15vw',
                    color: 'var(--ink-2)',
                  }}
                >
                  <span style={{ fontSize: '1vw' }}>{r.icon}</span>
                  <span
                    style={{
                      color: 'var(--accent)',
                      fontWeight: 600,
                      fontSize: '1.05vw',
                    }}
                  >
                    →
                  </span>
                  {r.label}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Closing section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            borderTop: '1px solid var(--line)',
            padding: '2.5vh 5vw',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: '3vw',
              fontWeight: 900,
              color: 'var(--ink-1)',
            }}
          >
            감사합니다
          </span>
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '4vw',
              color: 'var(--accent)',
              letterSpacing: '0.2vw',
            }}
          >
            Q&A
          </span>
        </motion.div>
      </div>
    </SlideLayout>
  )
}
