// Design Ref: §4.4 — S04 Architecture (white theme, 3-tier diagram + column-bottom animations)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
}

const item = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const dotStyle = {
  display: 'inline-block',
  width: '0.5vw',
  height: '0.5vw',
  borderRadius: '50%',
  backgroundColor: 'var(--accent)',
  marginRight: '0.6vw',
  flexShrink: 0,
  marginTop: '0.35em',
}

const colHeaderStyle = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '0.95vw',
  color: 'var(--accent)',
  fontWeight: 700,
  letterSpacing: '0.15vw',
  marginBottom: '1.5vh',
  display: 'block',
}

const rowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  fontSize: '1.05vw',
  color: 'var(--ink-2)',
  fontFamily: "'Pretendard', sans-serif",
  lineHeight: 1.6,
  marginBottom: '0.8vh',
}

const sectionLabelStyle = {
  fontFamily: "'Pretendard', sans-serif",
  fontSize: '1vw',
  fontWeight: 700,
  color: 'var(--ink-1)',
  marginBottom: '0.4vh',
  marginTop: '1.2vh',
  display: 'block',
}

const sectionDetailStyle = {
  fontFamily: "'Pretendard', sans-serif",
  fontSize: '0.95vw',
  color: 'var(--ink-3)',
  lineHeight: 1.5,
  paddingLeft: '0.8vw',
  display: 'block',
  marginBottom: '0.3vh',
}

const arrowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2vw',
  color: 'var(--accent)',
  flexShrink: 0,
  alignSelf: 'center',
  padding: '0 0.5vw',
}

/* ── EDGE column bottom: RPi mini-board ── */
function AnimEdge() {
  return (
    <div style={{ marginTop: 'auto', paddingTop: '1.5vh', borderTop: '1px dashed rgba(0,168,107,0.25)' }}>
      <div style={{
        background: '#1a5c2a',
        borderRadius: '0.4vw',
        padding: '0.7vh 0.8vw',
        display: 'flex',
        alignItems: 'center',
        gap: '0.7vw',
      }}>
        {/* GPIO pins */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25vh', flexShrink: 0 }}>
          {[0, 1].map(r => (
            <div key={r} style={{ display: 'flex', gap: '0.15vw' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ width: '0.2vw', height: '0.6vh', background: '#c8a820', borderRadius: '0.05vw' }} />
              ))}
            </div>
          ))}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5vw', color: '#7aba8a' }}>GPIO</span>
        </div>
        {/* CPU */}
        <div style={{ width: '1.4vw', height: '1.4vw', background: '#111', border: '1px solid #555', borderRadius: '0.12vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.42vw', color: '#888', lineHeight: 1.1, textAlign: 'center' }}>BCM{'\n'}2711</span>
        </div>
        {/* LEDs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3vh' }}>
          {[{ c: '#ff2020', l: 'PWR', d: '0s' }, { c: '#00ee55', l: 'ACT', d: '0.5s' }].map(({ c, l, d }) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.3vw' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: c, animation: `archLed 1.8s ${d} ease-in-out infinite`, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6vw', color: '#9aba9a' }}>{l}</span>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55vw', color: '#7aba8a', marginLeft: 'auto' }}>RPi 4B</span>
      </div>
    </div>
  )
}

/* ── CLOUD column bottom: Lambda invocations + DB ── */
function AnimCloud() {
  return (
    <div style={{ marginTop: 'auto', paddingTop: '1.5vh', borderTop: '1px dashed rgba(0,168,107,0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
        {/* Lambda × 4 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3vh', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '0.4vw' }}>
            {[0, 0.25, 0.5, 0.75].map((d, i) => (
              <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5vw', fontWeight: 700, color: 'var(--accent)', animation: `archLambda 2s ${d}s ease-in-out infinite` }}>λ</span>
            ))}
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58vw', color: 'var(--ink-4)' }}>Lambda ×4</span>
        </div>

        <div style={{ width: '1px', height: '3vh', background: 'var(--line)' }} />

        {/* DB cylinder */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15vh', flexShrink: 0 }}>
          <div style={{ width: '2vw', height: '0.5vh', background: 'rgba(0,168,107,0.2)', border: '1.5px solid var(--accent)', borderRadius: '50%' }} />
          <div style={{ width: '2vw', height: '1.8vh', background: 'rgba(0,168,107,0.08)', border: '1.5px solid var(--accent)', borderLeft: '1.5px solid var(--accent)', borderRight: '1.5px solid var(--accent)', borderTop: 'none', borderBottom: 'none' }} />
          <div style={{ width: '2vw', height: '0.5vh', background: 'rgba(0,168,107,0.2)', border: '1.5px solid var(--accent)', borderRadius: '50%', animation: 'archDbPulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55vw', color: 'var(--ink-4)', marginTop: '0.2vh' }}>Supabase</span>
        </div>

        <div style={{ width: '1px', height: '3vh', background: 'var(--line)' }} />

        {/* Request counter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25vh' }}>
          {['scan-process', 'missing-alert'].map((fn, i) => (
            <div key={fn} style={{ display: 'flex', alignItems: 'center', gap: '0.3vw' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--accent)', animation: `archLed 1.5s ${i * 0.4}s ease-in-out infinite` }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55vw', color: 'var(--ink-3)' }}>{fn}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── USER column bottom: dashboard + phone notif ── */
function AnimUser() {
  return (
    <div style={{ marginTop: 'auto', paddingTop: '1.5vh', borderTop: '1px dashed rgba(0,168,107,0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
        {/* Mini browser / dashboard */}
        <div style={{ border: '1.5px solid var(--line)', borderRadius: '0.35vw', overflow: 'hidden', width: '4.5vw', flexShrink: 0 }}>
          <div style={{ background: '#e2e8f0', padding: '0.3vh 0.4vw', display: 'flex', gap: '0.2vw', alignItems: 'center' }}>
            {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: '0.3vw', height: '0.3vw', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ padding: '0.4vh 0.4vw', display: 'flex', alignItems: 'flex-end', gap: '0.25vw', background: '#fff', height: '2.2vh' }}>
            {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
              <div key={i} style={{ flex: 1, background: 'var(--accent)', opacity: 0.6 + h * 0.4, borderRadius: '0.1vw 0.1vw 0 0', height: `${h * 100}%`, animation: `archBar 2s ${i * 0.2}s ease-in-out infinite` }} />
            ))}
          </div>
        </div>

        <div style={{ width: '1px', height: '3vh', background: 'var(--line)' }} />

        {/* Phone + notification */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <span style={{ fontSize: '2vw', lineHeight: 1, display: 'block', animation: 'archPhone 2.5s ease-in-out infinite' }}>📱</span>
          <div style={{
            position: 'absolute', top: '-0.3vh', right: '-0.3vw',
            width: '0.9vw', height: '0.9vw',
            background: '#ef4444', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'archNoti 2.5s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '0.45vw', color: '#fff', fontWeight: 900, lineHeight: 1 }}>!</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2vh' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6vw', color: 'var(--accent)', fontWeight: 700 }}>Realtime</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55vw', color: 'var(--ink-4)' }}>WebSocket ↔</span>
        </div>
      </div>
    </div>
  )
}

export default function S04Architecture({ slideNum, total }) {
  return (
    <SlideLayout theme="white" slideNum={slideNum} total={total}>
      <style>{`
        @keyframes archLed {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 5px currentColor; }
        }
        @keyframes archLambda {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes archDbPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; box-shadow: 0 0 8px rgba(0,168,107,0.5); }
        }
        @keyframes archBar {
          0%, 100% { opacity: 0.5; transform: scaleY(0.85); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        @keyframes archPhone {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          15% { transform: translateY(-3px) rotate(-5deg); }
          30% { transform: translateY(-2px) rotate(4deg); }
          45% { transform: translateY(-3px) rotate(-2deg); }
          60% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes archNoti {
          0%, 100% { transform: scale(0); opacity: 0; }
          20% { transform: scale(1.3); opacity: 1; }
          35% { transform: scale(1); opacity: 1; }
          55% { transform: scale(1); opacity: 1; }
          70% { transform: scale(0); opacity: 0; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '7vh 5vw 0 5vw' }}>

        {/* Title block */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginBottom: '2.5vh' }}
        >
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.95vw',
            color: 'var(--accent)',
            fontWeight: 700,
            letterSpacing: '0.15vw',
            display: 'block',
            marginBottom: '0.6vh',
            textTransform: 'uppercase',
          }}>
            시스템 아키텍처
          </span>
          <h1 style={{
            fontFamily: "'Pretendard', sans-serif",
            fontSize: '3.5vw',
            fontWeight: 900,
            color: 'var(--ink-1)',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Edge – Cloud – User 3계층
          </h1>
        </motion.div>

        {/* 3-column architecture diagram */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', gap: '0', flex: 1, alignItems: 'stretch' }}
        >
          {/* Column 1: EDGE */}
          <motion.div
            variants={item}
            style={{
              flex: 1,
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: '0.8vw',
              padding: '2vh 1.5vw',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={colHeaderStyle}>EDGE</span>
            {[
              { main: 'Raspberry Pi 4B (8GB)', sub: 'Edge 서버 · 메인 컨트롤러' },
              { main: 'UHF RFID FI-805F', sub: 'UART · 902-928MHz' },
              { main: 'USB-to-RS232 컨버터', sub: 'FI-805F 연결 인터페이스' },
              { main: 'Python 스캔 코드', sub: '이벤트 기반 상태 머신' },
            ].map((row, i) => (
              <div key={i} style={rowStyle}>
                <span style={dotStyle} />
                <div>
                  <span style={{ fontWeight: 600, display: 'block', fontSize: '0.85vw' }}>{row.main}</span>
                  <span style={{ color: 'var(--ink-4)', fontSize: '0.9vw' }}>{row.sub}</span>
                </div>
              </div>
            ))}
            <AnimEdge />
          </motion.div>

          {/* Arrow 1 */}
          <div style={arrowStyle}>→</div>

          {/* Column 2: CLOUD */}
          <motion.div
            variants={item}
            style={{
              flex: 1.4,
              border: '2px solid var(--accent)',
              borderRadius: '0.8vw',
              padding: '2vh 1.5vw',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={colHeaderStyle}>CLOUD</span>

            <span style={sectionLabelStyle}>Supabase</span>
            <span style={sectionDetailStyle}>Auth · PostgreSQL (8 tables) · Realtime</span>

            <span style={sectionLabelStyle}>FastAPI (Render)</span>
            <span style={sectionDetailStyle}>CRUD API · 비즈니스 로직</span>

            <span style={sectionLabelStyle}>AWS Lambda ×4</span>
            <span style={sectionDetailStyle}>scan-process · missing-alert</span>
            <span style={sectionDetailStyle}>send-remote · chatbot</span>

            <span style={sectionLabelStyle}>API Gateway + S3 + CloudFront</span>
            <span style={sectionDetailStyle}>엣지 캐싱 · 정적 자산 · 라우팅</span>

            <AnimCloud />
          </motion.div>

          {/* Arrow 2 */}
          <div style={arrowStyle}>→</div>

          {/* Column 3: USER */}
          <motion.div
            variants={item}
            style={{
              flex: 1,
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: '0.8vw',
              padding: '2vh 1.5vw',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={colHeaderStyle}>USER</span>
            {[
              { main: '웹 대시보드', sub: 'smartscan-hub.com' },
              { main: '이메일 알림', sub: 'Resend API' },
              { main: '카카오톡 챗봇', sub: '원격 제어 · 조회' },
              { main: 'Supabase Realtime', sub: '실시간 상태 동기화' },
            ].map((row, i) => (
              <div key={i} style={rowStyle}>
                <span style={dotStyle} />
                <div>
                  <span style={{ fontWeight: 600, display: 'block', fontSize: '0.85vw' }}>{row.main}</span>
                  <span style={{ color: 'var(--ink-4)', fontSize: '0.9vw' }}>{row.sub}</span>
                </div>
              </div>
            ))}
            <AnimUser />
          </motion.div>
        </motion.div>

        {/* Bottom cost comparison bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: 'linear-gradient(90deg, rgba(229,57,53,0.1), rgba(0,168,107,0.1))',
            borderTop: '1px solid var(--line)',
            padding: '2vh 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2vh',
          }}
        >
          <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '1.1vw', fontWeight: 600, color: 'var(--warn)' }}>
            기존 AWS 아키텍처 ~₩50,000/월
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.95vw', color: 'var(--ink-4)', letterSpacing: '0.05vw' }}>
            vs
          </span>
          <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '1.1vw', fontWeight: 700, color: 'var(--accent)' }}>
            현재 아키텍처 거의 ₩0/월 (무료 티어)
          </span>
        </motion.div>

      </div>
    </SlideLayout>
  )
}
