// declare interface Window {
//   webkitSpeechRecognition: any
//   SpeechRecognition: any
// }


// global.d.ts

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: ((event: any) => void) | null
  onresult: ((event: any) => void) | null
  start(): void
  stop(): void
}

interface Window {
  SpeechRecognition: {
    new (): SpeechRecognition
  }
  webkitSpeechRecognition: {
    new (): SpeechRecognition
  }
}
