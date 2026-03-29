
import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './style.css'


createApp(App)
  .use(router)
  .use(Toast)

  .mount('#app')
