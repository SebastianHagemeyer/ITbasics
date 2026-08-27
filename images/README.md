# images/

Pictures used in the lessons. Two rules, both of which have teeth in the code.

**Every picture needs a credit.** The skeleton switcher on
`/topics/ideas/` renders a picture only when its entry in `ideas.js` has
BOTH a `src` and a `credit`. Leave the credit blank and the picture does
not appear, which is deliberate: an unattributed screenshot is the exact
thing we are trying not to do.

**Prefer freely licensed or our own.** Screenshots of commercial games
belong to their publishers. Wikimedia Commons only hosts freely licensed
files, so it is the safe place to shop; the file page tells you the author
and the licence, and both go in the credit line.

## What is here

| File | Where it came from |
| --- | --- |
| `pacman-gameplay.png` | Commons, CC BY 3.0. Redrawn at the original 224x288, so leave it unscaled and let the browser do the enlarging. |
| `flappy-bird-arcade.jpg` | Commons, CC BY 2.0. A photo of an arcade cabinet by daveynin, cropped down to the screen. |
| `minecraft-classic.jpg` | Commons, CC BY 3.0. Minecraft Classic v0.30, chosen over a modern screenshot because that row of the lesson is about the 2010 game. |
| `catch-the-eggs.jpg` | Ours. The sandbox snippet of the same name, screenshotted mid-game. |
| `taxi-driver.jpg` | Ours. A little taxi game built in the same sandbox engine, screenshotted mid-drive. |
| `minecraft-alpha.jpg` | Commons, CC BY 3.0. Minecraft Alpha v1.0.4, hearts but no hunger bar. The 2010 frame of the version timeline in the "games change" callout on `/topics/ideas/`. |
| `minecraft-end.jpg` | Commons, CC BY 3.0. The End, with the Ender Dragon: the 2011 frame of the timeline, when a way to win first arrived. |
| `minecraft-lush-caves.jpg` | Commons, CC BY 3.0. A lush caves biome: the 2021 frame, a decade on and still no ending you must reach. |
| `reverse-pacman.gif` | Ours. A short clip of a reverse Pac-Man (the red ghost chases the fleeing Pac-Men), illustrating Move 1. Rendered in the PyWebLib playground, which has the real `ghost` and `pacman` sprites, and screen-recorded. Not AI-generated. |
| `bomb-football.gif` | Ours. "Football, but the ball is a bomb": two players knock a bomb between two goals, illustrating Move 2. Same PyWebLib playground, screen-recorded. Not AI-generated. |
| `rollercoaster-tycoon.jpg` | A commercial screenshot, not freely licensed. No free equivalent exists on Commons, and the site owner chose to use it by reference. Its credit line says exactly that rather than dressing it up as a licence. It is the one exception to the rule below, made deliberately and with eyes open, not the default. |

## All six skeleton games now have a picture

Every game in the win/fail skeleton switcher on `/topics/ideas/` renders a
figure. Four came from Wikimedia Commons (freely licensed), one is the
RollerCoaster Tycoon exception above, and two (`catch-the-eggs.jpg`,
`taxi-driver.jpg`) are our own sandbox games screenshotted mid-play. That
last route, build the game and screenshot it, is the honest way to add any
more: it is unarguably ours and it doubles as a worked example.

## Adding one

1. Find the file on Wikimedia Commons and check the licence on its file page.
2. **Look at the picture before you download it.** A Commons search for a
   game title returns plenty of things that are not the game, and at least
   one Flappy Bird result is not safe for a classroom.
3. Save it here, then fill in `src`, `alt` and `credit` on that game's entry
   in `ideas.js`. Until the credit is filled in the picture stays hidden, so
   nothing half-finished can ship.
