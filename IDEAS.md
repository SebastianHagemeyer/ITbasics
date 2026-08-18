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
board = game.label("Score: 0", 60, 22)   # the scoreboard is a drawable label

while game.playing():
    if game.pressed("left"):  basket.x -= 8
    if game.pressed("right"): basket.x += 8
    egg.y += 5
    if basket.touches(egg):
        game.score(1)
        board.text = "Score: " + str(game.score())
        egg.y = 0
    game.frame()
```

- Shipped: `window`, `sprite` (emoji), `box`, `label`, `pressed`, `score`
  (a plain counter, draws nothing: show it with a label), `playing`, `frame`,
  `game_over`; sprite `.x/.y/.size/.color/.text`, `.touches()`, `.hide()/.show()`.
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

## Game Ideas & Design module + Idea Machine - DONE (August 2026)

Built because students kept stalling at "I don't know what to make". Two pages:

- `topics/ideas/`: the lesson. Three ways to find an idea (change one thing in a
  game you love, combine two things that do not belong, be a critic), top down
  vs bottom up, the win/fail/actions/obstacles skeleton with a switcher, nine 2D
  shapes that the Hallam `game` library can actually do, the MVP section with a
  scope cutter, the same moves applied to websites, and a four box design doc
  that saves as `answers-ideas`. Blends 60% test + 40% written, like Digital
  Systems, and is registered in hw-status/progress/teacher.
- `ideas/`: the Idea Machine. Four slots (twist, star, goal, danger) with lock
  and re-roll, a website mode, an MVP panel derived from the slots, and starter
  code using the star's emoji. Word lists live in `ideas.js`, which also drives
  the lesson widgets.

### Possible follow-ups (not built)
- A teacher-set "idea of the week" seeded into the machine.
- Publishing a shortlisted idea straight into the Game Maker design notes.
- More word lists per year level, or a class-voted list built from a wordcloud.

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
