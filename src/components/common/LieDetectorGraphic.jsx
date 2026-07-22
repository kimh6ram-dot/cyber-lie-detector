// 장난감 거짓말 탐지기 삽화 (설명서/장난감 패키지 그림 느낌)
// "손을 기계 위에 올리고 있는" 사용 장면. 글씨 없음.
// z축: 흰 본체 → 은색 패드(4개, 앞끝만 노출) → 손가락 → 손등 → 엄지
//      → 손가락 위를 덮는 빨간 밴드 → 청록 번개 → 앞면 표시
export default function LieDetectorGraphic() {
  const fingerXs = [104, 124, 144, 164] // 손가락/패드 공유 x축

  return (
    <svg
      viewBox="0 0 260 210"
      width="100%"
      height="100%"
      role="img"
      aria-label="손을 기계 위에 올리고 손가락을 빨간 밴드로 고정해 검사하는 장난감 거짓말 탐지기"
      style={{ display: 'block' }}
    >
      {/* 흰 플라스틱 본체 (낮고 넓은 돔) */}
      <path
        d="M40 178
           C34 132 70 84 130 84
           C190 84 226 132 220 178
           C222 190 214 194 202 194
           L58 194
           C46 194 38 190 40 178 Z"
        fill="#f6f3ea"
        stroke="#3f3f3f"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M72 108 C94 90 166 90 188 108" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.4" />

      {/* 은색 손가락 패드 4개 (손 아래, 앞끝만 노출) */}
      {fingerXs.map((x) => (
        <rect key={x} x={x - 11} y={118} width="22" height="54" rx="11" fill="#cccccc" stroke="#3f3f3f" strokeWidth="2.6" />
      ))}

      {/* 손가락 4개 (손등 아래에서 아래로 뻗어 패드에 닿음) */}
      {fingerXs.map((x) => (
        <rect key={x} x={x - 9} y={102} width="18" height="54" rx="9" fill="#f2c9a6" stroke="#c98f63" strokeWidth="2.5" />
      ))}

      {/* 손등 (단순한 덩어리) — 손가락 윗부분을 덮어 하나의 손처럼 */}
      <rect x="96" y="62" width="82" height="60" rx="22" fill="#f2c9a6" stroke="#c98f63" strokeWidth="2.5" />
      {/* 엄지 */}
      <rect
        x="168"
        y="90"
        width="18"
        height="42"
        rx="9"
        transform="rotate(40 177 111)"
        fill="#f2c9a6"
        stroke="#c98f63"
        strokeWidth="2.5"
      />

      {/* 손가락 위를 덮는 빨간 고정 밴드(손등 아래, 노출된 손가락을 가로지름) */}
      <path d="M84 150 C110 132 168 132 194 150" fill="none" stroke="#a81f1f" strokeWidth="26" strokeLinecap="round" />
      <path d="M84 150 C110 132 168 132 194 150" fill="none" stroke="#e94747" strokeWidth="20" strokeLinecap="round" />
      <path d="M90 148 C114 134 166 134 188 148" fill="none" stroke="#ff9d9d" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />

      {/* 청록 전류/번개 (최소 3개) */}
      <g fill="none" stroke="#22c7bd" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="52,120 43,108 54,106 44,90" />
        <polyline points="214,120 223,108 212,106 222,90" />
        <polyline points="198,58 192,48 202,46 195,34" />
      </g>

      {/* 앞면 작은 표시(글씨 없음) */}
      <ellipse cx="130" cy="183" rx="10" ry="7" fill="#2b2b2b" stroke="#3f3f3f" strokeWidth="2.5" />
    </svg>
  )
}
