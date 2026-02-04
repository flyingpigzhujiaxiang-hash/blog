const state = {
  posts: [],
  activeCategory: "全部",
  activePostId: null,
  query: "",
};

const els = {
  postList: document.getElementById("postList"),
  categoryChips: document.getElementById("categoryChips"),
  searchInput: document.getElementById("searchInput"),
};

function renderCategories() {
  const categories = new Set(["全部"]);
  state.posts.forEach(p => (p.categories || []).forEach(c => categories.add(c)));
  els.categoryChips.innerHTML = "";
  [...categories].forEach(cat => {
    const chip = document.createElement("button");
    chip.className = "chip" + (cat === state.activeCategory ? " active" : "");
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      state.activeCategory = cat;
      renderCategories();
      renderPostList();
    });
    els.categoryChips.appendChild(chip);
  });
}

function renderPostList() {
  const base = state.activeCategory === "全部"
    ? state.posts
    : state.posts.filter(p => (p.categories || []).includes(state.activeCategory));

  const q = state.query.trim().toLowerCase();
  const filtered = q
    ? base.filter(p => {
        const hay = [p.title, p.summary, (p.categories || []).join(" ")]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
    : base;

  els.postList.innerHTML = "";

  filtered.forEach(post => {
    const postKey = post.id || post.path || post.title;
    const item = document.createElement("div");
    item.className = "post-item" + (post.id === state.activePostId ? " active" : "");

    item.innerHTML = `
      <div class="post-title">${post.title}</div>
      <div class="post-meta">
        <span>${post.date}</span>
        <span>${(post.categories || []).join(" · ")}</span>
      </div>
      <div class="post-meta">${post.summary || ""}</div>
    `;

    item.addEventListener("click", () => {
      if (post.id) {
        window.location.href = `note.html?id=${encodeURIComponent(post.id)}`;
      } else if (post.path) {
        window.location.href = `note.html?path=${encodeURIComponent(post.path)}`;
      } else {
        window.location.href = `note.html?title=${encodeURIComponent(postKey)}`;
      }
    });
    els.postList.appendChild(item);
  });
}

async function init() {
  const cacheKey = "posts_index_v1";
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    state.posts = JSON.parse(cached).posts || [];
  } else {
    const res = await fetch("posts/index.json");
    const data = await res.json();
    state.posts = data.posts || [];
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  }

  renderCategories();
  renderPostList();

  if (els.searchInput) {
    els.searchInput.addEventListener("input", (e) => {
      state.query = e.target.value || "";
      renderPostList();
    });
  }
}

init();
