import { createApp } from "vue";
import App from "./App.vue";

// Bootstrap CSS + JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// FontAwesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Router
import router from "./router";

const app = createApp(App);

app.use(router);

app.mount("#app");
