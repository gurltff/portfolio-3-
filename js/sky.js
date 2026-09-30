/* ------------------------------------------------------------------
   Pixel sky: a low-resolution "rolling green hill + blue sky" scene,
   drawn with ordered dithering and scaled up with crisp pixels.
   Clouds drift slowly; the hill is painted in front of them.
   ------------------------------------------------------------------ */
(function () {
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  const SKY = ['#2f5fb8', '#3a6cc3', '#4679cc', '#5486d5', '#6394dd', '#74a3e4', '#88b3ea', '#9ec3f0', '#b6d3f5'];
  const HILL = ['#a6dc5c', '#86c847', '#6cb63a', '#58a332', '#468f2a', '#387a22', '#2b651b'];
  const FAR = ['#7fb3c9', '#6aa3b9', '#5b94a8'];

  function hex(c) {
    const n = parseInt(c.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const SKY_RGB = SKY.map(hex);
  const HILL_RGB = HILL.map(hex);
  const FAR_RGB = FAR.map(hex);

  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function dither(palette, t, x, y) {
    const v = Math.max(0, Math.min(0.9999, t)) * (palette.length - 1);
    const i = Math.floor(v);
    const f = v - i;
    const th = (BAYER[y & 3][x & 3] + 0.5) / 16;
    return palette[Math.min(palette.length - 1, f > th ? i + 1 : i)];
  }

  function makeCloud(r, w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    const img = g.createImageData(w, h);
    // a flat-bottomed base plus a row of round puffs on top
    const blobs = [{ x: w * 0.5, y: h * 0.7, rx: w * 0.47, ry: h * 0.28 }];
    const n = 3 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const rr = h * (0.24 + r() * 0.2);
      blobs.push({
        x: w * (0.22 + 0.56 * (i / (n - 1))) + (r() - 0.5) * w * 0.08,
        y: h * 0.6 - r() * h * 0.14,
        rx: rr, ry: rr
      });
    }
    for (let y = 0; y < h; y++) {
      if (y > h * 0.93) break;
      for (let x = 0; x < w; x++) {
        let inside = false;
        for (const b of blobs) {
          const dx = (x + 0.5 - b.x) / b.rx, dy = (y + 0.5 - b.y) / b.ry;
          if (dx * dx + dy * dy < 1) { inside = true; break; }
        }
        if (!inside) continue;
        const k = (y * w + x) * 4;
        const shade = y > h * 0.66 ? (BAYER[y & 3][x & 3] / 16 < (y / h - 0.66) * 3 ? 2 : 1) : 0;
        const col = shade === 2 ? [205, 219, 242] : shade === 1 ? [232, 240, 252] : [255, 255, 255];
        img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  class PixelSky {
    constructor(canvas) {
      this.cv = canvas;
      this.ctx = canvas.getContext('2d');
      this.clouds = [];
      this.running = false;
      this.last = 0;
      this.tick = this.tick.bind(this);
      this.resize = this.resize.bind(this);
      window.addEventListener('resize', () => {
        clearTimeout(this._rt);
        this._rt = setTimeout(this.resize, 120);
      });
      this.resize();
    }

    resize() {
      const vw = window.innerWidth, vh = window.innerHeight;
      const px = vw < 700 ? 3 : 4;
      const W = Math.ceil(vw / px), H = Math.ceil(vh / px);
      if (W === this.W && H === this.H) return;
      this.W = W; this.H = H;
      this.cv.width = W; this.cv.height = H;
      this.bg = this.paintSky(W, H);
      this.hill = this.paintHill(W, H);
      this.makeClouds(W, H);
      this.draw();
    }

    paintSky(W, H) {
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const g = c.getContext('2d');
      const img = g.createImageData(W, H);
      for (let y = 0; y < H; y++) {
        const t = Math.pow(y / (H * 0.8), 1.15);
        for (let x = 0; x < W; x++) {
          const tt = t + (x / W) * 0.08;
          const col = SKY_RGB[SKY.indexOf(dither(SKY, tt, x, y))];
          const k = (y * W + x) * 4;
          img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
      return c;
    }

    hillY(x, W, H) {
      const u = x / W;
      return H * (0.8 - 0.15 * Math.sin(Math.PI * (u * 0.95 + 0.12)) + 0.05 * u);
    }

    farY(x, W, H) {
      const u = x / W;
      return H * (0.8 - 0.06 * Math.sin(Math.PI * (u * 1.6 - 0.35)));
    }

    paintHill(W, H) {
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const g = c.getContext('2d');
      const img = g.createImageData(W, H);
      const r = rng(7);
      const noise = new Float32Array(W * H);
      for (let i = 0; i < noise.length; i++) noise[i] = r();
      for (let x = 0; x < W; x++) {
        const top = Math.round(this.hillY(x, W, H));
        const far = Math.round(this.farY(x, W, H));
        for (let y = Math.min(top, far); y < H; y++) {
          const k = (y * W + x) * 4;
          let col;
          if (y >= top) {
            const d = (y - top) / (H - top + 1);
            let t = 0.08 + d * 0.95 + (x / W) * 0.12;
            if (y - top < 2) t = 0;
            col = HILL_RGB[HILL.indexOf(dither(HILL, t, x, y))];
            if (noise[y * W + x] > 0.985 && y - top > 3) col = HILL_RGB[Math.min(HILL.length - 1, HILL.indexOf(dither(HILL, t, x, y)) + 2)];
          } else if (y >= far) {
            col = FAR_RGB[FAR.indexOf(dither(FAR, (y - far) / 14, x, y))];
          } else continue;
          img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
      return c;
    }

    makeClouds(W, H) {
      const r = rng(42);
      this.clouds = [];
      const count = Math.max(4, Math.round(W / 70));
      for (let i = 0; i < count; i++) {
        const cw = Math.round(34 + r() * 46);
        const ch = Math.round(cw * (0.38 + r() * 0.12));
        this.clouds.push({
          img: makeCloud(r, cw, ch),
          x: r() * (W + cw) - cw,
          y: Math.round(H * (0.03 + r() * 0.42)),
          v: 1.2 + r() * 2.2
        });
      }
      this.clouds.sort((a, b) => a.v - b.v);
    }

    draw() {
      const g = this.ctx;
      g.drawImage(this.bg, 0, 0);
      for (const c of this.clouds) g.drawImage(c.img, Math.round(c.x), c.y);
      g.drawImage(this.hill, 0, 0);
    }

    tick(t) {
      if (!this.running) return;
      const dt = Math.min(0.1, (t - (this.last || t)) / 1000);
      this.last = t;
      for (const c of this.clouds) {
        c.x += c.v * dt;
        if (c.x > this.W + 4) c.x = -c.img.width - 4;
      }
      this.draw();
      requestAnimationFrame(this.tick);
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.last = 0;
      requestAnimationFrame(this.tick);
    }

    stop() { this.running = false; }
  }

  window.PixelSky = PixelSky;
})();
