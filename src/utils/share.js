// ============================================================
// 공유 / 복사 기능
// Web Share API 지원 시 공유 창을, 아니면 클립보드 복사로 대체.
// ============================================================

/**
 * 공유용 문구를 생성한다. 마지막 줄에 현재 사이트 URL을 포함.
 * @param {string} question 질문 텍스트
 * @param {object} result   generateResult() 결과 객체
 * @returns {string}
 */
export function buildShareText(question, result) {
  // 심박 반응 등 첫 번째 분석 수치를 요약 문구로 사용
  const stat = (result.stats && result.stats[0]) || null
  const summary = stat ? `${stat.label}: ${stat.value}` : (result.desc || '')
  const url = typeof window !== 'undefined' ? window.location.href : ''
  return [
    '사이버 거짓말 탐지기 결과',
    `질문: ${question}`,
    `결과: ${result.title}`,
    summary,
    '',
    url,
  ].join('\n')
}

/**
 * 결과를 공유한다.
 * @returns {Promise<'shared'|'copied'|'failed'>}
 *   shared → 네이티브 공유창 사용
 *   copied → 클립보드 복사 성공
 *   failed → 둘 다 실패(사용자 취소 포함 시 'shared' 아님 처리)
 */
export async function shareResult(question, result) {
  const text = buildShareText(question, result)

  // 1) Web Share API (주로 모바일)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: '사이버 거짓말 탐지기', text })
      return 'shared'
    } catch (err) {
      // 사용자가 공유창을 닫은 경우(AbortError)는 실패로 취급하지 않음
      if (err && err.name === 'AbortError') return 'shared'
      // 그 외 오류는 복사로 폴백
    }
  }

  // 2) 클립보드 복사 폴백
  return (await copyToClipboard(text)) ? 'copied' : 'failed'
}

/**
 * 클립보드에 텍스트를 복사한다. 구형 브라우저 폴백 포함.
 * @returns {Promise<boolean>} 성공 여부
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (err) {
    // 아래 execCommand 폴백으로 진행
  }

  // 레거시 폴백 (execCommand)
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.top = '-9999px'
    ta.setAttribute('readonly', '')
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch (err) {
    return false
  }
}
