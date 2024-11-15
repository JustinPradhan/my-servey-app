/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REACT_APP_MAIN_API_URL: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }