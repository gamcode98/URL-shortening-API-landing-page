import hamburgerMenu from "./hamburger_menu.js";
import shortUrl from "./shrtcodeAPI.js";

const d = document;
d.addEventListener("DOMContentLoaded", (e) => {
  hamburgerMenu();
  shortUrl();
});
