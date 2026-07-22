// ============================================================
// 랜덤 질문 유틸
// randomQuestionCategories(100개 풀)에서 한 개를 무작위로 뽑는다.
// "질문 뽑기" 버튼에서만 사용한다. (메인 6개와는 별개)
// ============================================================

import { randomQuestionCategories } from '../data/questions.js'

// 카테고리 구분 없이 전체 질문을 평탄화(총 100개)
export const RANDOM_QUESTIONS = randomQuestionCategories.flatMap((c) => c.questions)

/**
 * 랜덤 질문 하나를 반환한다.
 * @param {string} [exclude] 이 질문과 다른 것을 뽑고 싶을 때 전달(연속 중복 방지)
 * @returns {string}
 */
export function getRandomQuestion(exclude) {
  const pool =
    exclude && RANDOM_QUESTIONS.length > 1
      ? RANDOM_QUESTIONS.filter((q) => q !== exclude)
      : RANDOM_QUESTIONS
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
