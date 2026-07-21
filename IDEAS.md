# Ideas parked for later

Working notes for future builds, so nothing gets lost between sessions.

## Browser game library ("Hallam game") - DONE (July 2026)

Built into pyrun.js as the `game` module, shipped on the Sandbox. NOT a
pygame port: the browser already provides rendering and input, so it's a
small canvas shim (~a few KB of Python + JS), not megabytes.

Student API (screen coords, 0,0 top-left):

```python
import game
game.window(480, 360, background="#0b1020")
basket = game.sprite("🧺", 240, 330, size=48)
egg = game.sprite("🥚", 200, 0, size=34)

while game.playing():
    if game.pressed("left"):  basket.x -= 8
    if game.pressed("right"): basket.x += 8
    egg.y += 5
    if basket.touches(egg):
        game.score(1)
        egg.y = 0
    game.frame()
```

- Shipped: `window`, `sprite` (emoji), `box`, `label`, `pressed`, `score`,
  `playing`, `frame`, `game_over`; sprite `.x/.y/.size/.color/.text`,
  `.touches()`, `.hide()/.show()`.
- `game.frame()` uses the JSPI trick like time.sleep; Stop interrupts it;
  arrow keys/space/letters via a global keydown tracker gated on run state.
- Game window appears on `import game` (sandbox), inherits editor, Stop,
  indent + name checkers and "My code" saves.
- Two example cards: "move the chicken", "catch the eggs".
- Needs Chrome/Edge (JSPI), same as input()/sleep; window() says so on Safari.

### Possible follow-ups (not built)
- Mouse input (game.mouse_x/y, clicked).
- A short "Make a game" lesson or Task 3 built on it.
- Sound (Web Audio) - beep on catch, etc.

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
