// Design Ref: §4.8 — S08 Scenario (white theme, left steps + right live-flow animation)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
}

const stepItem = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const STEPS = [
  {
    num: '01',
    icon: '📡',
    title: 'RFID 상시 스캔',
    detail: 'Raspberry Pi 이벤트 기반 상태 머신 → FI-805F 0.1초 내 다중 태그 인식',
  },
  {
    num: '02',
    icon: '⬆️',
    title: 'API Gateway 전송',
    detail: 'scan-process Lambda 호출 → Supabase DB 저장 · 필수품 목록 비교',
  },
  {
    num: '03',
    icon: '⚡',
    title: '누락 항목 판단',
    detail: 'Supabase DB 필수품 목록과 비교 → missing-alert Lambda 트리거',
  },
  {
    num: '04',
    icon: '📧',
    title: '이메일 알림 발송',
    detail: 'missing-alert Lambda → Resend API → 3초 내 수신',
  },
  {
    num: '05',
    icon: '📊',
    title: '대시보드 실시간 업데이트',
    detail: 'Supabase Realtime WebSocket → 웹 대시보드 즉시 반영',
  },
]

const ANIM_DURATION = '5s'

export default function S08Scenario({ slideNum, total }) {
  return (
    <SlideLayout theme="white" slideNum={slideNum} total={total}>
      <style>{`
        /* ── Person walks left→right (inside → out through door) ── */
        @keyframes walkOut {
          0%, 3%  { left: 6%;  opacity: 1; }
          38%     { left: 42%; opacity: 1; }
          52%     { left: 72%; opacity: 0.3; }
          54%     { left: 6%;  opacity: 0; }
          100%    { left: 6%;  opacity: 0; }
        }

        /* ── Door swings open (hinge on left, right edge swings out) ── */
        @keyframes doorOpen {
          0%, 28%  { transform: perspective(400px) rotateY(0deg); }
          38%      { transform: perspective(400px) rotateY(80deg); }
          54%      { transform: perspective(400px) rotateY(80deg); }
          64%      { transform: perspective(400px) rotateY(0deg); }
          100%     { transform: perspective(400px) rotateY(0deg); }
        }

        /* ── RFID pulse rings ── */
        @keyframes rfidRing1 {
          0%,35% { transform: scale(0.5); opacity: 0; }
          42%    { transform: scale(1);   opacity: 0.8; }
          65%    { transform: scale(2.2); opacity: 0; }
          100%   { transform: scale(0.5); opacity: 0; }
        }
        @keyframes rfidRing2 {
          0%,40% { transform: scale(0.5); opacity: 0; }
          50%    { transform: scale(1);   opacity: 0.5; }
          72%    { transform: scale(2.8); opacity: 0; }
          100%   { transform: scale(0.5); opacity: 0; }
        }

        /* ── "SCAN" label blink ── */
        @keyframes scanLabel {
          0%,35% { opacity: 0; }
          42%    { opacity: 1; }
          68%    { opacity: 1; }
          76%    { opacity: 0; }
          100%   { opacity: 0; }
        }

        /* ── data dots rise ── */
        @keyframes dotRise {
          0%,58% { transform: translateY(0);    opacity: 0; }
          62%    { transform: translateY(0);    opacity: 1; }
          80%    { transform: translateY(-5vh); opacity: 0.6; }
          90%    { transform: translateY(-8vh); opacity: 0; }
          100%   { transform: translateY(-8vh); opacity: 0; }
        }

        /* ── cloud glow ── */
        @keyframes cloudGlow {
          0%,55%  { filter: drop-shadow(0 0 0px #00a86b); }
          70%     { filter: drop-shadow(0 0 10px #00a86b); }
          85%     { filter: drop-shadow(0 0 18px #00a86b); }
          95%     { filter: drop-shadow(0 0 8px #00a86b); }
          100%    { filter: drop-shadow(0 0 0px #00a86b); }
        }

        /* ── phone bounce + notification ── */
        @keyframes phoneBounce {
          0%,74% { transform: translateY(0) rotate(0deg); }
          78%    { transform: translateY(-6px) rotate(-6deg); }
          82%    { transform: translateY(-3px) rotate(5deg); }
          86%    { transform: translateY(-5px) rotate(-3deg); }
          90%    { transform: translateY(-2px) rotate(2deg); }
          94%    { transform: translateY(-3px) rotate(0deg); }
          98%    { transform: translateY(0) rotate(0deg); }
          100%   { transform: translateY(0) rotate(0deg); }
        }
        @keyframes notiBadge {
          0%,72%  { transform: scale(0); opacity: 0; }
          78%     { transform: scale(1.4); opacity: 1; }
          83%     { transform: scale(1);   opacity: 1; }
          97%     { transform: scale(1);   opacity: 1; }
          100%    { transform: scale(0);   opacity: 0; }
        }

        /* ── step connector pulse ── */
        @keyframes connPulse {
          0%,60%  { opacity: 0.15; }
          68%     { opacity: 0.9; }
          82%     { opacity: 0.9; }
          90%     { opacity: 0.15; }
          100%    { opacity: 0.15; }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '7vh 5vw 3vh',
          gap: '1.5vh',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.15vw', color: 'var(--accent)', letterSpacing: '0.28vw', textTransform: 'uppercase', marginBottom: '0.4vh' }}>
            서비스 시나리오
          </p>
          <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '3.2vw', fontWeight: 900, color: 'var(--ink-1)', lineHeight: 1, margin: 0 }}>
            주요 서비스 흐름
          </h2>
        </motion.div>

        {/* 2-column body */}
        <div style={{ display: 'grid', gridTemplateColumns: '54% 46%', flex: 1, gap: '2.5vw', minHeight: 0 }}>

          {/* ── LEFT: step list ── */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.6vh' }}>
            <motion.div variants={container} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '0.7vh' }}>
              {STEPS.map((step, idx) => (
                <motion.div
                  key={step.num}
                  variants={stepItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2vw',
                    padding: '1.1vh 1.4vw',
                    background: idx % 2 === 0 ? '#FFFFFF' : 'var(--paper)',
                    borderLeft: '3px solid var(--accent)',
                    borderRadius: '0.4vw',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* watermark num */}
                  <span style={{ position: 'absolute', left: '1vw', fontFamily: "'Space Mono', monospace", fontSize: '3.5vw', color: 'rgba(0,168,107,0.06)', fontWeight: 900, userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>
                    {step.num}
                  </span>

                  {/* num + icon */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '2.8vw', zIndex: 1 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.4vw', color: 'var(--accent)', lineHeight: 1 }}>{step.num}</span>
                    <span style={{ fontSize: '1vw' }}>{step.icon}</span>
                  </div>

                  {/* text */}
                  <div style={{ flex: 1, zIndex: 1 }}>
                    <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '1.15vw', fontWeight: 700, color: 'var(--ink-1)', marginBottom: '0.2vh' }}>{step.title}</p>
                    <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '1.15vw', color: 'var(--ink-3)' }}>{step.detail}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* badge */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ marginTop: '0.8vh' }}>
              <div style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontFamily: "'Pretendard', sans-serif", fontSize: '1.05vw', fontWeight: 700, padding: '0.7vh 1.8vw', borderRadius: '0.35vw' }}>
                총 응답 시간 &lt; 3초
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: live-flow animation ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              background: '#F7F9F8',
              border: '1.5px solid var(--line)',
              borderRadius: '1vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              padding: '1.5vh 1.5vw 1.5vh',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* panel label */}
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85vw', color: 'var(--accent)', letterSpacing: '0.14vw', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
              LIVE FLOW
            </span>

            {/* ── ZONE 1: Person exits door + RFID scans ── */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4vh' }}>
              {/* scene row: left=outside, right=inside */}
              <div style={{ position: 'relative', width: '90%', height: '12vh' }}>

                {/* "현관문" label above door */}
                <span style={{ position: 'absolute', left: '52%', top: 0, transform: 'translateX(-50%)', fontFamily: "'Space Mono', monospace", fontSize: '0.8vw', color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>현관문</span>

                {/* door frame — center of scene */}
                <div style={{ position: 'absolute', left: '52%', bottom: 0, transform: 'translateX(-50%)', width: '5vw', height: '11vh', border: '2.5px solid #64748b', borderBottom: 'none', borderRadius: '0.3vw 0.3vw 0 0', overflow: 'visible', flexShrink: 0 }}>

                  {/* door panel — hinged on left side, right edge swings outward */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0,
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #c8a97a 0%, #a07850 100%)',
                    borderLeft: '2px solid #7a5c38',
                    transformOrigin: 'left center',
                    animation: `doorOpen ${ANIM_DURATION} ease-in-out infinite`,
                    boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.15)',
                  }}>
                    {/* door knob — right side */}
                    <div style={{ position: 'absolute', right: '0.5vw', top: '45%', width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: '#f0d080', boxShadow: '0 0 2px rgba(0,0,0,0.3)' }} />
                  </div>

                  {/* RFID reader bar — left side of door frame (inside wall) */}
                  <div style={{ position: 'absolute', left: '-0.9vw', top: '20%', width: '0.45vw', height: '3.5vh', background: 'var(--accent)', borderRadius: '0.2vw', boxShadow: '0 0 6px rgba(0,168,107,0.4)', zIndex: 2 }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '2.2vw', height: '2.2vw', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '2px solid var(--accent)', animation: `rfidRing1 ${ANIM_DURATION} ease-out infinite` }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '2.2vw', height: '2.2vw', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1.5px solid var(--accent)', animation: `rfidRing2 ${ANIM_DURATION} ease-out infinite` }} />
                  </div>
                </div>

                {/* person: starts inside (left), walks right through door to outside */}
                <div style={{ position: 'absolute', bottom: 0, animation: `walkOut ${ANIM_DURATION} ease-in-out infinite` }}>
                  <span style={{ fontSize: '3.2vw', lineHeight: 1, display: 'inline-block', transform: 'scaleX(-1)' }}>🚶</span>
                </div>

                {/* inside label (left) */}
                <span style={{ position: 'absolute', left: '2%', top: '0.5vh', fontFamily: "'Space Mono', monospace", fontSize: '0.75vw', color: 'var(--ink-4)' }}>실내</span>
                {/* outside label (right) */}
                <span style={{ position: 'absolute', right: '4%', top: '0.5vh', fontFamily: "'Space Mono', monospace", fontSize: '0.75vw', color: 'var(--ink-4)' }}>외부</span>

                {/* SCAN label */}
                <span style={{ position: 'absolute', right: '5%', bottom: '1vh', fontFamily: "'Space Mono', monospace", fontSize: '0.85vw', fontWeight: 700, color: 'var(--accent)', animation: `scanLabel ${ANIM_DURATION} ease-in-out infinite` }}>
                  SCAN ✓
                </span>
              </div>

              {/* floor */}
              <div style={{ width: '88%', height: '1px', background: 'var(--line)' }} />
            </div>

            {/* ── connector: RFID → Cloud ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2vh', position: 'relative', height: '3.5vh', width: '100%', justifyContent: 'center' }}>
              {[0, 0.18, 0.36].map((delay, i) => (
                <div key={i} style={{ position: 'absolute', width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: 'var(--accent)', left: `calc(50% + ${(i - 1) * 1.1}vw)`, bottom: '0.3vh', animation: `dotRise ${ANIM_DURATION} ease-in-out ${delay}s infinite` }} />
              ))}
              <span style={{ position: 'absolute', bottom: 0, fontFamily: "'Space Mono', monospace", fontSize: '0.8vw', color: 'var(--ink-4)', animation: `scanLabel ${ANIM_DURATION} ease-in-out infinite`, whiteSpace: 'nowrap' }}>
                API Gateway → Lambda
              </span>
            </div>

            {/* ── ZONE 2: Cloud ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2vh' }}>
              <span style={{ fontSize: '2.8vw', lineHeight: 1, animation: `cloudGlow ${ANIM_DURATION} ease-in-out infinite` }}>☁️</span>
              <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '0.9vw', color: 'var(--ink-3)', fontWeight: 600 }}>Supabase · Lambda</span>
            </div>

            {/* ── connector: Cloud → Phone ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2vh' }}>
              <div style={{ width: '1px', height: '2vh', background: 'linear-gradient(to bottom, var(--accent), transparent)', animation: `connPulse ${ANIM_DURATION} ease-in-out infinite` }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8vw', color: 'var(--ink-4)', animation: `connPulse ${ANIM_DURATION} ease-in-out infinite`, whiteSpace: 'nowrap' }}>이메일 발송</span>
            </div>

            {/* ── ZONE 3: Phone ── */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2vh' }}>
              <span style={{ fontSize: '2.8vw', lineHeight: 1, animation: `phoneBounce ${ANIM_DURATION} ease-in-out infinite` }}>📱</span>
              <div style={{ position: 'absolute', top: '-0.5vh', right: '-0.4vw', width: '1vw', height: '1vw', background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: `notiBadge ${ANIM_DURATION} ease-in-out infinite` }}>
                <span style={{ fontSize: '0.48vw', color: '#fff', fontWeight: 900, lineHeight: 1 }}>!</span>
              </div>
              <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '0.9vw', color: 'var(--ink-3)', fontWeight: 600 }}>알림 수신</span>
            </div>

          </motion.div>

        </div>
      </div>
    </SlideLayout>
  )
}
