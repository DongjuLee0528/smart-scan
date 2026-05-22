// Design Ref: §4.2 — S02 Problem (white theme, question + cards + comparison)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const container = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.4 },
  },
}

const cardItem = {
  hidden:  { y: 30, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const CARDS = [
  { emoji: '👛', stat: '7분+',    label: '지체 발생',    name: '지갑' },
  { emoji: '🪪', stat: '버스 놓침', label: '연쇄 지각',  name: '사원증' },
  { emoji: '🔑', stat: '지각 위험', label: '대리 출근 불가', name: '차키' },
]

export default function S02Problem({ slideNum, total }) {
  return (
    <SlideLayout theme="white" slideNum={slideNum} total={total}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '8vh 5vw 5vh',
          gap: '3vh',
        }}
      >
        {/* Big question */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontSize: '5.5vw',
            fontWeight: 900,
            color: 'var(--ink-1)',
            lineHeight: 1.15,
          }}
        >
          출근길,{' '}
          <span
            style={{
              background: 'linear-gradient(180deg, transparent 60%, var(--hi) 60%)',
              paddingBottom: '0.1em',
            }}
          >
            소지품을
          </span>{' '}
          항상 챙기고 있나요?
        </motion.h1>

        {/* 3 cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '2.5vw',
          }}
        >
          {CARDS.map((c) => (
            <motion.div
              key={c.name}
              variants={cardItem}
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                borderRadius: '0.8vw',
                padding: '3vh 2vw',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8vh',
              }}
            >
              <span style={{ fontSize: '2.8vw' }}>{c.emoji}</span>
              <span
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '3.5vw',
                  fontWeight: 800,
                  color: 'var(--ink-1)',
                  lineHeight: 1,
                }}
              >
                {c.stat}
              </span>
              <span
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '1.3vw',
                  color: 'var(--ink-3)',
                  fontWeight: 500,
                }}
              >
                {c.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.9 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2vw',
          }}
        >
          {/* Left: existing solution */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2vw',
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: '0.6vw',
              padding: '1.8vh 1.8vw',
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '1.15vw',
                  color: 'var(--ink-2)',
                  fontWeight: 500,
                }}
              >
                기존 솔루션: 에어태그 = 분실 후 찾기
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.95vw',
                color: 'var(--warn)',
                border: '1px solid var(--warn)',
                borderRadius: '0.3vw',
                padding: '0.3vh 0.7vw',
                whiteSpace: 'nowrap',
                letterSpacing: '0.05vw',
              }}
            >
              사후 대응
            </span>
          </div>

          {/* Right: SmartScan Hub */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2vw',
              background: 'rgba(0,168,107,0.06)',
              border: '1px solid rgba(0,168,107,0.25)',
              borderRadius: '0.6vw',
              padding: '1.8vh 1.8vw',
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '1.15vw',
                  color: 'var(--ink-2)',
                  fontWeight: 500,
                }}
              >
                SmartScan Hub = 현관에서 미리 알림
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.95vw',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: '0.3vw',
                padding: '0.3vh 0.7vw',
                whiteSpace: 'nowrap',
                letterSpacing: '0.05vw',
              }}
            >
              선제 예방
            </span>
          </div>
        </motion.div>
      </div>
    </SlideLayout>
  )
}
