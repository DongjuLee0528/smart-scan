// Design Ref: §4.9 — S09 Demo (black theme, live demo link + 'b' key backup mode)
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } },
}

const flowItem = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const FLOW_STEPS = [
  '로그인',
  '소지품 등록',
  '스캔 시연',
  '대시보드 확인',
  '이메일 알림 확인',
]

export default function S09Demo({ slideNum, total }) {
  const [backupMode, setBackupMode] = useState(false)

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'b') setBackupMode((m) => !m)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <SlideLayout theme="black" slideNum={slideNum} total={total}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '10vh 5vw',
          gap: '3vh',
        }}
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.85vw',
            color: 'var(--accent)',
            letterSpacing: '0.4vw',
            textTransform: 'uppercase',
          }}
        >
          시연
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '8vw',
            color: '#FFFFFF',
            letterSpacing: '0.3vw',
            lineHeight: 1,
            margin: 0,
          }}
        >
          Live Demo
        </motion.h1>

        {/* Main demo card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '1vw',
            padding: '3vh 3vw',
            maxWidth: '60vw',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: '2.5vw',
              fontWeight: 700,
              color: 'var(--accent)',
              marginBottom: '1vh',
            }}
          >
            🔗 smartscan-hub.com
          </p>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.75vw',
              color: 'var(--ink-4)',
              letterSpacing: '0.05vw',
            }}
          >
            ↑ 브라우저에서 직접 접속 가능
          </p>
        </motion.div>

        {/* Demo flow */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8vw',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {FLOW_STEPS.map((step, idx) => (
            <div
              key={step}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}
            >
              <motion.div
                variants={flowItem}
                style={{
                  background: 'rgba(0,168,107,0.15)',
                  border: '1px solid rgba(0,168,107,0.3)',
                  padding: '1vh 1.5vw',
                  borderRadius: '0.3vw',
                  fontSize: '0.85vw',
                  color: '#FFFFFF',
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {step}
              </motion.div>
              {idx < FLOW_STEPS.length - 1 && (
                <motion.span
                  variants={flowItem}
                  style={{
                    color: 'var(--accent)',
                    fontSize: '1vw',
                    fontWeight: 700,
                  }}
                >
                  →
                </motion.span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Backup hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65vw',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.05vw',
          }}
        >
          [ b ] 백업 모드 토글
        </motion.p>
      </div>

      {/* Backup mode overlay */}
      <AnimatePresence>
        {backupMode && (
          <motion.div
            key="backup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.88)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2vh',
              zIndex: 50,
            }}
          >
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '4vw',
                color: 'var(--hi)',
                letterSpacing: '0.2vw',
              }}
            >
              📸 백업 모드
            </p>
            <p
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '1.2vw',
                color: 'var(--hi)',
                fontWeight: 500,
              }}
            >
              인터넷 연결 없이 스크린샷으로 시연
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.75vw',
                color: 'rgba(255,215,0,0.5)',
                marginTop: '1vh',
              }}
            >
              [ b ] 키로 해제
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </SlideLayout>
  )
}
