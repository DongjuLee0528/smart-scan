// Design Ref: §2.1 — Slide router + Framer Motion AnimatePresence + keyboard nav
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import S01Cover        from './slides/S01Cover'
import S02Problem      from './slides/S02Problem'
import S03Solution     from './slides/S03Solution'
import S04Architecture from './slides/S04Architecture'
import S05Hardware     from './slides/S05Hardware'
import S06TeamRR       from './slides/S06TeamRR'
import S07Results      from './slides/S07Results'
import S08Scenario     from './slides/S08Scenario'
import S09Demo         from './slides/S09Demo'
import S10Business     from './slides/S10Business'

const SLIDES = [
  S01Cover, S02Problem, S03Solution, S04Architecture, S05Hardware,
  S06TeamRR, S07Results, S08Scenario, S09Demo, S10Business,
]

// Plan SC: SC-3 — directional slide transition
const variants = {
  enter:  (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: {
    x: 0, opacity: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit:   (dir) => ({
    x: dir > 0 ? '-100%' : '100%', opacity: 0,
    transition: { duration: 0.32, ease: 'easeIn' },
  }),
}

export default function App() {
  const [current,   setCurrent]   = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback((idx) => {
    if (idx < 0 || idx >= SLIDES.length) return
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }, [current])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(current + 1) }
      if (e.key === 'ArrowLeft')                   { e.preventDefault(); go(current - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, go])

  const SlideComponent = SLIDES[current]

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0A0A0A', overflow: 'hidden' }}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: 'absolute', inset: 0 }}
        >
          <SlideComponent slideNum={current + 1} total={SLIDES.length} />
        </motion.div>
      </AnimatePresence>

      {/* Plan SC: SC-3 — navigation dots */}
      <nav className="nav-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`nav-dot${i === current ? ' active' : ''}`}
            onClick={() => go(i)}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </nav>
    </div>
  )
}
