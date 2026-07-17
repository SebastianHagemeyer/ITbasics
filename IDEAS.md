# Ideas parked for later

Working notes for future builds, so nothing gets lost between sessions.

## Browser game library ("Hallam game") - the big one

A proprietary mini game library for the sandbox, in the same style as the
canvas turtle. NOT a pygame port: pygame can't run in the browser runtime,
and it doesn't need to, since the browser already provides rendering, input
and audio. Estimated size: 30-50 KB of JS + Python shim, not megabytes.

Sketch of the student-facing API:

```python
import game

game.window(400, 300)
player = game.sprite("🐔", x=200, y=260)

while game.playing():
    if game.pressed("left"):  player.x -= 5
    if game.pressed("right"): player.x += 5
    egg.y += 3
    if player.touches(egg):
        game.score(1)
    game.frame()   # draw everything, wait for the next frame
```

- Sprites as emoji (free art), plus rects/circles/text
- `game.frame()` uses the same JSPI stack-switch trick as input()/time.sleep()
- Inherits the editor, Stop button, indent checker and "My code" saves for free
- Example game to ship with it: catch the falling eggs
- Scope: the biggest single build discussed so far; treat as its own milestone
- Plan: let Pixel Painter and the colour task survive a real class first

## Smaller parked ideas

- **Basic data SAT**: a module test on data quantities (bit/byte/KB/MB/GB
  ladder, size reasoning, why images and video are big, data vs information,
  light compression). Decided format pending: auto-marked module test vs
  Pet-Project-style assignment.
- **Roll brainboxes out to more modules**: the short-answer widget is generic;
  each module needs question divs on its lesson page plus a count bump in
  teacher.js (see the Digital Systems entry for the pattern).
- **Cipher assignment**: possible Task 3 pairing Networks/Codes with
  programming, seeded from the Caesar cipher sandbox example.
