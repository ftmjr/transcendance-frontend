import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from '@/vuetify/config'
import layoutsPlugin from '@/vuetify/layouts'
import App from './App.vue'
import router from './router'
import '@core/scss/template/index.scss'
import './assets/main.scss' // tailwindcss styles
const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.mount('#app')
