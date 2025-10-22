document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".toggle-theme");
  const body = document.body;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") body.classList.add("dark");
  toggle.textContent = body.classList.contains("dark") ? "🌞" : "🌙";

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggle.textContent = isDark ? "🌞" : "🌙";
  });
});

