// 심전도(ECG) 파형 — 스캔 중 좌측으로 흐르는 애니메이션.
// active 일 때만 흐르고, bpm 이 높을수록 빠르게 흐른다.
export default function EcgLine({ active, bpm = 72 }) {
  // 한 주기 패턴(w=120)을 두 번 이어 붙여 끊김 없이 흐르게 함
  const seg = 'l6 0 3 -3 3 12 4 -22 4 30 3 -17 4 0'
  const start = 'M0 20 h12 '
  const path = `${start}${seg} ${seg} ${seg} ${seg} ${seg} ${seg} ${seg} ${seg} ${seg} ${seg} h20`

  // bpm 60→약 1.6s, 120→약 0.8s
  const dur = Math.max(0.6, 1.9 - bpm / 100).toFixed(2)

  return (
    <div className="ecg" aria-hidden="true">
      <svg viewBox="0 0 240 40" preserveAspectRatio="none" width="100%" height="40">
        <g
          className="ecg-path"
          style={{ animationDuration: `${dur}s`, animationPlayState: active ? 'running' : 'paused' }}
        >
          <path d={path} fill="none" stroke="var(--scan)" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
          <path d={path} transform="translate(240 0)" fill="none" stroke="var(--scan)" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}
