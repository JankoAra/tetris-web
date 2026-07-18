# Tetris by Janko

A browser implementation of Tetris built with plain HTML, CSS and JavaScript (jQuery), with Bootstrap for styling.

## Pages

- `tetris-uputstvo.html` — start page with instructions, level/ghost-piece/music options
- `tetris-igra.html` — the game itself
- `tetris-rezultati.html` — scoreboard (stored in browser `localStorage`)

## Controls

| Key | Action |
| --- | --- |
| `←` / `→` | Move the piece left / right |
| `↑` | Rotate the piece clockwise |
| `↓` | Soft drop |
| `Space` | Hold to fast-drop |

Points are earned for soft-dropping and for clearing lines; clearing lines also increases the level, which speeds up gravity. A ghost piece (showing where the current piece will land) and background music can be toggled on the start page.

## Running locally

Since it's a static site, you can just open `tetris-uputstvo.html` directly in a browser, or serve the folder with any static file server.

## Running with Docker

The site is served by a minimal `nginx:alpine-slim` container:

```bash
docker compose up -d --build
```

This builds the image from the local source and starts it on port `30000`, with `tetris-uputstvo.html` as the index page. The compose file expects an external `proxy-net` Docker network and is meant to run behind [Nginx Proxy Manager](https://nginxproxymanager.com/), which is pointed at the `tetris-web` container on port `30000` (or `80` over the shared network) via its own UI.
