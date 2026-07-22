import { useCallback, useEffect, useRef, useState } from 'react'
import FingerprintGraphic from './common/FingerprintGraphic.jsx'
import EcgLine from './common/EcgLine.jsx'
import { HomeIcon } from './common/Icons.jsx'
import { playBeep, playComplete } from '../utils/sound.js'

// 손가락을 누르고 있어야 하는 총 시간(ms)
const SCAN_DURATION = 2500
// 완료 후 화면을 어둡게 하는 시간(ms)
const DARK_DURATION = 500

// 지정된 질문만 원하는 위치에서 2줄로 강제 줄바꿈(그 외는 한 줄)
const FORCED_TWO_LINE = {
  '괜찮은 척하고 있지만 사실 서운한가요?': ['괜찮은 척하고 있지만', '사실 서운한가요?'],
  '아무렇지 않은 척하고 있지만 조금 긴장했나요?': ['아무렇지 않은 척하고 있지만', '조금 긴장했나요?'],
}

// 진행률 구간별 안내 문구
function phaseText(p) {
  if (p >= 100) return '분석 완료'
  if (p >= 76) return '답변 신뢰도 계산 중...'
  if (p >= 51) return '심박 반응 추적 중...'
  if (p >= 26) return '체온 변화 분석 중...'
  return '지문 패턴 확인 중...'
}

// 진동 (미지원 기기에서는 조용히 무시)
function vibrate(pattern) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern)
  } catch (e) {
    /* no-op */
  }
}

// 3. 손가락 스캔 화면
export default function ScanScreen({ question, soundOn, onComplete, onHome }) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const [bpm, setBpm] = useState(72)
  const [completing, setCompleting] = useState(false) // 완료 후 암전 연출

  // 애니메이션/타이밍용 ref (리렌더 유발 없이 유지)
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const heldRef = useRef(0) // 누적 누른 시간(ms)
  const doneRef = useRef(false) // 완료 중복 방지
  const lastBeepRef = useRef(0)
  const holdingRef = useRef(false)

  // 완료 처리
  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    holdingRef.current = false
    setHolding(false)
    setProgress(100)
    if (soundOn) playComplete()
    vibrate([30, 40, 90])
    setCompleting(true)
    // 0.5초 암전 후 결과 공개
    window.setTimeout(() => onComplete(), DARK_DURATION)
  }, [onComplete, soundOn])

  // rAF 루프: 누르고 있는 동안 진행률 증가
  const tick = useCallback(
    (ts) => {
      if (!holdingRef.current || doneRef.current) return
      if (!lastTsRef.current) lastTsRef.current = ts
      const delta = ts - lastTsRef.current
      lastTsRef.current = ts
      heldRef.current += delta

      const p = Math.min(100, (heldRef.current / SCAN_DURATION) * 100)
      setProgress(p)

      // 심박수: 진행될수록 상승 + 소폭 요동
      const jitter = Math.round((Math.random() - 0.5) * 4)
      setBpm(Math.max(60, Math.round(72 + p * 0.42 + jitter)))

      // 진행 비프음(약 12%마다)
      if (soundOn && p - lastBeepRef.current >= 12) {
        lastBeepRef.current = p
        playBeep()
      }

      if (p >= 100) {
        finish()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    },
    [finish, soundOn]
  )

  // 누르기 시작
  const startHold = useCallback(
    (e) => {
      if (doneRef.current) return
      // 기본 동작(스크롤/컨텍스트 메뉴/드래그) 방지
      if (e && e.cancelable) e.preventDefault()
      if (holdingRef.current) return
      // 포인터 캡처: 손가락이 살짝 미끄러져도 스캔이 끊기지 않게
      try {
        if (e && e.currentTarget && e.pointerId != null) {
          e.currentTarget.setPointerCapture(e.pointerId)
        }
      } catch (err) {
        /* no-op */
      }
      holdingRef.current = true
      setHolding(true)
      lastTsRef.current = 0
      lastBeepRef.current = progress
      vibrate(15)
      rafRef.current = requestAnimationFrame(tick)
    },
    [tick, progress]
  )

  // 떼기 → 초기화(누른 시간 리셋)
  const endHold = useCallback(() => {
    if (doneRef.current || !holdingRef.current) return
    holdingRef.current = false
    setHolding(false)
    cancelAnimationFrame(rafRef.current)
    lastTsRef.current = 0
    heldRef.current = 0
    lastBeepRef.current = 0
    setProgress(0)
    setBpm(72)
  }, [])

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      vibrate(0)
    }
  }, [])

  const near = progress >= 92 && progress < 100 // 완료 직전 깜빡임 트리거

  return (
    <div className="screen scan-screen">
      {/* 몰입 모드: 상단은 최소한(처음으로만) */}
      <div className="scan-top">
        <button className="icon-btn" onClick={onHome} aria-label="처음으로" title="처음으로">
          <HomeIcon />
        </button>
      </div>

      {/* 질문 (헤드라인만 남김) — 지정 질문만 2줄, 그 외 한 줄 */}
      <div className="scan-question">
        <span className="quote-mark" aria-hidden="true">“</span>
        {FORCED_TWO_LINE[question] ? (
          <>
            {FORCED_TWO_LINE[question][0]}
            <br />
            {FORCED_TWO_LINE[question][1]}
          </>
        ) : (
          question
        )}
        <span className="quote-mark" aria-hidden="true">”</span>
      </div>

      {/* 기기(네이비 패널): 상태 박스(위) → 메탈 센서(아래) */}
      <div className="device scan-device">
        <div className="device-lights">
          <span className={`led led-red ${holding ? 'on' : ''}`} />
          <span className={`led led-green ${holding ? 'on' : ''}`} />
        </div>

        {/* 상태 박스 — 센서보다 위에 배치 */}
        <div className="device-display scan-display">
          <div className="status-row">
            <span className="status-label">{phaseText(progress)}</span>
            <span className={`bpm mono ${near ? 'blink' : ''}`}>{bpm} BPM</span>
          </div>
          <EcgLine active={holding} bpm={bpm} />
          <div className="progress-line">
            <div className="status-bar-track">
              <div className="status-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-num mono">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* 손가락 센서 — 하단 중앙 */}
        <div className="sensor-zone">
          <div
            className={`sensor ${holding ? 'scanning' : ''} ${near ? 'near' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="지문 센서. 길게 누르면 분석이 진행됩니다."
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            onPointerCancel={endHold}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{ touchAction: 'none' }}
          >
            {/* 바깥 테두리 점멸 */}
            <span className="sensor-blink" />
            <div className="sensor-metal">
              <div className="sensor-inner">
                <FingerprintGraphic size={132} color="var(--scan)" opacity={holding ? 1 : 0.85} />
                {holding && <span className="scan-line" />}
              </div>
            </div>
          </div>

          <div className="sensor-hint">
            {holding ? (
              <span className="hint-main">손가락을 계속 올려두세요</span>
            ) : progress > 0 ? (
              <span className="hint-main">떼면 다시 시작됩니다</span>
            ) : (
              <>
                <span className="hint-main">👆 여기를 길게 누르세요</span>
                <span className="hint-sub">센서를 2~3초 눌러주세요</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 완료 암전 오버레이 */}
      {completing && <div className="dark-overlay" aria-hidden="true" />}
    </div>
  )
}
