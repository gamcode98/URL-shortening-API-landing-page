export default function hamburgerMenu() {
  const d = document;
  const w = window;
  const $btn = d.getElementById("hamburger-btn");
  const $menu = d.querySelector(".header-right");
  $btn.addEventListener("click", () => {
    $menu.classList.toggle("isActive");
  });

  const listenerEvent = (listener) => {
    w.addEventListener(listener, () => {
      $menu.classList.remove("isActive");
    });
  };
  listenerEvent("scroll");
  listenerEvent("resize");
}
