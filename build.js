#!/usr/bin/env node
/* Expand the shared chunks of markup into every page.
 *
 * The site is 32 hand-written HTML files and about a quarter of every one of
 * them was the same head, nav and footer copied over and over. Changing the
 * footer meant editing 31 files and hoping none got missed. One of them did:
 * three assignment pages sat on the wrong year range for months.
 *
 * This is deliberately not a static site generator. The pages stay real files
 * you can open straight off disk, GitHub Pages keeps serving them untouched,
 * and there is nothing to install. All this does is keep marked regions in
 * sync with the partials in partials/.
 *
 * A region looks like:
 *
 *   <!-- include: footer -->
 *   ...whatever partials/footer.html says...
 *   <!-- /include -->
 *
 * Running the script rewrites the inside of the region and leaves the rest of
 * the file alone. That is why the markers survive into the output: the file is
 * both the source and the thing that gets served, so there is no build folder
 * to forget to deploy and no generated copy to drift.
 *
 *   node build.js          rewrite every page
 *   node build.js --check  fail if any page is out of date, changing nothing
 *
 * Params go on the opening marker and fill {{name}} slots in the partial:
 *
 *   <!-- include: nav active="learn" -->
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PARTIALS = path.join(ROOT, "partials");

// Which nav item wears the highlight. Assignments lives inside the Learn menu,
// so picking it lights up Learn too, which is what the pages already did by
// hand. Anything not listed here is a typo and stops the build rather than
// quietly rendering a nav with nothing selected.
const NAV_STATES = {
  home: { home: ' class="active"' },
  learn: { learn: " active" },
  play: { play: " active" },
  assignments: { learn: " active", assignments: ' class="active"' },
  none: {},
};

const NAV_SLOTS = ["home", "learn", "play", "assignments"];

function readPartial(name) {
  const file = path.join(PARTIALS, name + ".html");
  if (!fs.existsSync(file)) {
    throw new Error("no such partial: partials/" + name + ".html");
  }
  // Partials are stored already indented to match where they land, and with a
  // trailing newline that the region supplies itself.
  return fs.readFileSync(file, "utf8").replace(/\n$/, "");
}

function render(name, params) {
  let out = readPartial(name);

  if (name === "nav") {
    const which = params.active || "none";
    if (!Object.prototype.hasOwnProperty.call(NAV_STATES, which)) {
      throw new Error(
        'nav active="' + which + '" is not one of: ' +
          Object.keys(NAV_STATES).join(", ")
      );
    }
    const on = NAV_STATES[which];
    NAV_SLOTS.forEach(function (slot) {
      out = out.split("{{" + slot + "}}").join(on[slot] || "");
    });
  }

  const left = out.match(/\{\{[a-z-]+\}\}/);
  if (left) {
    throw new Error(
      "partial " + name + " still has an unfilled slot: " + left[0]
    );
  }
  return out;
}

// Opening marker, body, closing marker. The body is matched lazily so a page
// with several regions does not swallow everything between the first opener
// and the last closer.
const REGION = /([ \t]*)<!-- include: ([a-z-]+)((?: [a-z-]+="[^"]*")*) -->\n[\s\S]*?\n[ \t]*<!-- \/include -->/g;

function parseParams(raw) {
  const params = {};
  const re = /([a-z-]+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(raw)) !== null) params[m[1]] = m[2];
  return params;
}

function expand(src, label) {
  return src.replace(REGION, function (whole, indent, name, rawParams) {
    let body;
    try {
      body = render(name, parseParams(rawParams));
    } catch (err) {
      throw new Error(label + ": " + err.message);
    }
    return (
      indent + "<!-- include: " + name + rawParams + " -->\n" +
      body + "\n" +
      indent + "<!-- /include -->"
    );
  });
}

function pages(dir, found) {
  found = found || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    if (entry.name === ".git" || entry.name === "node_modules") return;
    if (entry.name === "partials") return;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) pages(full, found);
    else if (entry.name.endsWith(".html")) found.push(full);
  });
  return found;
}

function main() {
  const check = process.argv.includes("--check");
  const files = pages(ROOT).sort();
  let changed = 0;
  let touched = 0;

  files.forEach(function (file) {
    const rel = path.relative(ROOT, file);
    const before = fs.readFileSync(file, "utf8");
    if (before.indexOf("<!-- include:") === -1) return;
    touched++;
    const after = expand(before, rel);
    if (after === before) return;
    changed++;
    if (check) console.log("out of date: " + rel);
    else {
      fs.writeFileSync(file, after);
      console.log("updated: " + rel);
    }
  });

  if (check && changed) {
    console.error(
      "\n" + changed + " page(s) out of date. Run: node build.js"
    );
    process.exit(1);
  }
  console.log(
    (check ? "checked " : "built ") + touched + " page(s), " +
      changed + " changed"
  );
}

main();
