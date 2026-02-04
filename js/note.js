function getQueryId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadNote() {
  const noteView = document.getElementById("noteView");
  if (!noteView) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const path = params.get("path");
  const title = params.get("title");
  if (!id && !path && !title) {
    noteView.innerHTML = '<div class="empty">缺少文章参数。</div>';
    return;
  }

  const indexKey = "posts_index_v1";
  const cachedIndex = sessionStorage.getItem(indexKey);
  let data;
  if (cachedIndex) {
    data = JSON.parse(cachedIndex);
  } else {
    const res = await fetch("posts/index.json");
    data = await res.json();
    sessionStorage.setItem(indexKey, JSON.stringify(data));
  }
  const post = (data.posts || []).find(p => {
    if (id && p.id) return p.id === id;
    if (path && p.path) return p.path === path;
    if (title && p.title) return p.title === title;
    return false;
  });

  if (!post) {
    noteView.innerHTML = '<div class="empty">未找到这篇文章。</div>';
    return;
  }

  const mdKey = `post_md_${id || path || title}`;
  let md = sessionStorage.getItem(mdKey);
  if (!md) {
    const mdRes = await fetch(post.path);
    md = await mdRes.text();
    sessionStorage.setItem(mdKey, md);
  }
  const html = marked.parse(md);

  noteView.innerHTML = `
    <div class="note-title">${post.title || ""}</div>
    <div class="note-meta">${post.date} · ${(post.categories || []).join(" · ")}</div>
    ${html}
  `;
}

loadNote();
