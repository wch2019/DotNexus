import {createApp} from 'vue'
import '@/style/style.css'
import '@/style/tailwind.css';
import App from './App.vue'

// 引入 Naive UI
import NaiveUi from 'naive-ui'

const app = createApp(App)

// 全局使用 naive-ui（自动注册所有组件）
app.use(NaiveUi)

app.mount('#app').$nextTick(() => {
    // Use contextBridge
    window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message)
    })
})