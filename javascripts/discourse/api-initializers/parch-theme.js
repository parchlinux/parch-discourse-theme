import { apiInitializer } from "discourse/lib/api";
import { i18n } from "discourse-i18n";

export default apiInitializer((api) => {
  // Translation helper that returns the fallback when the key is missing.
  // `themePrefix` only prepends `theme_translations.<id>.`, so keys must
  // include the `parch_theme.` namespace from locales/en.yml.
  const t = (key, fallback) => {
    const fullKey = themePrefix(key);
    const value = i18n(fullKey, { default: fallback });
    const isMissing =
      value === fullKey ||
      value === fallback ||
      (typeof value === "string" && value.includes(fullKey));
    return isMissing ? fallback : value;
  };

  const escapeHtml = (str) =>
    String(str).replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );

  const copyText = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  };

  // Glassmorphism (beta): the `.parch-glass` class drives the frosted
  // surfaces defined in common.scss
  if (settings.enable_glassmorphism) {
    document.documentElement.classList.add("parch-glass");
  }

  // SVG Icons
  const ICONS = {
    terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  };

  // 1. Inject Linux Terminal Code Block & Command Runner UI
  api.decorateCookedElement(
    (elem) => {
      if (!settings.enable_terminal_codeblocks) {
        return;
      }

      const preBlocks = elem.querySelectorAll("pre");
      preBlocks.forEach((pre) => {
        if (pre.parentElement.classList.contains("parch-terminal-wrap")) {
          return;
        }

        const codeEl = pre.querySelector("code");
        const codeText = (codeEl?.innerText || pre.innerText || "").trim();

        // Detect Root vs User command
        const isRoot = codeText.startsWith("sudo ") || codeText.startsWith("# ") || codeText.startsWith("su ");
        const promptSymbol = isRoot ? "#" : "$";
        const promptClass = isRoot ? "root" : "user";

        const wrapper = document.createElement("div");
        wrapper.className = "parch-terminal-wrap";

        const header = document.createElement("div");
        header.className = "parch-terminal-header";

        const controls = document.createElement("div");
        controls.className = "parch-terminal-controls";
        controls.innerHTML = `
          <span class="ctrl-dot red"></span>
          <span class="ctrl-dot yellow"></span>
          <span class="ctrl-dot green"></span>
        `;

        const terminalTitle = t("parch_theme.codeblock.terminal_title", "parch-terminal");
        const title = document.createElement("span");
        title.className = "parch-terminal-title";
        title.innerHTML = `
          ${ICONS.terminal}
          <span>${escapeHtml(terminalTitle)} ~ <span class="prompt-indicator ${promptClass}">${promptSymbol}</span></span>
        `;

        const copyLabel = t("parch_theme.codeblock.copy", "Copy");
        const copiedLabel = t("parch_theme.codeblock.copied", "Copied!");
        const failedLabel = t("parch_theme.codeblock.copy_failed", "Failed");

        const copyBtn = document.createElement("button");
        copyBtn.className = "parch-copy-btn";
        copyBtn.type = "button";
        copyBtn.innerHTML = `${ICONS.copy} <span>${copyLabel}</span>`;

        const restoreCopyLabel = () => {
          copyBtn.innerHTML = `${ICONS.copy} <span>${copyLabel}</span>`;
        };

        copyBtn.addEventListener("click", () => {
          copyText(codeText)
            .then(() => {
              copyBtn.innerHTML = `${ICONS.check} <span>${copiedLabel}</span>`;
              setTimeout(restoreCopyLabel, 2000);
            })
            .catch(() => {
              copyBtn.innerHTML = `${ICONS.check} <span>${failedLabel}</span>`;
              setTimeout(restoreCopyLabel, 2000);
            });
        });

        header.appendChild(controls);
        header.appendChild(title);
        header.appendChild(copyBtn);

        pre.after(wrapper);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
      });
    },
    { id: "parch-terminal-decorator" }
  );

  // 2. Category Showcase: fall back to a monogram tile when a category has
  // no logo, so every card gets a distinct visual identity.
  const applyCategoryMonograms = () => {
    document.querySelectorAll(".category-box").forEach((box) => {
      if (box.querySelector(".parch-cat-mono")) {
        return;
      }

      const logo = box.querySelector(":scope > .category-box-inner > .category-logo");
      const hasRealLogo =
        logo && (logo.querySelector("img") || logo.textContent.trim());

      if (hasRealLogo) {
        return;
      }

      const titleEl = box.querySelector("h3");
      const name = (titleEl?.textContent || "").trim();
      const letter = [...name].find((ch) => /\S/.test(ch)) || "?";
      const inner = box.querySelector(":scope > .category-box-inner") || box;

      const mono = document.createElement("span");
      mono.className = "parch-cat-mono";
      mono.textContent = letter;
      mono.setAttribute("aria-hidden", "true");
      mono.title = name;

      inner.prepend(mono);
    });
  };

  api.onPageChange(() => {
    requestAnimationFrame(applyCategoryMonograms);
  });
});
