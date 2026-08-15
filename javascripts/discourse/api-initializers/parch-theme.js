import { apiInitializer } from "discourse/lib/api";
import { i18n } from "discourse-i18n";

export default apiInitializer((api) => {
  const siteSettings = api.container.lookup("service:site-settings");

  // 1. Inject Terminal Code Block UI
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

        const title = document.createElement("span");
        title.className = "parch-terminal-title";
        title.textContent = i18n(themePrefix("parch_theme.codeblock.terminal_title")) || "parch ~ $";

        const copyBtn = document.createElement("button");
        copyBtn.className = "parch-copy-btn";
        copyBtn.type = "button";
        copyBtn.textContent = i18n(themePrefix("parch_theme.codeblock.copy")) || "Copy";

        copyBtn.addEventListener("click", () => {
          const codeText = pre.querySelector("code")?.innerText || pre.innerText;
          navigator.clipboard.writeText(codeText).then(() => {
            copyBtn.textContent = i18n(themePrefix("parch_theme.codeblock.copied")) || "Copied!";
            setTimeout(() => {
              copyBtn.textContent = i18n(themePrefix("parch_theme.codeblock.copy")) || "Copy";
            }, 2000);
          });
        });

        header.appendChild(controls);
        header.appendChild(title);
        header.appendChild(copyBtn);

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
      });
    },
    { id: "parch-terminal-decorator" }
  );

  // 2. Render Parch Community Hero Banner on Discovery Pages
  if (settings.enable_parch_banner) {
    api.onPageChange((url) => {
      const isDiscovery =
        url === "/" ||
        url.startsWith("/latest") ||
        url.startsWith("/categories") ||
        url.startsWith("/top");

      const existingBanner = document.querySelector(".parch-hero-banner");

      if (isDiscovery && !existingBanner) {
        const mainOutlet = document.querySelector("#main-outlet");
        if (mainOutlet) {
          const banner = document.createElement("div");
          banner.className = "parch-hero-banner";
          banner.innerHTML = `
            <div class="parch-banner-badge">
              <span class="dot"></span>
              <span>${i18n(themePrefix("parch_theme.banner.status")) || "Arch-Based Rolling Release"}</span>
            </div>
            <div class="parch-banner-content">
              <div class="parch-banner-text">
                <h1>${settings.banner_title || "Welcome to Parch Linux"}</h1>
                <p>${settings.banner_subtitle || "A fast, lightweight, and beautiful Linux distribution based on Arch Linux."}</p>
              </div>
              <div class="parch-banner-logo">
                <svg width="80" height="80" viewBox="0 0 438 438" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M339.114 272.077L264.782 281.663L135.977 356.028C146.62 370.571 159.146 383.685 173.412 394.871C190.119 406.777 210.413 415.457 234.533 416.361C303.015 418.961 341.206 366.341 342.947 307.425C343.306 295.26 341.845 283.547 339.114 272.077Z" fill="#00FF80"/>
                  <path d="M149.582 281.663C137.077 295.251 124.522 311.397 118.174 327.001C123.319 337.175 129.281 346.879 135.976 356.028L264.782 281.663H149.582Z" fill="#0080FF"/>
                  <path d="M286.931 167.793L184.657 248.541C184.657 248.541 167.168 262.554 149.583 281.663H264.782L265.582 281.201L327.679 239.13C317.145 215.571 302.325 192.348 286.931 167.793Z" fill="#00EAFF"/>
                  <path d="M128.938 112.079C108.479 144.053 96.5584 181.73 95.0785 220.985C94.1701 246.191 97.6097 270.937 104.85 294.174L184.657 248.541L273.141 178.681L185.68 137.06L128.938 112.079Z" fill="#00A9FF"/>
                  <path d="M286.247 21.5678C238.459 22.3028 192.396 41.9963 157.102 77.0381C152.585 81.5225 148.303 86.2253 144.236 91.1046L185.68 137.06L273.14 178.681L286.931 167.793C281.433 159.023 275.877 150.101 270.396 140.908C246.374 100.615 259.218 36.3958 304.612 22.2311C301.688 21.9741 298.758 21.7888 295.825 21.6749C292.626 21.5543 289.432 21.5188 286.247 21.5678Z" fill="#00FF95"/>
                </svg>
              </div>
            </div>
            <div class="parch-banner-actions">
              <a href="${settings.banner_download_url}" class="btn-parch-primary" target="_blank" rel="noopener noreferrer">
                <span>⬇ ${i18n(themePrefix("parch_theme.banner.download")) || "Download Parch"}</span>
              </a>
              <a href="${settings.banner_wiki_url}" class="btn-parch-secondary" target="_blank" rel="noopener noreferrer">
                <span>📖 ${i18n(themePrefix("parch_theme.banner.wiki")) || "Wiki & Docs"}</span>
              </a>
              <a href="${settings.banner_github_url}" class="btn-parch-secondary" target="_blank" rel="noopener noreferrer">
                <span>⚡ ${i18n(themePrefix("parch_theme.banner.github")) || "GitHub"}</span>
              </a>
              <a href="${settings.banner_telegram_url}" class="btn-parch-secondary" target="_blank" rel="noopener noreferrer">
                <span>💬 ${i18n(themePrefix("parch_theme.banner.telegram")) || "Community Chat"}</span>
              </a>
            </div>
          `;

          mainOutlet.insertBefore(banner, mainOutlet.firstChild);
        }
      } else if (!isDiscovery && existingBanner) {
        existingBanner.remove();
      }
    });
  }

  // 3. Custom Header Quick Navigation Links
  if (settings.custom_header_links) {
    api.decorateWidget("header-buttons:before", (helper) => {
      return helper.h(
        "div.parch-header-links",
        [
          helper.h(
            "a.parch-nav-item",
            {
              href: "https://parchlinux.com",
              target: "_blank",
              rel: "noopener noreferrer",
              title: "Parch Linux Website",
            },
            i18n(themePrefix("parch_theme.nav.website")) || "Parch OS"
          ),
          helper.h(
            "a.parch-nav-item",
            {
              href: settings.banner_wiki_url || "https://wiki.parchlinux.com",
              target: "_blank",
              rel: "noopener noreferrer",
              title: "Documentation & Wiki",
            },
            i18n(themePrefix("parch_theme.nav.wiki")) || "Wiki"
          ),
          helper.h(
            "a.parch-nav-item",
            {
              href: settings.banner_github_url || "https://github.com/parchlinux",
              target: "_blank",
              rel: "noopener noreferrer",
              title: "GitHub Repositories",
            },
            i18n(themePrefix("parch_theme.nav.github")) || "GitHub"
          ),
        ]
      );
    });
  }
});
