import { createApp } from 'vue'
import { createPinia} from "pinia";
import Overview from './components/Overview.vue'
import '../css/main.css'

createApp(Overview)
    .use( createPinia() )
    .mount('body')
