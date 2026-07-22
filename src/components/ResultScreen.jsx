import { useEffect, useRef, useState } from 'react'
import TopBar from './common/TopBar.jsx'
import EcgLine from './common/EcgLine.jsx'
import { shareResult } from '../utils/share.js'
import { playAlert, playSafe } from '../utils/sound.js'

// tone별 아이콘/라벨
const TONE_META = {
  danger: { icon: '⚠', badge: '경고', cls: 'tone-danger' },
  safe: { icon: '✓', badge: '정상', cls: 'tone-safe' },
  error: { icon: '!', badge: '오류', cls: 'tone-error' },
  secret: { icon: '🔒', badge: '기밀', cls: 'tone-secret' },
}

// 4. 결과 화면
export default function ResultScreen({
  question,
  result,
  soundOn,
  onRetrySame,
  onChooseAnother,
  onHome,
  onToggleSound,
}) {
  const meta = TONE_META[result.tone] || TONE_META.danger
  const [shakeCls, setShakeCls] = useState('')
  const [shareMsg, setShareMsg] = useState('')
  const msgTimer = useRef(0)

  // 등장 연출: 경고/의심 결과 짧은 흔들림 + 사운드
  useEffect(() => {
    if (result.tone === 'danger') setShakeCls('shake')

    if (soundOn) {
      if (result.tone === 'safe') playSafe()
      else playAlert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 공유하기
  const handleShare = async () => {
    const outcome = await shareResult(question, result)
    if (outcome === 'copied') showMsg('결과 문구가 복사되었습니다')
    else if (outcome === 'failed') showMsg('공유에 실패했습니다. 다시 시도해 주세요')
    // 'shared' 는 네이티브 공유창이므로 별도 안내 없음
  }

  const showMsg = (text) => {
    setShareMsg(text)
    window.clearTimeout(msgTimer.current)
    msgTimer.current = window.setTimeout(() => setShareMsg(''), 2200)
  }

  useEffect(() => () => window.clearTimeout(msgTimer.current), [])

  return (
    <div className={`screen result-screen ${meta.cls}`}>
      {/* 결과 등장 시 1회 짧은 화면 깜빡임 */}
      <div className="result-flash" aria-hidden="true" />

      <TopBar soundOn={soundOn} onToggleSound={onToggleSound} onHome={onHome} />

      <div className={`result-body ${shakeCls}`}>
        <div className="result-content">
          {/* 측정 질문 카드 */}
          <div className="rq-card">
            <span className="rq-label">측정 질문</span>
            <p className="rq-text">“{question}”</p>
          </div>

          {/* 결과 카드 */}
          <div className="result-card">
            <div className="result-badge">
              {meta.icon} {meta.badge}
            </div>
            <h1 className="result-title">{result.title}</h1>
            <p className="result-desc">{result.desc}</p>

            {/* 네이비 분석 표시창: 최종 심박수 + 파형 */}
            <div className="result-monitor">
              <span className="rm-label mono">FINAL HEART RATE</span>
              <div className="rm-value">
                <span className="rm-bpm mono">{result.bpm}</span>
                <span className="rm-unit mono">BPM</span>
              </div>
              <EcgLine active bpm={result.bpm} />
            </div>

            {/* 분석 수치 2칸 */}
            <div className="result-stats">
              {result.stats.map((s, i) => (
                <div className="stat" key={i}>
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 버튼 (카드 바로 아래) */}
          <div className="result-actions">
            {shareMsg && <div className="toast">{shareMsg}</div>}
            <button className="btn btn-share" onClick={handleShare}>
              결과 공유하기
            </button>
            <div className="row-2">
              <button className="btn btn-ghost btn-sm" onClick={onRetrySame}>
                같은 질문 다시
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onChooseAnother}>
                다른 질문 선택
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
