# Parch Linux Discourse Theme

A modern, fast, and sleek Discourse theme designed specifically for the **Parch Linux** community. Built using the authentic Parch Linux color palette (`#00EAFF` Cyan, `#0080FF` Azure Blue, `#00FF80` Neon Green, and `#8500B2`/`#B000CC` Violet accents), glassmorphic elements, Linux terminal code blocks, and a modern category showcase with category logos.

---

## 🎨 Color Schemes

1. **Parch Dark (Default)**: Deep obsidian dark mode (`#0d1117`) paired with vibrant Parch Cyan (`#00EAFF`) and Spring Green (`#00FF80`) highlights.
2. **Parch Light**: Clean, high-contrast light theme with crystal-clear readability and Parch teal/emerald accents.
3. **Parch Neon Violet**: Inspired by the Parch dark logo (`parch-logo-dark.svg`), featuring deep space indigo backgrounds with vibrant violet (`#B000CC`) and cyan accents.
4. **Parch Cyber OLED**: True pitch black mode (`#000000`) optimized for OLED displays and battery efficiency.

---

## 🚀 Key Features

- **Category Showcase with Logos**: Modern grid for `/categories` where every card shows a logo plate (or an auto-generated monogram tile in the category's own accent color), topic/post counter pills, and subcategory chips.
- **Linux Terminal Code Blocks & Command Helper**:
  - Automatically formats code blocks into sleek Linux terminal windows with macOS/Linux 3-dot window controls and one-click copy.
  - Automatically detects root commands (`sudo`, `#`) vs user commands (`$`) and renders appropriate prompt indicators.
  - Formats inline code (`code`) with terminal-style badges.
- **Modern Floating Header**: Frosted glass backdrop blur with refined search bar.
- **Polished User Titles & Badges**: Clean typography and subtle badges with full support for Persian (e.g. `تیم پارچ`), RTL, and LTR scripts.
- **Card-Style Topic List**: Elevated topic cards with smooth hover lift micro-animations, Parch unread indicators, and category halos.
- **Post Content Polish**: Card-style tables with horizontal scroll on mobile, custom `details`/`summary` collapsibles, themed scrollbars, and visible focus rings.
- **Polished Typography**: Native integration with Google Fonts (*Estedad*, *Work Sans*, and *JetBrains Mono*).
- **Responsive & Mobile-First**: Optimized touch targets, compact rows, and responsive terminal code blocks.
- **Reduced Motion Support**: All animations and hover effects respect the user's `prefers-reduced-motion` setting.

---

## ⚙️ Theme Settings

Configure these settings in the Discourse Admin panel (**Admin > Customize > Themes > Parch Linux Theme > Settings**):

| Setting | Default | Description |
|---|---|---|
| `enable_terminal_codeblocks` | `true` | Format code blocks as Linux terminals with command helper |
| `enable_glassmorphism` | `true` | **Beta.** Frosted glass surfaces and ambient background on header and cards |

---

## 📦 Installation

1. In Discourse, go to **Admin > Customize > Themes**.
2. Click **Install** > **From a git repository**.
3. Enter the repository URL.
4. Select the theme and activate it for your community.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
