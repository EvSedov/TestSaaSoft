import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
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

app.mount("#app");
