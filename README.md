# Parch Linux Discourse Theme

A modern, fast, and sleek Discourse theme designed specifically for the **Parch Linux** community. Built using the authentic Parch Linux color palette (`#00EAFF` Cyan, `#0080FF` Azure Blue, `#00FF80` Neon Green, and `#8500B2`/`#B000CC` Violet accents), glassmorphic elements, Linux terminal code blocks, and an interactive community hero banner.

---

## 🎨 Color Schemes

1. **Parch Dark (Default)**: Deep obsidian dark mode (`#0d1117`) paired with vibrant Parch Cyan (`#00EAFF`) and Spring Green (`#00FF80`) highlights.
2. **Parch Light**: Clean, high-contrast light theme with crystal-clear readability and Parch teal/emerald accents.
3. **Parch Neon Violet**: Inspired by the Parch dark logo (`parch-logo-dark.svg`), featuring deep space indigo backgrounds with vibrant violet (`#B000CC`) and cyan accents.
4. **Parch Cyber OLED**: True pitch black mode (`#000000`) optimized for OLED displays and battery efficiency.

---

## 🚀 Key Features

- **Parch Hero Community Banner**: Interactive banner on discovery pages featuring quick links with crisp SVG icons to download the Parch Linux ISO, Wiki/Documentation, GitHub repos, and Telegram chat.
- **Bento Grid Category Cards**: Modern Bento-style grid for `/categories` featuring custom glowing indicator bars, topic/post counter pills, and smooth hover elevation.
- **Linux Terminal Code Blocks & Command Helper**:
  - Automatically formats code blocks into sleek Linux terminal windows with macOS/Linux 3-dot window controls and one-click copy.
  - Automatically detects root commands (`sudo`, `#`) vs user commands (`$`) and renders appropriate prompt indicators.
  - Formats inline code (`code`) with terminal-style badges.
- **Modern Floating Header**: Frosted glass backdrop blur with refined search bar.
- **Polished User Titles & Badges**: Clean typography and subtle badges with full support for Persian (e.g. `تیم پارچ`), RTL, and LTR scripts.
- **Card-Style Topic List**: Elevated topic cards with smooth hover lift micro-animations, Parch unread indicators, and category halos.
- **Polished Typography**: Native integration with Google Fonts (*Inter*, *Plus Jakarta Sans*, and *JetBrains Mono*).
- **Responsive & Mobile-First**: Optimized touch targets, compact rows, and responsive terminal code blocks.

---

## ⚙️ Theme Settings

Configure these settings in the Discourse Admin panel (**Admin > Customize > Themes > Parch Linux Theme > Settings**):

| Setting | Default | Description |
|---|---|---|
| `enable_parch_banner` | `true` | Show/hide the community hero banner on discovery pages |
| `banner_title` | `"Welcome to Parch Linux"` | Headline title for the hero banner |
| `banner_subtitle` | `"A fast, lightweight, and beautiful Linux distribution..."` | Subtitle description |
| `banner_download_url` | `"https://parchlinux.com/download"` | URL for the Download ISO button |
| `banner_wiki_url` | `"https://wiki.parchlinux.com"` | URL for the Documentation & Wiki button |
| `banner_github_url` | `"https://github.com/parchlinux"` | URL for GitHub repositories |
| `banner_telegram_url` | `"https://t.me/parchlinux"` | URL for the Telegram community group |
| `enable_terminal_codeblocks` | `true` | Format code blocks as Linux terminals with command helper |
| `enable_glassmorphism` | `true` | Frosted glass effect on header and cards |

---

## 📦 Installation

1. In Discourse, go to **Admin > Customize > Themes**.
2. Click **Install** > **From a git repository**.
3. Enter the repository URL.
4. Select the theme and activate it for your community.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
