import { SoundOnIcon, SoundOffIcon, HomeIcon } from './Icons.jsx'

// 화면 상단 바: 브랜드 표시 + (처음으로 / 사운드 토글) 버튼
// showHome, showSound 로 각 화면에서 필요한 것만 노출.
export default function TopBar({
  soundOn,
  onToggleSound,
  onHome,
  showHome = true,
  showSound = true,
}) {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="dot" />
        거짓말 탐지기
      </div>

      <div className="topbar-actions">
        {showSound && onToggleSound && (
          <button
            className="icon-btn"
            onClick={onToggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? '사운드 끄기' : '사운드 켜기'}
            title={soundOn ? '사운드 끄기' : '사운드 켜기'}
          >
            {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
        )}
        {showHome && onHome && (
          <button className="icon-btn" onClick={onHome} aria-label="처음으로" title="처음으로">
            <HomeIcon />
          </button>
        )}
      </div>
    </div>
  )
}
