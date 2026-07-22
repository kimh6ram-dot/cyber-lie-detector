import TopBar from './common/TopBar.jsx'
import LieDetectorGraphic from './common/LieDetectorGraphic.jsx'

// 1. 시작 화면 — 장난감 거짓말 탐지기 본체 삽화
export default function StartScreen({ onStart, soundOn, onToggleSound }) {
  return (
    <div className="screen start-screen">
      <TopBar soundOn={soundOn} onToggleSound={onToggleSound} showHome={false} />

      <div className="start-body">
        <div className="start-heading">
          <p className="eyebrow">LIE&nbsp;DETECTOR</p>
          <h1 className="title">사이버 거짓말 탐지기</h1>
          <p className="subtitle">손가락을 올리면 반응을 탐지합니다.</p>
        </div>

        {/* 중앙 대표 비주얼: 장난감 거짓말 탐지기 본체 */}
        <div className="detector-visual">
          <div className="detector-graphic">
            <LieDetectorGraphic />
          </div>
          <span className="dc-tag">손가락 반응 탐지 장치</span>
        </div>

        {/* 버튼도 중앙 콘텐츠 묶음의 일부로 (바닥 고정 아님) */}
        <button className="btn btn-primary start-btn" onClick={onStart}>
          탐지 시작하기
        </button>
      </div>
    </div>
  )
}
