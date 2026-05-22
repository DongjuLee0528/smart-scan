// Design Ref: §4.1 — S01 Cover (black theme, full-screen hero)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const titleContainer = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
}

const titleLine = {
  hidden:  { y: 50, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const fadeUp = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function S01Cover({ slideNum, total }) {
  return (
    <SlideLayout theme="black" slideNum={slideNum} total={total}>
      {/* Top-right badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          position: 'absolute',
          top: '4vh',
          right: '5vw',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1vw',
          color: 'var(--hi)',
          border: '1px solid var(--hi)',
          padding: '0.4vh 1vw',
          letterSpacing: '0.12vw',
          zIndex: 20,
        }}
      >
        IoT 프로그래밍 — 14주차 최종 발표
      </motion.div>

      {/* Main content: vertically centered */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '0 5vw',
        }}
      >
        {/* Giant title */}
        <motion.div
          variants={titleContainer}
          initial="hidden"
          animate="visible"
          style={{ lineHeight: 0.9, marginBottom: '3vh' }}
        >
          <motion.div variants={titleLine}>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'min(11vw, 16vh)',
                color: '#ffffff',
                display: 'block',
              }}
            >
              Smart
            </span>
          </motion.div>
          <motion.div variants={titleLine}>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'min(11vw, 16vh)',
                color: 'var(--accent)',
                display: 'block',
              }}
            >
              Scan
            </span>
          </motion.div>
          <motion.div variants={titleLine}>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'min(11vw, 16vh)',
                color: '#ffffff',
                display: 'block',
              }}
            >
              Hub
            </span>
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          style={{
            fontSize: '1.8vw',
            color: 'rgba(255,255,255,0.7)',
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 400,
            marginBottom: '6vh',
            letterSpacing: '0.05vw',
          }}
        >
          Zero-Touch 지능형 현관 시스템
        </motion.p>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.18)',
            paddingTop: '2.5vh',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {/* Left tagline */}
          <p
            style={{
              fontSize: '1.4vw',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: "'Pretendard', sans-serif",
              fontWeight: 300,
              maxWidth: '50%',
              lineHeight: 1.5,
            }}
          >
            당신의 소지품, 현관에서 마지막으로 지켜줍니다
          </p>

          {/* Right info items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.5vh',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.85vw',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.1vw',
            }}
          >
            <span>TEAM: 5조</span>
            <span>황찬영 / DongjuLee0528</span>
            <span>2026 Spring</span>
          </div>
        </motion.div>
      </div>
    </SlideLayout>
  )
}
