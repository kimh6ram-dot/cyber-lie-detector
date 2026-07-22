// ============================================================
// 확률 기반 랜덤 결과 생성
// 결과 문구를 수정하려면 RESULTS 배열을 바꾸면 됩니다.
// 각 결과의 weight(가중치) 합이 곧 확률 분포가 됩니다.
// ============================================================

// tone: 결과 화면 분위기 연출용 키워드
//   danger  → 경고 + 화면 흔들림 (붉은색)
//   safe    → 안정 체크 (녹색)
//   error   → 노이즈/오류 표시
//   secret  → 잠금/기밀 느낌
//
// 각 결과 구성:
//   title  : 결과 제목
//   desc   : 짧은 결과 설명(한 줄)
//   bpm    : 최종 심박수(네이비 표시창에 크게 노출)
//   stats  : 카드 하단 2칸(라벨/값) — [심박 반응, 답변 신뢰도 등]
export const RESULTS = [
  {
    id: 'lie',
    tone: 'danger',
    title: '거짓말 감지됨',
    desc: '숨기고 있는 사실이 있는 것으로 분석되었습니다.',
    bpm: 118,
    stats: [
      { label: '심박 반응', value: '급상승' },
      { label: '답변 신뢰도', value: '18%' },
    ],
    weight: 35, // 35%
  },
  {
    id: 'suspect',
    tone: 'danger',
    title: '강한 의심 반응',
    desc: '질문 직후 긴장 반응이 감지되었습니다.',
    bpm: 112,
    stats: [
      { label: '심박 반응', value: '급상승' },
      { label: '답변 신뢰도', value: '36%' },
    ],
    weight: 25, // 25%
  },
  {
    id: 'secret',
    tone: 'secret',
    title: '비밀 보유 가능성',
    desc: '추가 질문이 필요한 상태로 보입니다.',
    bpm: 121,
    stats: [
      { label: '심박 반응', value: '급상승' },
      { label: '비밀 보유 확률', value: '94%' },
    ],
    weight: 20, // 20%
  },
  {
    id: 'truth',
    tone: 'safe',
    title: '진실 가능성 높음',
    desc: '현재 답변에서 거짓 반응이 발견되지 않았습니다.',
    bpm: 79,
    stats: [
      { label: '심박 반응', value: '안정' },
      { label: '답변 신뢰도', value: '89%' },
    ],
    weight: 15, // 15%
  },
  {
    id: 'unknown',
    tone: 'error',
    title: '판독 불가',
    desc: '무언가 크게 당황한 것으로 추정됩니다.',
    bpm: 143,
    stats: [
      { label: '심박 반응', value: '불안정' },
      { label: '답변 신뢰도', value: '측정 실패' },
    ],
    weight: 5, // 5%
  },
]

/**
 * 가중치 기반으로 결과를 무작위 선택한다.
 * 사용자의 터치 시간·이름·질문 내용과 무관하게 매번 새로 뽑는다.
 * @returns {object} RESULTS 중 하나 (얕은 복사본)
 */
export function generateResult() {
  const totalWeight = RESULTS.reduce((sum, r) => sum + r.weight, 0)
  let roll = Math.random() * totalWeight
  for (const result of RESULTS) {
    roll -= result.weight
    if (roll < 0) return { ...result }
  }
  // 부동소수 오차 대비 fallback
  return { ...RESULTS[0] }
}
