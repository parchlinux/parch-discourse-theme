import { apiInitializer } from "discourse/lib/api";
import { i18n } from "discourse-i18n";

export default apiInitializer((api) => {
  // Translation helper that returns the fallback when the key is missing
  const t = (key, fallback) => {
    const fullKey = themePrefix(key);
    const value = i18n(fullKey);
    return value && value !== fullKey ? value : fallback;
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
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    docs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
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

        const terminalTitle = t("codeblock.terminal_title", "parch-terminal");
        const title = document.createElement("span");
        title.className = "parch-terminal-title";
        title.innerHTML = `
          ${ICONS.terminal}
          <span>${escapeHtml(terminalTitle)} ~ <span class="prompt-indicator ${promptClass}">${promptSymbol}</span></span>
        `;

        const copyLabel = t("codeblock.copy", "Copy");
        const copiedLabel = t("codeblock.copied", "Copied!");
        const failedLabel = t("codeblock.copy_failed", "Failed");

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

  // 2. Render Parch Community Hero Banner on Page Change
  api.onPageChange((url) => {
    if (!settings.enable_parch_banner) {
      return;
    }

    const isDiscovery =
      url === "/" ||
      url.startsWith("/latest") ||
      url.startsWith("/categories") ||
      url.startsWith("/top");

    const existingBanner = document.querySelector(".parch-hero-banner");

    if (isDiscovery && !existingBanner) {
      const mainOutlet = document.querySelector("#main-outlet");
      if (mainOutlet) {
        const title = escapeHtml(
          settings.banner_title || t("banner.title", "Welcome to Parch Linux")
        );
        const subtitle = escapeHtml(
          settings.banner_subtitle ||
            t(
              "banner.subtitle",
              "A fast, lightweight, and beautiful Linux distribution based on Arch Linux."
            )
        );
        const badge = t("banner.status", "Arch-Based Rolling Release");
        const downloadUrl = escapeHtml(settings.banner_download_url);
        const wikiUrl = escapeHtml(settings.banner_wiki_url);
        const githubUrl = escapeHtml(settings.banner_github_url);
        const telegramUrl = escapeHtml(settings.banner_telegram_url);
        const downloadLabel = t("banner.download", "Download ISO");
        const wikiLabel = t("banner.wiki", "Wiki & Docs");
        const githubLabel = t("banner.github", "GitHub");
        const telegramLabel = t("banner.telegram", "Telegram");

        const banner = document.createElement("div");
        banner.className = "parch-hero-banner";
        banner.innerHTML = `
          <div class="parch-banner-badge">
            <span class="dot"></span>
            <span>${badge}</span>
          </div>
          <div class="parch-banner-content">
            <div class="parch-banner-text">
              <h1>${title}</h1>
              <p>${subtitle}</p>
            </div>
            <div class="parch-banner-logo">
              <svg width="76" height="76" viewBox="0 0 438 438" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M339.114 272.077L264.782 281.663L135.977 356.028C146.62 370.571 159.146 383.685 173.412 394.871C190.119 406.777 210.413 415.457 234.533 416.361C303.015 418.961 341.206 366.341 342.947 307.425C343.306 295.26 341.845 283.547 339.114 272.077Z" fill="#00FF80"/>
                <path d="M149.582 281.663C137.077 295.251 124.522 311.397 118.174 327.001C123.319 337.175 129.281 346.879 135.976 356.028L264.782 281.663H149.582Z" fill="#0080FF"/>
                <path d="M286.931 167.793L184.657 248.541C184.657 248.541 167.168 262.554 149.583 281.663H264.782L265.582 281.201L327.679 239.13C317.145 215.571 302.325 192.348 286.931 167.793Z" fill="#00EAFF"/>
                <path d="M128.938 112.079C108.479 144.053 96.5584 181.73 95.0785 220.985C94.1701 246.191 97.6097 270.937 104.85 294.174L184.657 248.541L273.141 178.681L185.68 137.06L128.938 112.079Z" fill="#00A9FF"/>
                <path d="M286.247 21.5678C238.459 22.3028 192.396 41.9963 157.102 77.0381C152.585 81.5225 148.303 86.2253 144.236 91.1046L185.68 137.06L273.14 178.681L286.931 167.793C281.433 159.023 275.877 150.101 270.396 140.908C246.374 100.615 259.218 36.3958 304.612 22.2311C301.688 21.9741 298.758 21.7888 295.825 21.6749C292.626 21.5543 289.432 21.5188 286.247 21.5678Z" fill="#00FF95"/>
              </svg>
            </div>
          </div>
          <div class="parch-banner-actions">
            <a href="${downloadUrl}" class="btn-parch-primary" target="_blank" rel="noopener noreferrer">
              ${ICONS.download}
              <span>${downloadLabel}</span>
            </a>
            <a href="${wikiUrl}" class="btn-parch-secondary" target="_blank" rel="noopener noreferrer">
              ${ICONS.docs}
              <span>${wikiLabel}</span>
            </a>
            <a href="${githubUrl}" class="btn-parch-secondary" target="_blank" rel="noopener noreferrer">
              ${ICONS.github}
              <span>${githubLabel}</span>
            </a>
            <a href="${telegramUrl}" class="btn-parch-secondary" target="_blank" rel="noopener noreferrer">
              ${ICONS.chat}
              <span>${telegramLabel}</span>
            </a>
          </div>
        `;

        mainOutlet.prepend(banner);
      }
    } else if (!isDiscovery && existingBanner) {
      existingBanner.remove();
    }
  });
});
