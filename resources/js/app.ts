import { createApp } from 'vue'
import { createPinia} from "pinia";
import Overview from './components/Overview.vue'
import '../css/main.css'
import '../css/tailwind.css'

createApp(Overview)
    .use( createPinia() )
    .mount('body')
