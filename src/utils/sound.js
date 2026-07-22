// ============================================================
// 사운드 유틸 (Web Audio API로 효과음을 직접 생성)
// 외부 음원 파일 없이 동작한다. 기본값은 무음.
// 사용자가 사운드를 켰을 때만 소리를 낸다.
// ============================================================

let audioCtx = null

// 지연 초기화: 사용자 제스처(클릭/터치) 이후에만 AudioContext 생성
function getCtx() {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  if (!audioCtx) {
    try {
      audioCtx = new Ctx()
    } catch (e) {
      return null
    }
  }
  // 모바일에서 일시정지 상태면 재개
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

// 단일 톤 재생 헬퍼
function tone({ freq = 440, duration = 0.1, type = 'sine', gain = 0.05, delay = 0 }) {
  const ctx = getCtx()
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    const start = ctx.currentTime + delay
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(gain, start + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(g).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + duration + 0.02)
  } catch (e) {
    // 오디오 실패는 무시 (사이트 동작에 영향 없음)
  }
}

// 스캔 진행 비프음 (짧고 높은 톤)
export function playBeep() {
  tone({ freq: 1200, duration: 0.06, type: 'square', gain: 0.03 })
}

// 분석 완료음 (상승하는 두 음)
export function playComplete() {
  tone({ freq: 660, duration: 0.12, type: 'sine', gain: 0.05, delay: 0 })
  tone({ freq: 990, duration: 0.18, type: 'sine', gain: 0.05, delay: 0.12 })
}

// 경고 결과음 (낮게 두 번)
export function playAlert() {
  tone({ freq: 220, duration: 0.18, type: 'sawtooth', gain: 0.05, delay: 0 })
  tone({ freq: 180, duration: 0.22, type: 'sawtooth', gain: 0.05, delay: 0.2 })
}

// 안정(정상) 결과음
export function playSafe() {
  tone({ freq: 523, duration: 0.14, type: 'sine', gain: 0.05, delay: 0 })
  tone({ freq: 784, duration: 0.2, type: 'sine', gain: 0.05, delay: 0.14 })
}

// AudioContext 워밍업(사운드 토글 On 시 사용자 제스처로 호출)
export function warmUpAudio() {
  getCtx()
}
