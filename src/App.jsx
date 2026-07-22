import { useCallback, useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import ScanScreen from './components/ScanScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import { generateResult } from './utils/resultGenerator.js'
import { warmUpAudio } from './utils/sound.js'

// 화면 상태 상수
const SCREENS = { START: 'start', QUESTION: 'question', SCAN: 'scan', RESULT: 'result' }

export default function App() {
  const [screen, setScreen] = useState(SCREENS.START)
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [soundOn, setSoundOn] = useState(false)
  // 현재 세션 동안의 최근 질문(최대 3개). 서버 저장 없음.
  const [recent, setRecent] = useState([])

  // 사운드 토글 (켤 때 사용자 제스처로 오디오 워밍업)
  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev
      if (next) warmUpAudio()
      return next
    })
  }, [])

  // 최근 질문 목록 업데이트(중복 제거 후 맨 앞에, 최대 3개)
  const pushRecent = useCallback((q) => {
    setRecent((prev) => [q, ...prev.filter((x) => x !== q)].slice(0, 3))
  }, [])

  // 질문 확정 → 스캔 화면
  const startScan = useCallback(
    (q) => {
      setQuestion(q)
      pushRecent(q)
      setScreen(SCREENS.SCAN)
    },
    [pushRecent]
  )

  // 스캔 완료 → 랜덤 결과 생성 후 결과 화면
  const finishScan = useCallback(() => {
    setResult(generateResult())
    setScreen(SCREENS.RESULT)
  }, [])

  // 같은 질문으로 다시 탐지
  const retrySame = useCallback(() => {
    setResult(null)
    setScreen(SCREENS.SCAN)
  }, [])

  // 다른 질문 선택
  const chooseAnother = useCallback(() => {
    setResult(null)
    setScreen(SCREENS.QUESTION)
  }, [])

  // 처음으로
  const goHome = useCallback(() => {
    setResult(null)
    setScreen(SCREENS.START)
  }, [])

  const soundProps = { soundOn, onToggleSound: toggleSound }

  return (
    <div className="app">
      {screen === SCREENS.START && (
        <StartScreen onStart={() => setScreen(SCREENS.QUESTION)} {...soundProps} />
      )}

      {screen === SCREENS.QUESTION && (
        <QuestionScreen
          recent={recent}
          onConfirm={startScan}
          onHome={goHome}
          {...soundProps}
        />
      )}

      {screen === SCREENS.SCAN && (
        <ScanScreen
          question={question}
          soundOn={soundOn}
          onComplete={finishScan}
          onHome={goHome}
        />
      )}

      {screen === SCREENS.RESULT && result && (
        <ResultScreen
          question={question}
          result={result}
          soundOn={soundOn}
          onRetrySame={retrySame}
          onChooseAnother={chooseAnother}
          onHome={goHome}
          {...soundProps}
        />
      )}
    </div>
  )
}
