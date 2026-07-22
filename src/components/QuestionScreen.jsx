import { useState } from 'react'
import TopBar from './common/TopBar.jsx'
import { featuredQuestions, MAX_QUESTION_LENGTH } from '../data/questions.js'
import { getRandomQuestion } from '../utils/randomQuestion.js'

// 2. 질문 선택 화면
//    - 메인 선택 질문 6개는 항상 노출
//    - '질문 뽑기'로 뽑은 랜덤 질문은 상단에 한 개만 표시(카테고리/전체 목록 미노출)
//    - 직접 입력 유지
export default function QuestionScreen({ recent, onConfirm, onHome, soundOn, onToggleSound }) {
  const [selected, setSelected] = useState('') // 목록에서 고른 질문
  const [custom, setCustom] = useState('') // 직접 입력값
  const [drawn, setDrawn] = useState('') // 랜덤으로 뽑은 질문(메인 6개에 없을 수 있음)

  // 직접 입력에 값이 있으면 그 값이 최종 선택
  const effectiveSelected = custom.trim() ? custom.trim() : selected
  const canConfirm = effectiveSelected.length > 0

  // 목록 질문 선택
  const selectQuestion = (q) => {
    setSelected(q)
    setCustom('')
  }

  const onCustomChange = (e) => {
    setCustom(e.target.value.slice(0, MAX_QUESTION_LENGTH))
    setSelected('')
  }

  // 랜덤 질문 뽑기 (이전에 뽑은 것과 연속 중복 방지)
  const pickRandom = () => {
    const q = getRandomQuestion(drawn || undefined)
    setDrawn(q)
    setSelected(q)
    setCustom('')
  }

  return (
    <div className="screen">
      <TopBar soundOn={soundOn} onToggleSound={onToggleSound} onHome={onHome} />

      <div className="q-header">
        <h1 className="title">탐지할 질문을 선택하세요</h1>
        <button className="chip-btn" onClick={pickRandom} type="button">
          🎲 질문 뽑기
        </button>
      </div>

      {/* 최근 사용 질문(있을 때만, 간결하게) */}
      {recent && recent.length > 0 && (
        <div className="recent-strip">
          <span className="recent-label">최근</span>
          <div className="recent-chips">
            {recent.map((q) => (
              <button
                key={`recent-${q}`}
                type="button"
                className={`recent-chip ${effectiveSelected === q ? 'active' : ''}`}
                onClick={() => selectQuestion(q)}
                title={q}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="scroll-area q-scroll">
        {/* 직접 질문 입력 (제일 위) */}
        <section className="q-section">
          <p className="q-list-label">직접 입력</p>
          <div className={`custom-input ${custom.trim() ? 'active' : ''}`}>
            <input
              type="text"
              inputMode="text"
              value={custom}
              onChange={onCustomChange}
              placeholder="예: 지금 좋아하는 사람 있죠?"
              maxLength={MAX_QUESTION_LENGTH}
              aria-label="직접 질문 입력"
            />
            <span className="char-count mono">
              {custom.length}/{MAX_QUESTION_LENGTH}
            </span>
          </div>
        </section>

        {/* 랜덤으로 뽑힌 질문(한 개만) */}
        {drawn && (
          <section className="q-section">
            <p className="q-list-label">🎲 뽑힌 질문</p>
            <button
              type="button"
              className={`q-card drawn ${effectiveSelected === drawn ? 'active' : ''}`}
              onClick={() => selectQuestion(drawn)}
              aria-pressed={effectiveSelected === drawn}
            >
              <span className="q-card-text">{drawn}</span>
              <span className="q-card-check" aria-hidden="true">
                {effectiveSelected === drawn ? '✓' : ''}
              </span>
            </button>
          </section>
        )}

        {/* 메인 선택 질문(항상 노출 6개) */}
        <section className="q-section">
          <p className="q-list-label">이런 질문은 어때요?</p>
          <div className="q-list">
            {featuredQuestions.map((q) => (
              <button
                key={q}
                type="button"
                className={`q-card ${effectiveSelected === q ? 'active' : ''}`}
                onClick={() => selectQuestion(q)}
                aria-pressed={effectiveSelected === q}
              >
                <span className="q-card-text">{q}</span>
                <span className="q-card-check" aria-hidden="true">
                  {effectiveSelected === q ? '✓' : ''}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="bottom-actions">
        {/* 선택된 질문 미리보기 */}
        {canConfirm && (
          <div className="selected-preview">
            <span className="selected-dot" />
            <span className="selected-text">{effectiveSelected}</span>
          </div>
        )}
        <button
          className="btn btn-primary"
          disabled={!canConfirm}
          onClick={() => canConfirm && onConfirm(effectiveSelected)}
        >
          이 질문으로 탐지하기
        </button>
      </div>
    </div>
  )
}
