// 지문 패턴 SVG — 중앙 정렬된 대칭 아치(끊김/깨짐 없음)
export default function FingerprintGraphic({ size = 120, color = 'var(--scan)', opacity = 0.9 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity, display: 'block' }}
      aria-hidden="true"
    >
      {/* 바깥에서 안쪽으로 겹겹이 쌓인 대칭 지문 능선 */}
      <path d="M16 72 C16 6 84 6 84 72" />
      <path d="M24 72 C24 18 76 18 76 72" />
      <path d="M32 72 C32 30 68 30 68 72" />
      <path d="M40 72 C40 42 60 42 60 72" />
      <path d="M44 72 C44 54 56 54 56 72" />
      {/* 중심 코어 */}
      <circle cx="50" cy="64" r="2.4" fill={color} stroke="none" />
    </svg>
  )
}
