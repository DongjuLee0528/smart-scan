// Design Ref: §2.2 — SlideLayout: common meta bar + footer wrapper
export default function SlideLayout({ theme = 'white', slideNum = 1, total = 10, children }) {
  const num = String(slideNum).padStart(2, '0')
  const tot = String(total).padStart(2, '0')
  const cls = theme === 'black' ? 'meta-dark' : 'meta-light'

  return (
    <div
      className={`theme-${theme}`}
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <div className="grid-bg" />

      <div className="meta">
        <span className={cls}>
          <strong>SmartScan Hub</strong> — 5조
        </span>
        <span className={cls}>{num} / {tot}</span>
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>

      <div className="foot">
        <span className={cls}>IoT 프로그래밍</span>
        <span className={cls}>2026 Spring</span>
      </div>
    </div>
  )
}
