# Hallam IT Basics

A beginner-friendly IT / computing website for Year 7&ndash;9 students at Hallam.

## What's inside

- **index.html** &mdash; Home page with an overview of all modules.
- **programming-basics.html** &mdash; Module 1: algorithms, variables, if/else, loops, debugging.
- **html-basics.html** &mdash; Module 2: tags, elements, links, images, lists, plus a mini project.
- **python-basics.html** &mdash; Module 3: printing, variables, input, maths, loops, functions, challenges.
- **quizzes.html** &mdash; Three interactive 5-question quizzes (one per module) with instant feedback.
- **styles.css** &mdash; Single stylesheet for the whole site.
- **quiz.js** &mdash; Quiz logic (vanilla JavaScript, no build step).

## Running locally

It's all static HTML/CSS/JS. Just open `index.html` in any modern browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Teacher notes

- Each lesson page has a table of contents, short sections with worked examples, and
  "You try" boxes or mini projects for hands-on practice.
- Quizzes can be retaken any number of times. Scores aren't stored &mdash; this is for
  self-check, not assessment.
- The three quiz tabs share a URL hash (`#programming`, `#html`, `#python`) so you can
  link students directly to a specific quiz.
