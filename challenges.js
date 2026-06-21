(function () {
  "use strict";

  const PYODIDE_VERSION = "0.27.7";
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/pyodide.js";
  const CODEJAR_URL = "https://cdn.jsdelivr.net/npm/codejar@4.0.0/dist/codejar.min.js";
  const CODE_KEY = "itbasics-challenge-code";
  const QUIZ_NAME = "livecoding";

  // ---- Challenge definitions ------------------------------------------------
  // Each test feeds scripted input() values and (for the guessing game) forces
  // the "random" secret to a known value. check(result, test) -> {pass, why}.
  const TIER_LABELS = { beginner: "Beginner", intermediate: "Intermediate", stretch: "Stretch" };

  const CHALLENGES = [
    // -------- Beginner --------
    {
      id: "greeter",
      tier: "beginner",
      title: "Greeter",
      brief: "Ask for a name and say hello back.",
      detail: "Read a name with <code>input()</code>, then print a greeting that includes the name they typed.",
      accept: 'Your output must contain a greeting word (hello / hi / hey / welcome) <strong>and</strong> the name that was entered.',
      starter:
        '# Greeter\n' +
        'name = input("What is your name? ")\n' +
        '# Now print a friendly greeting that uses their name\n',
      tests: [
        { label: 'Name: "Alex"',  inputs: ["Alex"],  check: function (r) { return checkGreeter(r, "Alex"); } },
        { label: 'Name: "Priya"', inputs: ["Priya"], check: function (r) { return checkGreeter(r, "Priya"); } }
      ]
    },
    {
      id: "shout",
      tier: "beginner",
      title: "Shout it",
      brief: "Take a word and print it in CAPITAL LETTERS.",
      detail: "Read a word with <code>input()</code>, then print it back, all in capitals. Hint: every string has an <code>.upper()</code> method.",
      accept: "Your output must contain the typed word, all in capitals (e.g. \"hello\" &rarr; \"HELLO\").",
      starter:
        '# Shout it\n' +
        'word = input("A word? ")\n' +
        '# print the word in capital letters\n',
      tests: [
        { label: 'Word: "hello"',  inputs: ["hello"],  check: function (r) { return checkShout(r, "hello"); } },
        { label: 'Word: "python"', inputs: ["python"], check: function (r) { return checkShout(r, "python"); } },
        { label: 'Word: "Hallam"', inputs: ["Hallam"], check: function (r) { return checkShout(r, "Hallam"); } }
      ]
    },
    {
      id: "double",
      tier: "beginner",
      title: "Double it",
      brief: "Ask for a number and print double its value.",
      detail: "Read a number with <code>input()</code> (remember to convert with <code>int()</code>) and print it doubled.",
      accept: "Your output must contain the doubled value.",
      starter:
        '# Double it\n' +
        'n = int(input("A number? "))\n' +
        '# print double the value\n',
      tests: [
        { label: "Input: 5",   inputs: ["5"],   check: function (r) { return checkDouble(r, 5); } },
        { label: "Input: 12",  inputs: ["12"],  check: function (r) { return checkDouble(r, 12); } },
        { label: "Input: 100", inputs: ["100"], check: function (r) { return checkDouble(r, 100); } },
        { label: "Input: 0",   inputs: ["0"],   check: function (r) { return checkDouble(r, 0); } }
      ]
    },
    {
      id: "add-two",
      tier: "beginner",
      title: "Add two numbers",
      brief: "Ask for two numbers and print their sum.",
      detail: "Read two numbers (don't forget <code>int()</code>) and print the result of adding them.",
      accept: "Your output must contain the correct sum.",
      starter:
        '# Add two numbers\n' +
        'a = int(input("First number? "))\n' +
        'b = int(input("Second number? "))\n' +
        '# print the sum\n',
      tests: [
        { label: "3 + 4",   inputs: ["3", "4"],   check: function (r) { return checkAdd(r, 3, 4); } },
        { label: "10 + 5",  inputs: ["10", "5"],  check: function (r) { return checkAdd(r, 10, 5); } },
        { label: "12 + 8",  inputs: ["12", "8"],  check: function (r) { return checkAdd(r, 12, 8); } },
        { label: "25 + 17", inputs: ["25", "17"], check: function (r) { return checkAdd(r, 25, 17); } }
      ]
    },
    {
      id: "countdown",
      tier: "beginner",
      title: "Countdown",
      brief: "Print 5, 4, 3, 2, 1, then GO!",
      detail: "Print the numbers 5 down to 1, then print <strong>GO!</strong>. You can use a loop (with <code>range</code> and step <code>-1</code>) or just print them one at a time.",
      accept: "Your output must contain 5, 4, 3, 2, 1 and the word GO.",
      starter:
        '# Countdown\n' +
        '# print 5, 4, 3, 2, 1 (one per line) then GO!\n',
      tests: [
        { label: "Counts down to GO", inputs: [], check: checkCountdown }
      ]
    },
    {
      id: "even-odd",
      tier: "beginner",
      title: "Even or odd",
      brief: "Tell the user whether their number is even or odd.",
      detail: "Read a number with <code>int(input())</code>. If it divides evenly by 2 print <strong>Even</strong>, otherwise print <strong>Odd</strong>. Hint: <code>n % 2</code> gives the remainder.",
      accept: 'Your output must say "Even" for even numbers and "Odd" for odd ones &mdash; not both.',
      starter:
        '# Even or odd\n' +
        'n = int(input("A number? "))\n' +
        '# print "Even" if n is even, otherwise print "Odd"\n',
      tests: [
        { label: "Input: 10 (even)", inputs: ["10"], check: function (r) { return checkEvenOdd(r, 10); } },
        { label: "Input: 7 (odd)",   inputs: ["7"],  check: function (r) { return checkEvenOdd(r, 7); } },
        { label: "Input: 0 (even)",  inputs: ["0"],  check: function (r) { return checkEvenOdd(r, 0); } },
        { label: "Input: 21 (odd)",  inputs: ["21"], check: function (r) { return checkEvenOdd(r, 21); } }
      ]
    },
    {
      id: "letter-count",
      tier: "beginner",
      title: "Letter count",
      brief: "Tell the user how many letters are in their word.",
      detail: "Read a word with <code>input()</code> and print the number of letters in it. Hint: <code>len(word)</code> gives the length.",
      accept: "Your output must contain the correct letter count.",
      starter:
        '# Letter count\n' +
        'word = input("A word? ")\n' +
        '# print how many letters are in the word\n',
      tests: [
        { label: 'Word: "cat" (3)',     inputs: ["cat"],     check: function (r) { return checkLetterCount(r, "cat"); } },
        { label: 'Word: "python" (6)',  inputs: ["python"],  check: function (r) { return checkLetterCount(r, "python"); } },
        { label: 'Word: "computer" (8)', inputs: ["computer"], check: function (r) { return checkLetterCount(r, "computer"); } }
      ]
    },
    {
      id: "age",
      tier: "beginner",
      title: "Age checker",
      brief: "Ask for an age and say whether they can watch a PG-13 film.",
      detail: "Read an age with <code>input()</code> (remember <code>input()</code> gives text &mdash; convert with <code>int()</code>). PG-13 films are for ages <strong>13 and over</strong>.",
      accept: 'If the age is 13 or more, your message must clearly allow it (e.g. "you can watch"). Under 13, it must clearly refuse (e.g. "you can\'t" / "too young").',
      starter:
        '# Age checker\n' +
        'age = int(input("How old are you? "))\n' +
        '# PG-13 films are for ages 13 and up\n',
      tests: [
        { label: "Age 15 (allowed)", inputs: ["15"], check: function (r) { return checkAge(r, true); } },
        { label: "Age 13 (allowed, boundary)", inputs: ["13"], check: function (r) { return checkAge(r, true); } },
        { label: "Age 12 (refused, boundary)", inputs: ["12"], check: function (r) { return checkAge(r, false); } },
        { label: "Age 7 (refused)", inputs: ["7"], check: function (r) { return checkAge(r, false); } }
      ]
    },

    // -------- Intermediate --------
    {
      id: "times",
      tier: "intermediate",
      title: "Times table",
      brief: "Ask for a number and print its times table up to 12.",
      detail: "Read a number with <code>int(input())</code>, then print its times table from 1 to 12 so every result (n&times;1 up to n&times;12) appears.",
      accept: "Every product from n&times;1 to n&times;12 must appear in your output.",
      starter:
        '# Times table\n' +
        'n = int(input("Which times table? "))\n' +
        '# print n x 1, all the way up to n x 12\n',
      tests: [
        { label: "Table of 3", inputs: ["3"], check: function (r) { return checkTimes(r, 3); } },
        { label: "Table of 7", inputs: ["7"], check: function (r) { return checkTimes(r, 7); } }
      ]
    },
    {
      id: "sum-to-n",
      tier: "intermediate",
      title: "Sum to n",
      brief: "Ask for n, then print the sum of 1 + 2 + ... + n.",
      detail: "Read n, then add up every number from 1 to n. You can use a loop with an accumulator, or the formula <code>n*(n+1)//2</code>.",
      accept: "Your output must contain the correct total.",
      starter:
        '# Sum 1 + 2 + ... + n\n' +
        'n = int(input("Sum 1 to what? "))\n' +
        '# print the total\n',
      tests: [
        { label: "n = 5 -> 15",  inputs: ["5"],  check: function (r) { return checkSumToN(r, 5); } },
        { label: "n = 10 -> 55", inputs: ["10"], check: function (r) { return checkSumToN(r, 10); } },
        { label: "n = 3 -> 6",   inputs: ["3"],  check: function (r) { return checkSumToN(r, 3); } },
        { label: "n = 100 -> 5050", inputs: ["100"], check: function (r) { return checkSumToN(r, 100); } }
      ]
    },
    {
      id: "multiples",
      tier: "intermediate",
      title: "First 5 multiples",
      brief: "Ask for a number and print its first 5 multiples.",
      detail: "Read n, then print n, 2n, 3n, 4n, 5n. A loop with <code>range(1, 6)</code> is a tidy way to do it.",
      accept: "Your output must contain all 5 multiples (n&times;1 through n&times;5).",
      starter:
        '# First 5 multiples\n' +
        'n = int(input("Number? "))\n' +
        '# print the first 5 multiples of n\n',
      tests: [
        { label: "n = 3", inputs: ["3"], check: function (r) { return checkMultiples(r, 3); } },
        { label: "n = 7", inputs: ["7"], check: function (r) { return checkMultiples(r, 7); } },
        { label: "n = 11", inputs: ["11"], check: function (r) { return checkMultiples(r, 11); } }
      ]
    },
    {
      id: "biggest3",
      tier: "intermediate",
      title: "Biggest of three",
      brief: "Ask for three numbers and print the biggest.",
      detail: "Read three numbers and print the largest. You could compare them with <code>if</code> statements, or use the built-in <code>max()</code> function.",
      accept: "Your output must include the biggest of the three.",
      starter:
        '# Biggest of three\n' +
        'a = int(input("First? "))\n' +
        'b = int(input("Second? "))\n' +
        'c = int(input("Third? "))\n' +
        '# print the biggest\n',
      tests: [
        { label: "5, 9, 2 -> 9",   inputs: ["5", "9", "2"],   check: function (r) { return checkBiggest3(r, 5, 9, 2); } },
        { label: "10, 3, 7 -> 10", inputs: ["10", "3", "7"],  check: function (r) { return checkBiggest3(r, 10, 3, 7); } },
        { label: "4, 8, 6 -> 8",   inputs: ["4", "8", "6"],   check: function (r) { return checkBiggest3(r, 4, 8, 6); } },
        { label: "1, 2, 9 -> 9",   inputs: ["1", "2", "9"],   check: function (r) { return checkBiggest3(r, 1, 2, 9); } }
      ]
    },
    {
      id: "vowels",
      tier: "intermediate",
      title: "Count the vowels",
      brief: "Count how many vowels are in a word.",
      detail: "Read a word with <code>input()</code> and count how many letters are vowels (a, e, i, o, u). Print the count.",
      accept: "Your output must contain the correct number of vowels.",
      starter:
        '# Count the vowels\n' +
        'word = input("A word? ")\n' +
        '# count the vowels (a, e, i, o, u) and print the count\n',
      tests: [
        { label: 'Word: "hello"  (2)',  inputs: ["hello"],  check: function (r) { return checkVowels(r, "hello"); } },
        { label: 'Word: "python" (1)',  inputs: ["python"], check: function (r) { return checkVowels(r, "python"); } },
        { label: 'Word: "aeiou"  (5)',  inputs: ["aeiou"],  check: function (r) { return checkVowels(r, "aeiou"); } },
        { label: 'Word: "rhythm" (0)',  inputs: ["rhythm"], check: function (r) { return checkVowels(r, "rhythm"); } }
      ]
    },
    {
      id: "reverse",
      tier: "intermediate",
      title: "Reverse a word",
      brief: "Print a word backwards.",
      detail: "Read a word with <code>input()</code> and print it reversed. Hint: in Python, <code>word[::-1]</code> reverses a string.",
      accept: "Your output must contain the reversed word.",
      starter:
        '# Reverse a word\n' +
        'word = input("A word? ")\n' +
        '# print the word backwards\n',
      tests: [
        { label: 'Word: "hello"  -> "olleh"',  inputs: ["hello"],  check: function (r) { return checkReverse(r, "hello"); } },
        { label: 'Word: "python" -> "nohtyp"', inputs: ["python"], check: function (r) { return checkReverse(r, "python"); } },
        { label: 'Word: "abc"    -> "cba"',    inputs: ["abc"],    check: function (r) { return checkReverse(r, "abc"); } }
      ]
    },
    {
      id: "fizz",
      tier: "intermediate",
      title: "Fizz",
      brief: "Count to n, but say Fizz on multiples of 3.",
      detail: "Read n, then print every number from 1 to n. But if a number is a multiple of 3, print <strong>Fizz</strong> instead of the number.",
      accept: "Every number from 1 to n must appear, but multiples of 3 must be replaced by \"Fizz\".",
      starter:
        '# Fizz\n' +
        'n = int(input("Count to? "))\n' +
        '# for each i from 1 to n, print Fizz if i is a multiple of 3, otherwise print i\n',
      tests: [
        { label: "n = 5",  inputs: ["5"],  check: function (r) { return checkFizz(r, 5); } },
        { label: "n = 9",  inputs: ["9"],  check: function (r) { return checkFizz(r, 9); } },
        { label: "n = 12", inputs: ["12"], check: function (r) { return checkFizz(r, 12); } }
      ]
    },

    // -------- Stretch --------
    {
      id: "guess",
      tier: "stretch",
      title: "Guessing game",
      brief: "The computer picks a secret number from 1 to 10. The player keeps guessing until they get it right.",
      detail: "The computer hides the number &mdash; the player has to find it." +
        '<ol class="challenge-steps">' +
        "<li>Pick the secret with <code>random.randint(1, 10)</code>.</li>" +
        "<li>Ask for a guess with <code>input()</code>, and convert it to a number with <code>int()</code> so you can compare it.</li>" +
        "<li>Use a loop: <em>while</em> the guess is wrong, tell them and ask again.</li>" +
        "<li>When the guess matches the secret, print a success message like <code>Correct!</code>.</li>" +
        "</ol>",
      accept: "Your program must keep asking for a guess until one matches the secret, then print a success word (correct / well done / got it / you win). A wrong guess should lead to another guess &mdash; not stop the program.",
      starter:
        '# Guessing game\n' +
        'import random\n' +
        '\n' +
        'secret = random.randint(1, 10)   # the computer\'s hidden number - you can\'t see it!\n' +
        '\n' +
        '# 1) Ask for a guess:  guess = int(input("Your guess: "))\n' +
        '# 2) Keep asking while the guess is wrong (use a loop).\n' +
        '# 3) When guess == secret, print a success message like "Correct!".\n',
      tests: [
        { label: "Secret 7 - guesses 3, 1, 7", forceSecret: 7, inputs: ["3", "1", "7"], check: checkGuess },
        { label: "Secret 2 - guesses 5, 2",    forceSecret: 2, inputs: ["5", "2"],      check: checkGuess },
        { label: "Secret 4 - guessed first try", forceSecret: 4, inputs: ["4"],         check: checkGuess }
      ]
    },
    {
      id: "fizzbuzz",
      tier: "stretch",
      title: "FizzBuzz",
      brief: "The classic. Print 1 to 15, with Fizz, Buzz and FizzBuzz.",
      detail: "Print every number from 1 to 15, but: multiples of 3 print <strong>Fizz</strong>, multiples of 5 print <strong>Buzz</strong>, multiples of <strong>both</strong> print <strong>FizzBuzz</strong>.",
      accept: "1, 2, 4, 7, 8, 11, 13, 14 appear as numbers. 3, 6, 9, 12 appear as Fizz. 5, 10 appear as Buzz. 15 appears as FizzBuzz.",
      starter:
        '# FizzBuzz: 1 to 15\n' +
        '# Multiples of 3 -> Fizz, of 5 -> Buzz, of both -> FizzBuzz\n',
      tests: [
        { label: "FizzBuzz 1 to 15", inputs: [], check: checkFizzBuzz }
      ]
    },
    {
      id: "palindrome",
      tier: "stretch",
      title: "Palindrome check",
      brief: "Check whether a word reads the same backwards.",
      detail: "Read a word with <code>input()</code>. If it reads the same backwards (like \"racecar\"), print <strong>Palindrome</strong>. Otherwise print <strong>Not a palindrome</strong>.",
      accept: 'For a palindrome, your output must contain "Palindrome" and not say "not". For a non-palindrome it must clearly say "not a palindrome".',
      starter:
        '# Palindrome check\n' +
        'word = input("A word? ")\n' +
        '# print "Palindrome" if it reads the same backwards, otherwise "Not a palindrome"\n',
      tests: [
        { label: '"racecar" (palindrome)',     inputs: ["racecar"], check: function (r) { return checkPalindrome(r, "racecar", true); } },
        { label: '"hello"   (not)',            inputs: ["hello"],   check: function (r) { return checkPalindrome(r, "hello", false); } },
        { label: '"abba"    (palindrome)',     inputs: ["abba"],    check: function (r) { return checkPalindrome(r, "abba", true); } },
        { label: '"python"  (not)',            inputs: ["python"],  check: function (r) { return checkPalindrome(r, "python", false); } }
      ]
    },
    {
      id: "password",
      tier: "stretch",
      title: "Password lock",
      brief: "Keep asking until the user types the secret password.",
      detail: "Use a loop to ask for a password. If they type <code>hallam</code>, print a welcome message and stop. Otherwise, ask again.",
      accept: "Your program must keep asking until \"hallam\" is entered, then print a welcome word (welcome / access / granted / correct).",
      starter:
        '# Password lock\n' +
        '# Keep asking "Password? " until the user types: hallam\n' +
        '# Then print "Welcome!"\n',
      tests: [
        { label: 'Got it first try',          inputs: ["hallam"],                  check: checkPassword },
        { label: 'Wrong once, then right',    inputs: ["wrong", "hallam"],         check: checkPassword },
        { label: 'Wrong three times',         inputs: ["a", "bcd", "nope", "hallam"], check: checkPassword }
      ]
    },
    {
      id: "sum-many",
      tier: "stretch",
      title: "Sum a list of numbers",
      brief: "User enters numbers separated by spaces. Print the total.",
      detail: "Read one line of input like <code>3 7 12 5</code>. Split it on spaces, convert each piece to a number, and print the sum.",
      accept: "Your output must contain the correct sum.",
      starter:
        '# Sum a list of numbers\n' +
        'line = input("Numbers separated by spaces: ")\n' +
        '# split on spaces, convert each to int, print the total\n',
      tests: [
        { label: '"1 2 3" -> 6',          inputs: ["1 2 3"],          check: function (r) { return checkSumMany(r, "1 2 3"); } },
        { label: '"10 20 30 40" -> 100',  inputs: ["10 20 30 40"],    check: function (r) { return checkSumMany(r, "10 20 30 40"); } },
        { label: '"5" -> 5',              inputs: ["5"],              check: function (r) { return checkSumMany(r, "5"); } },
        { label: '"7 13 21" -> 41',       inputs: ["7 13 21"],        check: function (r) { return checkSumMany(r, "7 13 21"); } }
      ]
    }
  ];

  // ---- Grading checks -------------------------------------------------------
  function norm(s) { return String(s || "").toLowerCase(); }
  function pass(why) { return { pass: true, why: why || "Looks good." }; }
  function fail(why) { return { pass: false, why: why }; }
  function numberTokens(s) {
    const set = new Set();
    (String(s).match(/\d+/g) || []).forEach(function (t) { set.add(parseInt(t, 10)); });
    return set;
  }

  function checkGreeter(r, name) {
    if (r.error) return fail("Your code stopped with an error: " + r.error);
    const out = norm(r.output);
    const hasName = out.indexOf(name.toLowerCase()) !== -1;
    const hasHello = /\b(hello|hi|hey|welcome|greetings|howdy|g'day)\b/.test(out);
    if (hasName && hasHello) return pass("Greeted " + name + ".");
    if (!hasName) return fail('I typed "' + name + '" but it never appeared in your output. Make sure you print the name you read.');
    return fail('I saw the name but no greeting word (try including "Hello").');
  }

  function checkAge(r, shouldAllow) {
    if (r.error) return fail("Your code stopped with an error: " + r.error +
      (/str.*int|int.*str|not supported between/.test(r.error) ? "  (Hint: convert the age with int().)" : ""));
    const out = norm(r.output);
    const denies = /can't|cannot|can ?not|not old enough|too young|not allowed|\bno\b|\bnope\b|aren't|are not|sorry/.test(out);
    const allows = /can watch|you can\b|allowed|old enough|\byes\b|go ahead|enjoy|\bsure\b|permitted/.test(out);
    const verdict = denies ? "deny" : (allows ? "allow" : "unknown");
    if (verdict === "unknown") return fail("I couldn't tell if you allowed or refused. Say it clearly, e.g. \"You can watch it\" or \"You can't watch it\".");
    if (shouldAllow && verdict === "allow") return pass("Correctly allowed.");
    if (!shouldAllow && verdict === "deny") return pass("Correctly refused.");
    return fail(shouldAllow
      ? "This age (13+) should be allowed, but your message refused it."
      : "This age (under 13) should be refused, but your message allowed it.");
  }

  function checkTimes(r, n) {
    if (r.error) return fail("Your code stopped with an error: " + r.error +
      (/str.*int|int.*str|can't multiply|not supported between/.test(r.error) ? "  (Hint: convert the number with int().)" : ""));
    const tokens = numberTokens(r.output);
    const missing = [];
    for (let k = 1; k <= 12; k++) {
      const product = n * k;
      if (!tokens.has(product)) missing.push(n + "x" + k + "=" + product);
    }
    if (!missing.length) return pass("All 12 results for the " + n + " times table are there.");
    return fail("Missing result(s): " + missing.slice(0, 4).join(", ") + (missing.length > 4 ? " ..." : "") + ". Loop from 1 to 12.");
  }

  function checkGuess(r, test) {
    const want = test.inputs.length;
    if (r.error) {
      if (r.error.indexOf("EOFError") !== -1) {
        return fail("Your program kept asking even after the correct guess (or never matched). Make sure a correct guess ends the loop. (Tip: compare to an int, e.g. int(input(...)).)");
      }
      return fail("Your code stopped with an error: " + r.error);
    }
    const out = norm(r.output);
    const success = /correct|well done|got it|you win|you won|nailed|\bright\b|\byes\b|guessed it|congrat/.test(out);
    if (r.used !== want) {
      if (r.used < want) return fail("You stopped after " + r.used + " guess(es) but should have kept asking through all " + want + ". Keep looping until the guess is right.");
      return fail("You read more guesses than expected - check your loop condition.");
    }
    if (!success) return fail("You stopped at the right guess but didn't print a success message (try \"Correct!\").");
    return pass("Looped to the correct guess and celebrated.");
  }

  // ---- New check functions for the expanded challenge set -------------------
  function intHint(err) {
    return /str.*int|int.*str|not supported between|can't multiply/.test(err)
      ? "  (Hint: convert text to a number with int().)" : "";
  }

  function checkShout(r, word) {
    if (r.error) return fail("Your code stopped with an error: " + r.error);
    if (r.output.indexOf(word.toUpperCase()) === -1) {
      return fail('I typed "' + word + '" but I didn\'t see "' + word.toUpperCase() + '" in the output. Try the .upper() method.');
    }
    return pass("Shouted " + word.toUpperCase() + ".");
  }

  function checkDouble(r, n) {
    if (r.error) return fail("Your code stopped: " + r.error + intHint(r.error));
    const want = n * 2;
    const tokens = numberTokens(r.output);
    if (tokens.has(want)) return pass(n + " doubled is " + want + ".");
    return fail("Expected " + want + " (double of " + n + ") in your output.");
  }

  function checkAdd(r, a, b) {
    if (r.error) return fail("Your code stopped: " + r.error + intHint(r.error));
    const sum = a + b;
    const tokens = numberTokens(r.output);
    if (tokens.has(sum)) return pass(a + " + " + b + " = " + sum + ".");
    return fail("Expected the sum " + sum + " in your output, but I didn't see it.");
  }

  function checkCountdown(r) {
    if (r.error) return fail("Your code stopped: " + r.error);
    const tokens = numberTokens(r.output);
    const missing = [5, 4, 3, 2, 1].filter(function (n) { return !tokens.has(n); });
    if (missing.length) return fail("Missing number(s): " + missing.join(", ") + ". Print every step from 5 down to 1.");
    if (!/\bgo\b/i.test(r.output)) return fail("Don't forget to print GO at the end!");
    return pass("Counted down to GO!");
  }

  function checkEvenOdd(r, n) {
    if (r.error) return fail("Your code stopped: " + r.error + intHint(r.error));
    const isEven = n % 2 === 0;
    const sawEven = /\beven\b/i.test(r.output);
    const sawOdd  = /\bodd\b/i.test(r.output);
    if (isEven && sawEven && !sawOdd) return pass(n + " is even.");
    if (!isEven && sawOdd && !sawEven) return pass(n + " is odd.");
    if (sawEven && sawOdd) return fail("You printed both \"Even\" and \"Odd\" — only print one.");
    if (isEven) return fail(n + " is even, but your output didn't say \"Even\".");
    return fail(n + " is odd, but your output didn't say \"Odd\".");
  }

  function checkLetterCount(r, word) {
    if (r.error) return fail("Your code stopped: " + r.error);
    const tokens = numberTokens(r.output);
    if (tokens.has(word.length)) return pass('"' + word + '" has ' + word.length + " letters.");
    return fail('Expected the number ' + word.length + ' (the length of "' + word + '") in your output.');
  }

  function checkSumToN(r, n) {
    if (r.error) return fail("Your code stopped: " + r.error + intHint(r.error));
    const sum = (n * (n + 1)) / 2;
    const tokens = numberTokens(r.output);
    if (tokens.has(sum)) return pass("Sum 1..." + n + " = " + sum + ".");
    return fail("Expected " + sum + " (the sum from 1 to " + n + ").");
  }

  function checkMultiples(r, n) {
    if (r.error) return fail("Your code stopped: " + r.error + intHint(r.error));
    const tokens = numberTokens(r.output);
    const want = [n, n * 2, n * 3, n * 4, n * 5];
    const missing = want.filter(function (x) { return !tokens.has(x); });
    if (!missing.length) return pass("All 5 multiples of " + n + " are there.");
    return fail("Missing multiple(s): " + missing.join(", ") + ".");
  }

  function checkBiggest3(r, a, b, c) {
    if (r.error) return fail("Your code stopped: " + r.error + intHint(r.error));
    const biggest = Math.max(a, b, c);
    // r.output now contains only what the student print()ed (typed input is no
    // longer echoed here), so simply check that the biggest value was printed.
    const re = new RegExp("\\b" + biggest + "\\b");
    if (re.test(String(r.output))) return pass("Biggest is " + biggest + ".");
    return fail("The biggest of " + a + ", " + b + ", " + c + " is " + biggest + ". Make sure you print it.");
  }

  function checkVowels(r, word) {
    if (r.error) return fail("Your code stopped: " + r.error);
    const expected = (word.match(/[aeiou]/gi) || []).length;
    const tokens = numberTokens(r.output);
    if (tokens.has(expected)) return pass('"' + word + '" has ' + expected + " vowel(s).");
    return fail('Expected ' + expected + ' vowel(s) for "' + word + '".');
  }

  function checkReverse(r, word) {
    if (r.error) return fail("Your code stopped: " + r.error);
    const reversed = word.split("").reverse().join("");
    if (r.output.indexOf(reversed) === -1) {
      return fail('Expected to see "' + reversed + '" (the reverse of "' + word + '") in your output.');
    }
    return pass('Reversed to "' + reversed + '".');
  }

  function checkFizz(r, n) {
    if (r.error) return fail("Your code stopped: " + r.error + intHint(r.error));
    const expectedFizz = Math.floor(n / 3);
    const actualFizz = (r.output.match(/fizz/gi) || []).length;
    if (actualFizz !== expectedFizz) {
      return fail("Expected " + expectedFizz + " \"Fizz\" line(s), but I saw " + actualFizz + ".");
    }
    const tokens = numberTokens(r.output);
    const missing = [];
    for (let i = 1; i <= n; i++) {
      if (i % 3 !== 0 && !tokens.has(i)) missing.push(i);
    }
    if (missing.length) return fail("Missing non-Fizz number(s): " + missing.slice(0, 5).join(", ") + (missing.length > 5 ? "..." : "") + ".");
    return pass("Fizz pattern up to " + n + " is right.");
  }

  function checkFizzBuzz(r) {
    if (r.error) return fail("Your code stopped: " + r.error);
    const out = r.output;
    const fb = (out.match(/fizzbuzz/gi) || []).length;
    if (fb !== 1) return fail('Expected exactly one "FizzBuzz" (for 15), but I saw ' + fb + ".");
    // strip FizzBuzz before counting plain Fizz / Buzz
    const stripped = out.replace(/fizzbuzz/gi, "");
    const fizz = (stripped.match(/fizz/gi) || []).length;
    const buzz = (stripped.match(/buzz/gi) || []).length;
    if (fizz !== 4) return fail('Expected 4 plain "Fizz" (for 3, 6, 9, 12), but I saw ' + fizz + ".");
    if (buzz !== 2) return fail('Expected 2 plain "Buzz" (for 5, 10), but I saw ' + buzz + ".");
    const tokens = numberTokens(out);
    const others = [1, 2, 4, 7, 8, 11, 13, 14];
    const missing = others.filter(function (x) { return !tokens.has(x); });
    if (missing.length) return fail("Missing number(s): " + missing.join(", ") + ".");
    return pass("FizzBuzz 1 to 15 is perfect!");
  }

  function checkPalindrome(r, word, isPalindrome) {
    if (r.error) return fail("Your code stopped: " + r.error);
    const out = r.output;
    const negative = /not\s*a?\s*palindrome|isn'?t\s*a\s*palindrome|is\s+not\s+a\s+palindrome/i.test(out);
    const positive = /\bpalindrome\b/i.test(out) && !negative;
    if (isPalindrome) {
      if (positive) return pass('"' + word + '" is a palindrome.');
      return fail('"' + word + '" IS a palindrome but your output didn\'t say so.');
    }
    if (negative) return pass('"' + word + '" is not a palindrome.');
    return fail('"' + word + '" is NOT a palindrome but your output didn\'t say "not".');
  }

  function checkPassword(r, test) {
    const want = test.inputs.length;
    if (r.error) {
      if (r.error.indexOf("EOFError") !== -1) {
        return fail("Your program kept asking even after \"hallam\" was typed. Make sure typing it ends the loop.");
      }
      return fail("Your code stopped: " + r.error);
    }
    if (r.used !== want) {
      if (r.used < want) return fail("You stopped after " + r.used + " tries but should have kept asking through all " + want + ".");
      return fail("Read more inputs than expected - check your loop condition.");
    }
    const welcome = /welcome|access|granted|correct|you'?re in|come in|let me in|nice/i.test(r.output);
    if (!welcome) return fail('After they got it right, print a welcome message (try "Welcome!").');
    return pass("Looped to the right password and welcomed them.");
  }

  function checkSumMany(r, line) {
    if (r.error) return fail("Your code stopped: " + r.error + intHint(r.error));
    const parts = String(line).trim().split(/\s+/).map(function (s) { return parseInt(s, 10); });
    const total = parts.reduce(function (a, b) { return a + b; }, 0);
    const tokens = numberTokens(r.output);
    if (tokens.has(total)) return pass("Sum is " + total + ".");
    return fail("Expected the sum " + total + " in your output.");
  }

  // ---- Python grading runner (installed once after Pyodide loads) ----------
  // Runs the student's code with scripted input(), captures stdout, guards
  // against endless loops, and (optionally) forces random's secret number.
  //
  // Two outputs are captured separately:
  //   * "output"  - ONLY what the student actually print()ed. Grading checks
  //                 use this so a typed input value (e.g. a name) is never
  //                 mistaken for something the program printed.
  //   * "display" - the full transcript (prompts + echoed input + prints),
  //                 shown in the results panel so the interaction looks real.
  const PY_RUNNER = `
import json, io, sys, builtins, random
from contextlib import redirect_stdout

def _run_student(code, inputs_json, force_secret_json):
    inputs = json.loads(inputs_json)
    force_secret = json.loads(force_secret_json)
    it = iter(inputs)
    used = {"n": 0}
    orig_input = builtins.input
    orig_rand = (random.randint, random.randrange, random.choice)

    printed = io.StringIO()   # what the student print()ed (used for grading)
    display = io.StringIO()    # full transcript incl. prompts + echoed input

    class _Tee:
        def write(self, s):
            printed.write(s)
            display.write(s)
            return len(s)
        def flush(self):
            pass

    def _inp(prompt=""):
        if prompt:
            display.write(str(prompt))
        try:
            v = next(it)
        except StopIteration:
            raise EOFError("no more input")
        used["n"] += 1
        # Echo the typed value to the display transcript only - NOT to the
        # grading buffer - so it can't be counted as program output.
        display.write(str(v) + "\\n")
        return str(v)

    builtins.input = _inp
    if force_secret is not None:
        random.randint = lambda a, b: force_secret
        random.randrange = lambda *a, **k: force_secret
        random.choice = lambda seq: force_secret

    ops = {"n": 0}
    LIMIT = 3000000
    def guard(frame, event, arg):
        ops["n"] += 1
        if ops["n"] > LIMIT:
            raise RuntimeError("ran too long (possible endless loop)")
        return guard

    err = None
    g = {"__name__": "__main__"}
    sys.settrace(guard)
    try:
        with redirect_stdout(_Tee()):
            exec(compile(code, "<solution>", "exec"), g)
    except BaseException as e:
        err = type(e).__name__ + ": " + str(e)
    finally:
        sys.settrace(None)
        builtins.input = orig_input
        random.randint, random.randrange, random.choice = orig_rand

    return json.dumps({
        "output": printed.getvalue(),
        "display": display.getvalue(),
        "used": used["n"],
        "error": err
    })
`;

  // ---- Interactive input() (JSPI), shared with the sandbox -----------------
  const PY_INSTALL_INPUT = `
import builtins as _b
def _sandbox_install_input():
    from pyodide.ffi import run_sync
    from _sandbox_io import readLine
    def input(prompt=""):
        return run_sync(readLine(str(prompt)))
    _b.input = input
_sandbox_install_input()
del _sandbox_install_input, _b
`;
  const PY_DISABLE_INPUT = `
import builtins as _b
def _sandbox_install_input():
    def input(*args, **kwargs):
        raise RuntimeError(
            "Interactive input() needs Chrome or Edge here. Use the Check "
            "button (it works everywhere), or open this page in Chrome/Edge."
        )
    _b.input = input
_sandbox_install_input()
del _sandbox_install_input, _b
`;

  // ---- DOM ------------------------------------------------------------------
  const editor      = document.getElementById("challenge-code");
  const output      = document.getElementById("challenge-output");
  const runBtn      = document.getElementById("challenge-run");
  const runLabel    = runBtn ? runBtn.querySelector(".challenge-run-label") : null;
  const checkBtn    = document.getElementById("challenge-check");
  const checkLabel  = checkBtn ? checkBtn.querySelector(".challenge-check-label") : null;
  const resetBtn    = document.querySelector(".challenge-reset");
  const clearBtn    = document.querySelector(".challenge-clear");
  const tabsEl      = document.getElementById("challenge-tabs");
  const briefEl     = document.getElementById("challenge-brief");
  const resultsEl   = document.getElementById("challenge-results");
  const scoreboardEl = document.getElementById("challenge-scoreboard");
  const fileEl      = document.getElementById("challenge-file");

  if (!editor || !runBtn || !checkBtn) return;

  // ---- State ----------------------------------------------------------------
  let pyodide = null;
  let loadingPromise = null;
  let jar = null;
  let busy = false;
  let current = CHALLENGES[0];
  let passed = new Set();
  let codeMap = loadCodeMap();

  function challengeById(id) {
    return CHALLENGES.filter(function (c) { return c.id === id; })[0];
  }
  function loadCodeMap() {
    try { return JSON.parse(localStorage.getItem(CODE_KEY) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function saveCodeMap() {
    try { localStorage.setItem(CODE_KEY, JSON.stringify(codeMap)); } catch (e) {}
  }
  function codeFor(ch) {
    return (codeMap[ch.id] != null && codeMap[ch.id] !== "") ? codeMap[ch.id] : ch.starter;
  }
  function getCode() { return jar ? jar.toString() : editor.textContent; }
  function setCode(code) { if (jar) jar.updateCode(code); else editor.textContent = code; }

  // ---- Editor (CodeJar + Prism, with a plain fallback) ---------------------
  function initEditor() {
    editor.textContent = codeFor(current);
    if (!window.Prism) { initPlainEditor(); return; }
    import(CODEJAR_URL)
      .then(function (mod) {
        if (mod && typeof mod.CodeJar === "function") {
          jar = mod.CodeJar(editor, function (el) { window.Prism.highlightElement(el); }, {
            tab: "    ",
            indentOn: /[(\[{:]\s*$/
          });
          jar.updateCode(codeFor(current));
          jar.onUpdate(function (code) { codeMap[current.id] = code; saveCodeMap(); });
        } else { initPlainEditor(); }
      })
      .catch(initPlainEditor);
  }
  function initPlainEditor() {
    editor.contentEditable = "plaintext-only";
    editor.textContent = codeFor(current);
    editor.addEventListener("input", function () { codeMap[current.id] = editor.textContent; saveCodeMap(); });
  }

  // ---- Output panel (interactive Run) --------------------------------------
  function appendOut(text, kind) {
    const span = document.createElement("span");
    if (kind) span.className = "out-" + kind;
    span.textContent = text + (text.endsWith("\n") ? "" : "\n");
    output.appendChild(span);
    output.scrollTop = output.scrollHeight;
  }
  function clearOut() { output.innerHTML = ""; }

  function readLineInteractive(promptText) {
    return new Promise(function (resolve) {
      const line = document.createElement("span");
      line.className = "out-stdin-line";
      if (promptText) line.appendChild(document.createTextNode(promptText));
      const field = document.createElement("input");
      field.type = "text";
      field.className = "sandbox-stdin";
      field.autocomplete = "off";
      field.autocapitalize = "off";
      field.spellcheck = false;
      field.size = 1;
      line.appendChild(field);
      const cursor = document.createElement("span");
      cursor.className = "sandbox-cursor";
      cursor.setAttribute("aria-hidden", "true");
      line.appendChild(cursor);
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;

      function resize() { field.size = Math.max(1, field.value.length + 1); }
      field.addEventListener("input", resize);
      line.addEventListener("mousedown", function (e) {
        if (e.target !== field) { e.preventDefault(); field.focus(); }
      });
      setRunLabel("Waiting for input…", true);
      field.focus();

      function onKey(e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const value = field.value;
        field.removeEventListener("input", resize);
        field.removeEventListener("keydown", onKey);
        const echo = document.createElement("span");
        echo.className = "out-stdin";
        echo.textContent = value;
        line.replaceChild(echo, field);
        line.removeChild(cursor);
        line.appendChild(document.createTextNode("\n"));
        setRunLabel("Running…", true);
        output.scrollTop = output.scrollHeight;
        resolve(value);
      }
      field.addEventListener("keydown", onKey);
    });
  }
  function jspiSupported() {
    return typeof WebAssembly !== "undefined" && typeof WebAssembly.Suspending === "function";
  }

  // ---- Pyodide --------------------------------------------------------------
  function loadPyodideScript() {
    if (window.loadPyodide) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      const s = document.createElement("script");
      s.src = PYODIDE_URL;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Couldn't reach the Python runtime CDN.")); };
      document.head.appendChild(s);
    });
  }
  async function ensurePyodide(announce) {
    if (pyodide) return pyodide;
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async function () {
      if (announce) { setRunLabel("Loading Python…", true); appendOut("Loading Python runtime (one-time, ~10 MB)…", "info"); }
      setCheckBusy(true, "Loading…");
      await loadPyodideScript();
      pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/"
      });
      pyodide.setStdout({ batched: function (s) { appendOut(s, "stdout"); } });
      pyodide.setStderr({ batched: function (s) { appendOut(s, "stderr"); } });
      pyodide.registerJsModule("_sandbox_io", { readLine: readLineInteractive });
      await pyodide.runPythonAsync(jspiSupported() ? PY_INSTALL_INPUT : PY_DISABLE_INPUT);
      pyodide.runPython(PY_RUNNER);
      return pyodide;
    })();
    return loadingPromise;
  }

  // ---- Run (interactive) ----------------------------------------------------
  function setRunLabel(text, on) {
    if (runLabel) runLabel.textContent = text;
    runBtn.disabled = !!on;
    runBtn.classList.toggle("is-busy", !!on);
  }
  function setCheckBusy(on, text) {
    if (checkLabel) checkLabel.textContent = text || (on ? "Checking…" : "Check");
    checkBtn.disabled = !!on;
    checkBtn.classList.toggle("is-busy", !!on);
  }

  async function run() {
    if (busy) return;
    busy = true;
    clearOut();
    setRunLabel("Running…", true);
    setCheckBusy(true, "Check");
    try {
      const py = await ensurePyodide(true);
      await py.runPythonAsync(getCode());
    } catch (err) {
      appendOut((err && err.message) ? err.message : String(err), "stderr");
    } finally {
      setRunLabel("Run", false);
      setCheckBusy(false);
      busy = false;
    }
  }

  // ---- Check (auto-grade) ---------------------------------------------------
  function runStudent(code, inputs, forceSecret) {
    pyodide.globals.set("_code", code);
    pyodide.globals.set("_inputs", JSON.stringify(inputs || []));
    pyodide.globals.set("_force", JSON.stringify(forceSecret == null ? null : forceSecret));
    const resJson = pyodide.runPython("_run_student(_code, _inputs, _force)");
    return JSON.parse(resJson);
  }

  async function check() {
    if (busy) return;
    busy = true;
    setCheckBusy(true, "Checking…");
    setRunLabel("Run", true);
    renderResults(null); // clears
    const code = getCode();
    try {
      await ensurePyodide(false);
    } catch (err) {
      setCheckBusy(false);
      setRunLabel("Run", false);
      busy = false;
      renderResults({ error: (err && err.message) ? err.message : String(err) });
      return;
    }

    const ch = current;
    const rows = ch.tests.map(function (test) {
      const res = runStudent(code, test.inputs, test.forceSecret);
      const verdict = test.check(res, test);
      return {
        label: test.label,
        inputs: test.inputs,
        pass: verdict.pass,
        why: verdict.why,
        output: (res.display != null ? res.display : res.output),
        error: res.error
      };
    });
    const allPass = rows.every(function (r) { return r.pass; });

    setCheckBusy(false);
    setRunLabel("Run", false);
    busy = false;

    if (allPass && !passed.has(ch.id)) {
      passed.add(ch.id);
      renderTabs();
      renderScoreboard();
      if (window.ITBasics && window.ITBasics.getSession()) {
        window.ITBasics.saveAttempt(QUIZ_NAME, 1, 1, { challenge: ch.id, code: code });
      }
    }
    renderResults({ rows: rows, allPass: allPass, challenge: ch });
  }

  // ---- Rendering ------------------------------------------------------------
  function renderTabs() {
    tabsEl.innerHTML = "";
    const byTier = { beginner: [], intermediate: [], stretch: [] };
    CHALLENGES.forEach(function (ch) {
      const tier = ch.tier || "stretch";
      (byTier[tier] || byTier.stretch).push(ch);
    });
    ["beginner", "intermediate", "stretch"].forEach(function (tier) {
      const list = byTier[tier];
      if (!list || !list.length) return;
      const done = list.filter(function (c) { return passed.has(c.id); }).length;

      const section = document.createElement("section");
      section.className = "challenge-tier-block tier-" + tier;

      const heading = document.createElement("h3");
      heading.className = "challenge-tier-heading";
      heading.innerHTML =
        '<span class="tier-dot tier-' + tier + '" aria-hidden="true"></span>' +
        '<span class="challenge-tier-name">' + (TIER_LABELS[tier] || tier) + '</span>' +
        '<span class="challenge-tier-count">' + done + ' / ' + list.length + '</span>';
      section.appendChild(heading);

      const listEl = document.createElement("div");
      listEl.className = "challenge-tier-list";
      list.forEach(function (ch) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-tab challenge-tab" + (ch.id === current.id ? " active" : "");
        btn.dataset.id = ch.id;
        const isDone = passed.has(ch.id);
        btn.innerHTML = (isDone ? '<span class="challenge-tick" aria-label="completed">✓</span> ' : '') + escapeHtml(ch.title);
        if (isDone) btn.classList.add("done");
        btn.addEventListener("click", function () { selectChallenge(ch.id); });
        listEl.appendChild(btn);
      });
      section.appendChild(listEl);
      tabsEl.appendChild(section);
    });
  }
  function renderBrief() {
    const tierBadge = current.tier
      ? ' <span class="challenge-tier-badge tier-' + current.tier + '">' + (TIER_LABELS[current.tier] || current.tier) + '</span>'
      : '';
    briefEl.innerHTML =
      '<h2 class="challenge-brief-title">' + escapeHtml(current.title) + tierBadge +
        (passed.has(current.id) ? ' <span class="challenge-badge-done">Completed</span>' : '') + '</h2>' +
      '<p class="challenge-brief-task">' + current.brief + '</p>' +
      '<div class="challenge-brief-detail">' + current.detail + '</div>' +
      '<p class="challenge-accept"><span class="challenge-accept-tag">To pass</span> ' + current.accept + '</p>';
  }
  function renderScoreboard() {
    const total = CHALLENGES.length;
    const done = CHALLENGES.filter(function (c) { return passed.has(c.id); }).length;
    const signedIn = window.ITBasics && window.ITBasics.getSession();
    let html =
      '<div class="challenge-progress">' +
        '<span class="challenge-progress-count">' + done + ' / ' + total + '</span>' +
        '<span class="challenge-progress-label">challenges complete</span>' +
        '<div class="challenge-progress-bar"><span style="width:' + Math.round((done / total) * 100) + '%"></span></div>' +
      '</div>';
    if (!signedIn) {
      html += '<p class="challenge-progress-hint">Sign in with your student code (top right) so your wins count on the leaderboard.</p>';
    }
    scoreboardEl.innerHTML = html;
  }
  function renderResults(state) {
    if (!state) { resultsEl.hidden = true; resultsEl.innerHTML = ""; return; }
    if (state.error) {
      resultsEl.hidden = false;
      resultsEl.innerHTML = '<div class="challenge-results-head fail">Couldn\'t start Python: ' + escapeHtml(state.error) + '</div>';
      return;
    }
    const rows = state.rows;
    const passCount = rows.filter(function (r) { return r.pass; }).length;
    let html = '<div class="challenge-results-head ' + (state.allPass ? "win" : "fail") + '">' +
      (state.allPass
        ? '🎉 Passed all ' + rows.length + ' tests &mdash; <strong>' + escapeHtml(state.challenge.title) + '</strong> complete!'
        : passCount + ' / ' + rows.length + ' tests passed &mdash; keep going!') +
      '</div><ul class="challenge-test-list">';
    rows.forEach(function (r) {
      html += '<li class="ct ' + (r.pass ? "pass" : "fail") + '">' +
        '<span class="ct-icon">' + (r.pass ? "✓" : "✗") + '</span>' +
        '<div class="ct-body">' +
          '<div class="ct-label">' + escapeHtml(r.label) + '</div>' +
          '<div class="ct-why">' + escapeHtml(r.why) + '</div>' +
          (r.output ? '<pre class="ct-output">' + escapeHtml(truncate(r.output, 600)) + '</pre>' : '') +
        '</div></li>';
    });
    html += '</ul>';
    resultsEl.hidden = false;
    resultsEl.innerHTML = html;
    resultsEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function selectChallenge(id) {
    if (busy) return;
    if (jar) { codeMap[current.id] = jar.toString(); saveCodeMap(); }
    current = challengeById(id) || CHALLENGES[0];
    fileEl.textContent = current.id + ".py";
    setCode(codeFor(current));
    clearOut();
    renderResults(null);
    renderTabs();
    renderBrief();
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function truncate(s, n) { return s.length > n ? s.slice(0, n) + "\n…(truncated)" : s; }

  // ---- Completion state -----------------------------------------------------
  async function loadPassed() {
    const out = new Set();
    if (!window.ITBasics) return out;
    const s = window.ITBasics.getSession();
    if (!s) return out;
    if (window.ITBasics.isOnline()) {
      try {
        const sb = window.ITBasics.client();
        const res = await sb.from("quiz_attempts").select("answers")
          .eq("student_code", s.code).eq("quiz_name", QUIZ_NAME);
        (res.data || []).forEach(function (r) {
          const c = r.answers && r.answers.challenge;
          if (c) out.add(c);
        });
      } catch (e) {}
    } else {
      try {
        const arr = JSON.parse(localStorage.getItem("itbasics-attempts-" + s.code + "-" + QUIZ_NAME) || "[]");
        arr.forEach(function (a) { const c = a.answers && a.answers.challenge; if (c) out.add(c); });
      } catch (e) {}
    }
    return out;
  }

  // ---- Wire up --------------------------------------------------------------
  editor.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
  });
  runBtn.addEventListener("click", run);
  checkBtn.addEventListener("click", check);
  if (resetBtn) resetBtn.addEventListener("click", function () {
    if (!window.confirm("Reset this challenge to the starter code?")) return;
    codeMap[current.id] = current.starter;
    saveCodeMap();
    setCode(current.starter);
    editor.focus();
  });
  if (clearBtn) clearBtn.addEventListener("click", clearOut);

  async function boot() {
    fileEl.textContent = current.id + ".py";
    initEditor();
    renderTabs();
    renderBrief();
    renderScoreboard();
    passed = await loadPassed();
    renderTabs();
    renderBrief();
    renderScoreboard();
  }
  boot();

  window.addEventListener("itbasics:auth", async function () {
    passed = await loadPassed();
    renderTabs();
    renderBrief();
    renderScoreboard();
  });
})();
