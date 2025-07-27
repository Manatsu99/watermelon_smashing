// src/main.ts (または src/index.ts)

import { createApp } from 'vue'; // VueのcreateApp関数をインポート
import App from './App.vue'; // App.vueをインポート

import './assets/main.css'; // 必要であればグローバルCSSをインポート

// Vueアプリケーションのインスタンスを作成
const app = createApp(App);

// アプリケーションをHTMLのDOM要素にマウント
// 通常はpublic/index.html (または似たファイル) にある <div id="app"></div> にマウントします
app.mount('#app');