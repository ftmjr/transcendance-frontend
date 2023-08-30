import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

import './assets/main.scss'
const myCustomLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        primary: '#6200EE',
        'primary-darken-1': '#3700B3',
        secondary: '#03DAC6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    },
}
const vuetify = createVuetify({
    components,
    directives,
    theme: 'myCustomLightTheme',
    themes: {
        myCustomLightTheme,
    },
})
const app = createApp(App)
const pinia = createPinia();

pinia.use(({ store }) => {
    store.$router = markRaw(router)
});
app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
