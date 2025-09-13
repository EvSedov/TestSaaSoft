import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";

import "./style.css";
import "primeicons/primeicons.css";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);

app.mount("#app");
