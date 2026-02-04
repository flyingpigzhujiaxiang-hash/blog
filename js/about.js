async function loadAbout() {
  const aboutView = document.getElementById("aboutView");
  if (!aboutView) return;
  const key = "about_md_v1";
  let md = sessionStorage.getItem(key);
  if (!md) {
    const res = await fetch("about.md");
    md = await res.text();
    sessionStorage.setItem(key, md);
  }
  const html = marked.parse(md);
  aboutView.innerHTML = html;
}

loadAbout();
