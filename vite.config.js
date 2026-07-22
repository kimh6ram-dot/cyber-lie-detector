import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base: GitHub Pages 저장소 하위 경로(https://<user>.github.io/cyber-lie-detector/)
// 에 맞춰 설정한다.
//
// viteSingleFile: JS/CSS를 index.html 하나에 전부 인라인한다.
export default defineConfig({
  base: '/cyber-lie-detector/',
  plugins: [react(), viteSingleFile()],
})
