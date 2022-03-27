export default function hamburgerMenu() {
  const d = document;
  const $btn = d.getElementById("hamburger-btn");
  const $menu = d.querySelector(".header-right");
  $btn.addEventListener("click", () => {
    $menu.classList.toggle("isActive");
  });
}
