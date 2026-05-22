// Design Ref: §4.5 — S05 Hardware (paper theme, 2×2 card grid + hardware viz animations)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const item = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const hardware = [
  {
    icon: '🖥️',
    name: 'Raspberry Pi 4B',
    spec: 'RAM 8GB',
    desc: 'Edge 서버 · Python 이벤트 기반 스캐너',
    borderColor: 'var(--accent)',
    specBg: 'rgba(0,168,107,0.15)',
    specColor: 'var(--accent)',
    anim: 'rpi',
  },
  {
    icon: '📡',
    name: 'UHF RFID FI-805F',
    spec: '902-928MHz UART',
    desc: '0.1초 내 다중 태그 인식',
    borderColor: 'var(--blue)',
    specBg: 'rgba(37,99,235,0.12)',
    specColor: 'var(--blue)',
    anim: 'rfid',
  },
  {
    icon: '🔌',
    name: 'USB-to-RS232 컨버터',
    spec: 'RS232 → USB 변환',
    desc: 'FI-805F ↔ Raspberry Pi 연결',
    borderColor: 'var(--hi)',
    specBg: 'rgba(255,212,0,0.18)',
    specColor: '#997F00',
    anim: 'usb',
  },
  {
    icon: '🏷️',
    name: '안티메탈 UHF 태그',
    spec: 'ISO 18000-6C',
    desc: '소지품에 부착 · 재사용 가능',
    borderColor: '#8B5CF6',
    specBg: 'rgba(139,92,246,0.12)',
    specColor: '#8B5CF6',
    anim: 'tag',
  },
]

/* ── RPi PCB mini-board ── */
function AnimRPi() {
  return (
    <div style={{ marginTop: 'auto', paddingTop: '1.2vh' }}>
      <div style={{
        background: '#1a5c2a',
        borderRadius: '0.4vw',
        padding: '0.8vh 1vw',
        display: 'flex',
        alignItems: 'center',
        gap: '1vw',
        border: '1px solid #2d7a3a',
      }}>
        {/* GPIO pin rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3vh', flexShrink: 0 }}>
          {[0, 1].map(row => (
            <div key={row} style={{ display: 'flex', gap: '0.18vw' }}>
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ width: '0.22vw', height: '0.7vh', background: '#c8a820', borderRadius: '0.06vw' }} />
              ))}
            </div>
          ))}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6vw', color: '#7aba8a', marginTop: '0.1vh' }}>GPIO 40-pin</span>
        </div>

        {/* CPU block */}
        <div style={{
          width: '1.8vw', height: '1.8vw',
          background: '#111',
          border: '1.5px solid #555',
          borderRadius: '0.15vw',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5vw', color: '#888', lineHeight: 1, textAlign: 'center' }}>BCM{'\n'}2711</span>
        </div>

        {/* Status LEDs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4vh' }}>
          {[
            { color: '#ff2020', label: 'PWR', delay: '0s' },
            { color: '#00ee55', label: 'ACT', delay: '0.45s' },
          ].map(({ color, label, delay }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35vw' }}>
              <div style={{
                width: '0.55vw', height: '0.55vw', borderRadius: '50%', background: color,
                boxShadow: `0 0 0 ${color}`,
                animation: `rpiLed 1.8s ${delay} ease-in-out infinite`,
                flexShrink: 0,
              }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7vw', color: '#9aba9a' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── RFID reader + radio arcs ── */
function AnimRFID() {
  return (
    <div style={{ marginTop: 'auto', paddingTop: '1.2vh', display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
      {/* Reader unit */}
      <div style={{
        width: '1.3vw', height: '4vh',
        background: '#0f172a',
        borderRadius: '0.25vw',
        border: '1.5px solid #334',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35vh',
        flexShrink: 0,
      }}>
        <div style={{ width: '0.55vw', height: '0.55vw', borderRadius: '50%', background: 'var(--blue)', animation: 'rpiLed 1.5s 0s ease-in-out infinite' }} />
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: '0.7vw', height: '1px', background: '#334' }} />
        ))}
      </div>

      {/* Semicircular radio arcs */}
      <div style={{ position: 'relative', width: '5vw', height: '4.5vh', flexShrink: 0 }}>
        {[
          { size: '1.4vw', delay: '0s' },
          { size: '2.4vw', delay: '0.5s' },
          { size: '3.4vw', delay: '1.0s' },
        ].map(({ size, delay }, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 0, top: '50%',
            width: size, height: size,
            border: '2px solid var(--blue)',
            borderLeft: 'none',
            borderRadius: '0 50% 50% 0',
            transform: 'translateY(-50%)',
            animation: `rfidArcFade 2.4s ${delay} ease-out infinite`,
          }} />
        ))}
      </div>

      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8vw', color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>
        902–928 MHz
      </span>
    </div>
  )
}

/* ── USB↔RS232 data flow ── */
function AnimUSB() {
  return (
    <div style={{ marginTop: 'auto', paddingTop: '1.2vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
        {/* DB9 plug */}
        <div style={{
          background: '#78350f',
          borderRadius: '0.3vw',
          padding: '0.5vh 0.6vw',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25vh',
          flexShrink: 0,
        }}>
          {[[5], [4]].map((cols, ri) => (
            <div key={ri} style={{ display: 'flex', gap: '0.22vw' }}>
              {Array.from({ length: cols[0] }).map((_, i) => (
                <div key={i} style={{ width: '0.25vw', height: '0.25vw', borderRadius: '50%', background: '#fbbf24' }} />
              ))}
            </div>
          ))}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55vw', color: '#fbbf24', marginTop: '0.1vh' }}>DB9</span>
        </div>

        {/* Animated data wire */}
        <div style={{ flex: 1, position: 'relative', height: '0.5vh', background: 'rgba(153,127,0,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
          {[0, 0.35, 0.7].map((d, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '-6%',
              width: '0.7vw', height: '0.7vw',
              borderRadius: '50%', background: '#d97706',
              transform: 'translateY(-50%)',
              animation: `usbPacket 1.4s ${d}s linear infinite`,
            }} />
          ))}
        </div>

        {/* USB-A plug */}
        <div style={{
          background: '#1e293b',
          borderRadius: '0.2vw',
          padding: '0.5vh 0.8vw',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15vh',
          flexShrink: 0,
        }}>
          <div style={{ width: '1.2vw', height: '1.4vh', background: '#475569', borderRadius: '0.1vw' }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55vw', color: '#94a3b8' }}>USB</span>
        </div>
      </div>
    </div>
  )
}

/* ── UHF Tag with scan sweep ── */
function AnimTag() {
  return (
    <div style={{ marginTop: 'auto', paddingTop: '1.2vh' }}>
      <div style={{
        position: 'relative',
        background: '#fafafa',
        border: '1.5px solid #8B5CF6',
        borderRadius: '0.4vw',
        padding: '0.7vh 1vw',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8vw',
        overflow: 'hidden',
      }}>
        {/* Sweep beam */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '18%',
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)',
          animation: 'tagBeam 2.2s ease-in-out infinite',
        }} />

        {/* Antenna coil (3 arcs) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1vw', flexShrink: 0 }}>
          {['(', ')', '(', ')'].map((ch, i) => (
            <span key={i} style={{ fontFamily: 'monospace', fontSize: '1.3vw', color: '#8B5CF6', opacity: 0.5 + (i % 2) * 0.3, lineHeight: 1 }}>
              {ch}
            </span>
          ))}
        </div>

        {/* IC chip */}
        <div style={{ width: '1vw', height: '1vw', background: '#4c1d95', borderRadius: '0.1vw', flexShrink: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15vh' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75vw', color: '#8B5CF6', fontWeight: 700 }}>EPC Gen2</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65vw', color: 'var(--ink-4)' }}>ISO 18000-6C</span>
        </div>

        {/* Read OK badge */}
        <div style={{
          marginLeft: 'auto', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '0.2vw', padding: '0.2vh 0.5vw',
          fontFamily: "'Space Mono', monospace", fontSize: '0.7vw', color: '#8B5CF6', fontWeight: 700,
          animation: 'tagOk 2.2s ease-in-out infinite',
          flexShrink: 0,
        }}>
          READ ✓
        </div>
      </div>
    </div>
  )
}

const ANIMS = { rpi: AnimRPi, rfid: AnimRFID, usb: AnimUSB, tag: AnimTag }

export default function S05Hardware({ slideNum, total }) {
  return (
    <SlideLayout theme="paper" slideNum={slideNum} total={total}>
      <style>{`
        @keyframes rpiLed {
          0%, 100% { opacity: 0.2; transform: scale(0.85); box-shadow: none; }
          50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 6px currentColor; }
        }
        @keyframes rfidArcFade {
          0% { opacity: 0.9; }
          60% { opacity: 0.4; }
          100% { opacity: 0; }
        }
        @keyframes usbPacket {
          0%   { left: -6%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 106%;  opacity: 0; }
        }
        @keyframes tagBeam {
          0%   { left: -20%; }
          100% { left: 120%; }
        }
        @keyframes tagOk {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '7vh 5vw 0 5vw',
        }}
      >
        {/* Title block */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginBottom: '2vh' }}
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
            하드웨어 구성
          </span>
          <h1 style={{
            fontFamily: "'Pretendard', sans-serif",
            fontSize: '3.5vw',
            fontWeight: 900,
            color: 'var(--ink-1)',
            lineHeight: 1.1,
            margin: 0,
          }}>
            주요 부품 및 사양
          </h1>
        </motion.div>

        {/* 2×2 Card Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw', flex: 1 }}
        >
          {hardware.map((hw, i) => {
            const CardAnim = ANIMS[hw.anim]
            return (
              <motion.div
                key={i}
                variants={item}
                style={{
                  background: '#ffffff',
                  borderRadius: '0.8vw',
                  padding: '2vh 2vw',
                  borderLeft: `4px solid ${hw.borderColor}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.7vh',
                }}
              >
                <span style={{ fontSize: '3vw', lineHeight: 1, display: 'block' }}>{hw.icon}</span>

                <span style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '2.2vw',
                  fontWeight: 800,
                  color: 'var(--ink-1)',
                  lineHeight: 1.2,
                  display: 'block',
                }}>
                  {hw.name}
                </span>

                <span style={{
                  display: 'inline-block',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '1.1vw',
                  fontWeight: 700,
                  color: hw.specColor,
                  background: hw.specBg,
                  padding: '0.25vh 0.7vw',
                  borderRadius: '0.3vw',
                  alignSelf: 'flex-start',
                  letterSpacing: '0.05vw',
                }}>
                  {hw.spec}
                </span>

                <span style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '1.1vw',
                  color: 'var(--ink-3)',
                  lineHeight: 1.5,
                  display: 'block',
                }}>
                  {hw.desc}
                </span>

                <CardAnim />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Installation strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.75 }}
          style={{ padding: '1.8vh 0', textAlign: 'center', borderTop: '1px solid var(--line)', marginTop: '1.5vh' }}
        >
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.95vw',
            color: 'var(--ink-3)',
            letterSpacing: '0.04vw',
          }}>
            설치 위치: 문틀 우측 벽면 · 높이 100~120cm (어깨 높이) · 전원: 디지털 도어락 5V 하이재킹
          </span>
        </motion.div>
      </div>
    </SlideLayout>
  )
}
