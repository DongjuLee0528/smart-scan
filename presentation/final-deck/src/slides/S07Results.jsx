// Design Ref: §4.7 — S07 Results (paper theme, horizontal timeline + per-phase animations)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const item = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const PHASES = [
  {
    date: '2026.03',
    title: '기획',
    items: ['프로젝트 기획안', '아키텍처 초안', '부품 선정'],
    current: false,
  },
  {
    date: '2026.04',
    title: '설계',
    items: ['DB 스키마 8 tables', 'Terraform IaC', 'API 설계'],
    current: false,
  },
  {
    date: '2026.04',
    title: '구현',
    items: ['Lambda 4개', 'Raspberry Pi 코드', 'FastAPI BE'],
    current: false,
  },
  {
    date: '2026.05',
    title: '통합',
    items: ['API Gateway 연동', '웹 프론트', '도메인 설정'],
    current: false,
  },
  {
    date: '2026.05',
    title: '완성 ✓',
    items: ['전체 시스템 가동', 'smartscan-hub.com', '시연 준비'],
    current: true,
  },
]

const BADGES = [
  { icon: '🔗', label: 'smartscan-hub.com' },
  { icon: '🗄️', label: 'PostgreSQL 8 tables' },
  { icon: '⚡', label: 'Lambda 4개' },
  { icon: '🏗️', label: 'Terraform IaC' },
]

/* ── per-phase animation components ── */

function AnimPlanning() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8vh', marginTop: '1.5vh' }}>
      <span style={{ fontSize: '2.8vw', animation: 'bulbBlink 2.4s ease-in-out infinite' }}>💡</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4vh', alignItems: 'flex-start' }}>
        {[{ w: '4vw', d: '0s' }, { w: '3.2vw', d: '0.3s' }, { w: '2.6vw', d: '0.6s' }].map((l, i) => (
          <div key={i} style={{ height: '2px', width: l.w, background: 'var(--ink-3)', borderRadius: '1px', animation: `lineSlide 2.4s ${l.d} ease-in-out infinite` }} />
        ))}
      </div>
    </div>
  )
}

function AnimDesign() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5vh', marginTop: '1.5vh' }}>
      <div style={{ border: '1.5px solid var(--accent)', borderRadius: '0.3vw', overflow: 'hidden', width: '7.5vw', boxShadow: '0 2px 6px rgba(0,168,107,0.15)' }}>
        {/* header */}
        <div style={{ background: 'var(--accent)', padding: '0.3vh 0.4vw', fontFamily: "'Space Mono', monospace", fontSize: '1.3vw', color: '#fff', textAlign: 'center', letterSpacing: '0.05vw' }}>
          SCHEMA
        </div>
        {/* rows */}
        {['profiles', 'items', 'tags', 'scan_logs'].map((row, i) => (
          <div key={row} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.9vw', padding: '0.25vh 0.4vw', borderTop: '1px solid rgba(0,168,107,0.2)', color: 'var(--ink-3)', animation: `rowAppear 3.2s ${i * 0.4}s ease-in-out infinite` }}>
            {row}
          </div>
        ))}
      </div>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.3vw', color: 'var(--accent)' }}>8 tables</span>
    </div>
  )
}

function AnimImpl() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh', marginTop: '1.5vh' }}>
      {/* 4 lambda symbols */}
      <div style={{ display: 'flex', gap: '0.5vw', alignItems: 'center' }}>
        {[0, 0.2, 0.4, 0.6].map((delay, i) => (
          <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.9vw', fontWeight: 700, color: 'var(--accent)', animation: `lambdaPulse 2s ${delay}s ease-in-out infinite` }}>
            λ
          </span>
        ))}
      </div>
      {/* Raspberry Pi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4vw', animation: 'iconPop 2s 0.8s ease-in-out infinite' }}>
        <span style={{ fontSize: '1.4vw' }}>🖥️</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.3vw', color: 'var(--ink-4)' }}>RPi 4B</span>
      </div>
    </div>
  )
}

function AnimIntegration() {
  const boxes = [
    { label: 'Pi',  color: '#2563eb', delay: '0s' },
    { label: 'API', color: 'var(--accent)', delay: '0.4s' },
    { label: 'Web', color: '#8B5CF6', delay: '0.8s' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8vh', marginTop: '1.5vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25vw' }}>
        {boxes.map((b, i) => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '0.25vw' }}>
            <div style={{ border: `1.5px solid ${b.color}`, padding: '0.35vh 0.5vw', borderRadius: '0.25vw', fontFamily: "'Space Mono', monospace", fontSize: '0.8vw', color: b.color, fontWeight: 700, animation: `boxPop 2.4s ${b.delay} ease-in-out infinite` }}>
              {b.label}
            </div>
            {i < boxes.length - 1 && (
              <span style={{ color: 'var(--accent)', fontSize: '0.9vw', animation: `arrowPulse 2.4s ${b.delay} ease-in-out infinite` }}>→</span>
            )}
          </div>
        ))}
      </div>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.3vw', color: 'var(--ink-4)', animation: 'arrowPulse 2.4s 0.6s ease-in-out infinite' }}>
        End-to-End 연동
      </span>
    </div>
  )
}

function AnimComplete() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6vh', marginTop: '1.5vh' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* pulse ring */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '3.5vw', height: '3.5vw', borderRadius: '50%', border: '2px solid var(--accent)', animation: 'pulseRing 1.8s ease-out infinite' }} />
        <span style={{ fontSize: '2.8vw', display: 'block', animation: 'celebGlow 1.8s ease-in-out infinite' }}>🌐</span>
        {/* green check badge */}
        <div style={{ position: 'absolute', top: '-0.6vh', right: '-0.5vw', width: '1.1vw', height: '1.1vw', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkPop 1.8s ease-in-out infinite' }}>
          <span style={{ fontSize: '0.8vw', color: '#fff', fontWeight: 900, lineHeight: 1 }}>✓</span>
        </div>
      </div>
      <div style={{ background: 'var(--accent)', color: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '0.8vw', fontWeight: 700, padding: '0.3vh 0.8vw', borderRadius: '0.25vw', letterSpacing: '0.1vw', animation: 'liveBlink 1.8s ease-in-out infinite' }}>
        LIVE
      </div>
    </div>
  )
}

const PHASE_ANIMS = [AnimPlanning, AnimDesign, AnimImpl, AnimIntegration, AnimComplete]

export default function S07Results({ slideNum, total }) {
  return (
    <SlideLayout theme="paper" slideNum={slideNum} total={total}>
      <style>{`
        @keyframes bulbBlink {
          0%, 100% { filter: brightness(1); transform: scale(1); }
          30% { filter: brightness(0.5) grayscale(0.6); transform: scale(0.92); }
          60% { filter: brightness(1.4); transform: scale(1.06); }
        }
        @keyframes lineSlide {
          0% { transform: scaleX(0); opacity: 0; transform-origin: left; }
          30% { transform: scaleX(1); opacity: 1; transform-origin: left; }
          80% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        @keyframes rowAppear {
          0%, 100% { opacity: 0; transform: translateX(-6px); }
          25% { opacity: 1; transform: translateX(0); }
          75% { opacity: 1; transform: translateX(0); }
        }
        @keyframes lambdaPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes iconPop {
          0%, 100% { opacity: 0.5; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes boxPop {
          0%, 100% { opacity: 0.35; transform: scale(0.93); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes pulseRing {
          0% { transform: translate(-50%,-50%) scale(0.7); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(1.4); opacity: 0; }
        }
        @keyframes celebGlow {
          0%, 100% { filter: drop-shadow(0 0 0px #00a86b); }
          50% { filter: drop-shadow(0 0 10px #00a86b); }
        }
        @keyframes checkPop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        @keyframes liveBlink {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; box-shadow: 0 0 8px rgba(0,168,107,0.5); }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '7vh 5vw 3vh',
          gap: '1vh',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8vw', color: 'var(--accent)', letterSpacing: '0.3vw', textTransform: 'uppercase', marginBottom: '0.5vh' }}>
            구현 진행사항
          </p>
          <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '4vw', fontWeight: 900, color: 'var(--ink-1)', lineHeight: 1, margin: 0 }}>
            단계별 결과물
          </h2>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 0,
            padding: '1vh 0 0',
            position: 'relative',
          }}
        >
          {PHASES.map((phase, idx) => {
            const PhaseAnim = PHASE_ANIMS[idx]
            return (
              <div key={phase.title} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                {/* connector line before phase */}
                {idx > 0 && (
                  <div style={{ height: '2px', background: 'var(--accent)', flex: 1, marginTop: '0.55vw', opacity: 0.5 }} />
                )}

                <motion.div
                  variants={item}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.8vh',
                    flex: idx === 0 || idx === PHASES.length - 1 ? 'none' : 2,
                    minWidth: 0,
                  }}
                >
                  {/* Dot */}
                  <div style={{
                    width: phase.current ? '1.4vw' : '1.2vw',
                    height: phase.current ? '1.4vw' : '1.2vw',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    flexShrink: 0,
                    boxShadow: phase.current
                      ? '0 0 0 4px rgba(0,168,107,0.2), 0 0 12px rgba(0,168,107,0.4)'
                      : 'none',
                  }} />

                  {/* Date */}
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.9vw', color: 'var(--ink-4)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {phase.date}
                  </p>

                  {/* Title */}
                  <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: phase.current ? 'var(--accent)' : 'var(--ink-1)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {phase.title}
                  </p>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3vh', alignItems: 'center' }}>
                    {phase.items.map((it) => (
                      <p key={it} style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '1.3vw', color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.4 }}>
                        · {it}
                      </p>
                    ))}
                  </div>

                  {/* Per-phase animation */}
                  <PhaseAnim />
                </motion.div>
              </div>
            )
          })}
        </motion.div>

        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          style={{ display: 'flex', gap: '1.5vw', justifyContent: 'center', flexWrap: 'wrap', paddingBottom: '0.5vh' }}
        >
          {BADGES.map((b) => (
            <div key={b.label} style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '0.8vh 1.5vw', borderRadius: '0.3vw', fontFamily: "'Space Mono', monospace", fontSize: '1.3vw', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: '0.5vw', whiteSpace: 'nowrap' }}>
              {b.icon} {b.label}
            </div>
          ))}
        </motion.div>
      </div>
    </SlideLayout>
  )
}
