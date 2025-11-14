import "./styles/style.css";
import "./script/components/index.js";

import home from "./script/view/home.js";
import { animate } from "animejs";
window.anime = animate;

document.addEventListener("DOMContentLoaded", () => {
  home();
});
