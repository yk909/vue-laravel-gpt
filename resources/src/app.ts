import "@/app.css";
import router from "@/router";
import head from "@/utils/head";
import { setTheme } from "@/utils/helpers";
import { createApp } from "vue";
import { RouterView } from "vue-router";
import swal from "vue-sweetalert2";

const el = document.getElementById("app")!;

setTheme(localStorage.getItem("theme"));

createApp(RouterView, { ...el.dataset })
    .use(router)
    .use(head)
    .use(swal)
    .mount(el);
