// Design Ref: §4.6 — S06 Team R&R (white theme, 5 horizontal member cards)
import { motion } from 'framer-motion'
import SlideLayout from '../SlideLayout'

const MEMBERS = [
  {
    name: '김준표',
    role: 'FE / PPT',
    color: '#2563eb',
    tasks: ['HTML/CSS/JS', 'supabase-js', 'S3 + CloudFront 배포', 'PPT 디자인'],
  },
  {
    name: '박준영',
    role: 'Kakao Chatbot',
    color: '#f97316',
    tasks: ['카카오톡 오픈빌더', '챗봇 시나리오', 'Lambda 연동', 'ChatBot API'],
  },
  {
    name: '이동주',
    role: 'BE / Bot',
    color: '#8B5CF6',
    tasks: ['FastAPI (Render)', '비즈니스 로직 CRUD', '가족관리 API', '대시보드'],
  },
  {
    name: '임재영',
    role: 'Frontend',
    color: '#ec4899',
    tasks: ['HTML/CSS/JS', 'supabase-js', 'S3 + CloudFront 배포', 'Realtime UI'],
  },
  {
    name: '황찬영',
    role: 'BE / Infra / IoT',
    color: '#00a86b',
    tasks: ['Supabase DB 설계', 'Lambda 4개', 'Terraform IaC', 'GitHub CI/CD', 'RPi RFID 코드', '발표자료 작성'],
    highlight: true,
  },
]

const cardVariant = {
  hidden: { x: -24, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, delay: 0.1 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function S06TeamRR({ slideNum, total }) {
  return (
    <SlideLayout theme="white" slideNum={slideNum} total={total}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '7vh 5vw 2vh 5vw', gap: '1.5vh' }}>

        {/* Header */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: 'flex', alignItems: 'baseline', gap: '1.5vw', flexShrink: 0 }}
        >
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1vw', color: 'var(--accent)', letterSpacing: '0.2vw', textTransform: 'uppercase', fontWeight: 700 }}>
            팀 구성
          </span>
          <h1 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '3.2vw', fontWeight: 900, color: 'var(--ink-1)', lineHeight: 1, margin: 0 }}>
            구성원 R&R
          </h1>
        </motion.div>

        {/* 5 member cards */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
          {MEMBERS.map((m, i) => (
            <motion.div
              key={m.name}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'stretch',
                border: `1px solid ${m.highlight ? m.color + '60' : 'var(--line)'}`,
                borderLeft: `5px solid ${m.color}`,
                borderRadius: '0.6vw',
                background: m.highlight ? `${m.color}08` : '#fff',
                overflow: 'hidden',
              }}
            >
              {/* Role badge column */}
              <div style={{
                width: '14vw',
                padding: '0 1.5vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid var(--line)',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.9vw',
                  fontWeight: 700,
                  color: m.color,
                  border: `1px solid ${m.color}60`,
                  background: `${m.color}12`,
                  padding: '0.3vh 0.8vw',
                  borderRadius: '0.25vw',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.05vw',
                }}>
                  {m.role}
                </span>
              </div>

              {/* Name column */}
              <div style={{
                width: '11vw',
                padding: '0 1.5vw',
                display: 'flex',
                alignItems: 'center',
                borderRight: '1px solid var(--line)',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '1.8vw',
                  fontWeight: m.highlight ? 800 : 600,
                  color: m.highlight ? m.color : 'var(--ink-1)',
                  lineHeight: 1,
                }}>
                  {m.name}
                </span>
              </div>

              {/* Tasks column */}
              <div style={{
                flex: 1,
                padding: '0 1.5vw',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.4vh 0.5vw',
              }}>
                {m.tasks.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.85vw',
                      color: m.highlight ? m.color : 'var(--ink-2)',
                      background: `${m.color}12`,
                      border: `1px solid ${m.color}30`,
                      padding: '0.2vh 0.7vw',
                      borderRadius: '0.2vw',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
