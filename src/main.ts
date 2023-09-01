import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from '@/utils/vuetify'
import App from './App.vue'
import router from './router'

import './assets/main.scss'

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.mount('#app')
