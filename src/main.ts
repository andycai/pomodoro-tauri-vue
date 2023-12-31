import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
import { createPinia } from "pinia";

const app = createApp(App)
app.use(createPinia()).use(mdiVue, {
    icons: mdijs
})

app.mount("#app")
