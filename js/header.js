(function () {
  const target = document.getElementById("siteHeader");
  if (!target) return;

  fetch("header.html")
    .then(r => r.text())
    .then(html => {
      target.innerHTML = html;
      const page = document.body.dataset.page;
      if (!page) return;
      target.querySelectorAll("[data-nav]").forEach(a => {
        a.classList.toggle("active", a.dataset.nav === page);
      });
    });
})();
