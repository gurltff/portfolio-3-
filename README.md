# Anoushka Dey — Portfolio

An interactive portfolio for **Anoushka Dey**, B.Sc. Physical Science with Chemistry at Maitreyi College, University of Delhi.

**Live site:** https://gurltff.github.io/portfolio-3-/

## What's inside

1. **Cover:** the paper-cut collage with a giant **PORTFOLIO** in cut-paper letters. The letters dodge the cursor and spin when clicked, the scene moves with the mouse (parallax), and there are floating stars, a swimming fish, and pop-up windows. Click **YES** or press <kbd>Enter</kbd> to go in.
2. **Transition:** a pixel dissolve into a short boot screen, "Anoushka*dey*, Physical Science Edition".
3. **Desktop:** a retro pixel desktop with an animated sky and hill.
   - `anoushka.exe`: the main profile card (course, college, year, city).
   - `about.txt`, `experience`, `nano_lab.exe` (an interactive nanoparticle simulation), `skills.exe`, `education`, `certificates`, `contact.exe`, plus `new.exe`, `likes.exe`, `open_to.exe` and a Recycle Bin easter egg.
   - Windows can be dragged (they tilt as you move them), minimised to the taskbar, maximised and closed. The start menu, All Programs, Log Off (back to the cover) and Turn Off (Stand By / Turn Off / Restart) all work.
   - On phones the windows become a scrolling stack with the icons at the top.

No frameworks and no build step: plain HTML, CSS and JavaScript. Fonts are self-hosted (Bowlby One, Pixelify Sans, Rubik — all SIL Open Font License).

```
index.html        page content (all text lives here)
css/style.css     styles
js/pixels.js      pixel-art icons, avatar and cursors
js/sky.js         animated pixel sky background
js/main.js        cover, transitions, window manager, mini-apps
assets/           cover collage, favicon, fonts
```

## Editing

- **LinkedIn / email:** open `js/main.js` and fill in the `LINKS` object at the top. The buttons then appear in `contact.exe` and the start menu automatically.
- **Text:** all the words are in `index.html`, one `<section class="win">` per window.

## Deploying (GitHub Pages)

Repository → **Settings → Pages → Build and deployment**
- Source: **Deploy from a branch**
- Branch: the branch with this code, folder **/ (root)** → **Save**

After about a minute the site is live at `https://gurltff.github.io/portfolio-3-/`.

To preview it locally, run any static server in this folder, for example `npx serve .`.
