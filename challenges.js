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

  // The two faces the Face swap challenge swaps in. Written as escapes so this
  // file stays plain ASCII: an emoji glyph sitting in the source is one bad
  // save or one copy-paste through the wrong editor away from turning into
  // question marks, and it would take the challenge's answer with it.
  const FACE_SMILE = "\uD83D\uDE42";   // U+1F642 slightly smiling face
  const FACE_FROWN = "\uD83D\uDE41";   // U+1F641 slightly frowning face

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
      id: "indoor",
      tier: "beginner",
      title: "Indoor voice",
      brief: "Somebody is TYPING IN CAPITALS. Quieten them down.",
      detail: "Read a message with <code>input()</code>, then print it back in an indoor voice: all lowercase. Hint: <code>.upper()</code> has an opposite, and it is called <code>.lower()</code>.",
      accept: "Your output must contain the message in lowercase, and must not still have the shouty version in it. Anything that is not a letter, like a number, comes out unchanged.",
      starter:
        '# Indoor voice\n' +
        'message = input("SAY SOMETHING: ")\n' +
        '# print the message back quietly, all in lowercase\n',
      tests: [
        { label: 'They typed: "HELLO"',           inputs: ["HELLO"],           check: function (r) { return checkIndoor(r, "HELLO"); } },
        { label: 'They typed: "THIS IS IT BASICS"', inputs: ["THIS IS IT BASICS"], check: function (r) { return checkIndoor(r, "THIS IS IT BASICS"); } },
        { label: 'They typed: "HALLAM SECONDARY COLLEGE"', inputs: ["HALLAM SECONDARY COLLEGE"], check: function (r) { return checkIndoor(r, "HALLAM SECONDARY COLLEGE"); } },
        { label: 'They typed: "50"  (nothing to quieten)', inputs: ["50"],      check: function (r) { return checkIndoor(r, "50"); } }
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
      accept: 'Your output must say "Even" for even numbers and "Odd" for odd ones, not both.',
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
      detail: "Read an age with <code>input()</code> (remember <code>input()</code> gives text, so convert with <code>int()</code>). PG-13 films are for ages <strong>13 and over</strong>.",
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
    {
      // The "Making Decisions" module task. Same idea as Age checker, but it
      // records under its own quiz_name (recordAs) so passing it counts towards
      // completing the Making Decisions module (see progress.js / teacher.js).
      // It is embedded on /topics/decisions/ via window.CHALLENGE_ONLY.
      id: "decisions-age",
      tier: "beginner",
      module: "decisions",
      recordAs: "decisions-task",
      title: "Old enough to sign up?",
      brief: "Use if / else to decide if someone is old enough to sign up.",
      detail: "Read an age with <code>int(input(...))</code>. Our app is for ages <strong>13 and over</strong>. Use an <code>if</code> / <code>else</code> with <code>&gt;=</code>, and <strong>print a message to the user either way</strong>: one that lets them in, or one that turns them away.",
      accept: 'Age 13 or more: print a clear yes, and <code>print("you can sign up")</code> is exactly the kind of line that passes. Under 13: print a clear no, like <code>print("you can\'t sign up")</code> or "too young".',
      starter:
        '# Old enough to sign up?\n' +
        'age = int(input("How old are you? "))\n' +
        '# Our app is for ages 13 and over.\n' +
        '# Use if / else to allow them or turn them away.\n',
      tests: [
        { label: "Age 15 (allowed)", inputs: ["15"], check: function (r) { return checkAge(r, true); } },
        { label: "Age 13 (allowed, boundary)", inputs: ["13"], check: function (r) { return checkAge(r, true); } },
        { label: "Age 12 (refused, boundary)", inputs: ["12"], check: function (r) { return checkAge(r, false); } },
        { label: "Age 8 (refused)", inputs: ["8"], check: function (r) { return checkAge(r, false); } }
      ]
    },
    {
      // The "Variables" module task, embedded on /topics/variables/. Three
      // runs with different names force the program to actually USE its
      // variables: hardcoded prints can't match every run.
      id: "variables-nametag",
      tier: "beginner",
      module: "variables",
      recordAs: "variables-task",
      title: "The name tag maker",
      brief: "Store what the user types in variables, then use them to print a name tag.",
      detail: "Ask for a <strong>name</strong> and a <strong>favourite animal</strong> with <code>input()</code>, storing each in its own variable. Then print two lines that use them: a greeting with the name, and a line that says what they love. The robot tests it with different people, so the variables have to do the work.",
      accept: 'With name Sam and animal dogs, printing "Hello Sam!" and then "Sam loves dogs" passes. Any friendly wording works, as long as the output uses whatever was typed.',
      starter:
        '# The name tag maker\n' +
        'name = input("What is your name? ")\n' +
        '# 1. ask for their favourite animal, store it in a variable\n' +
        '# 2. print a greeting that uses name\n' +
        '# 3. print a line that uses BOTH variables\n',
      tests: [
        { label: "Sam who loves dogs", inputs: ["Sam", "dogs"], check: function (r) { return checkNametag(r, "Sam", "dogs"); } },
        { label: "Aisha who loves cats", inputs: ["Aisha", "cats"], check: function (r) { return checkNametag(r, "Aisha", "cats"); } },
        { label: "Rex who loves turtles", inputs: ["Rex", "turtles"], check: function (r) { return checkNametag(r, "Rex", "turtles"); } }
      ]
    },
    {
      // The "Strings" module task, embedded on /topics/strings/. Again the
      // robot varies the word so string tools, not fixed text, must be used.
      id: "strings-shout",
      tier: "beginner",
      module: "strings",
      recordAs: "strings-task",
      title: "The word machine",
      brief: "Read a word, then shout it, stretch it, and count it.",
      detail: "Ask for a <strong>word</strong> with <code>input()</code>. Then print three lines: the word <strong>shouted</strong> (<code>.upper()</code> with a <code>\"!\"</code>), the word repeated <strong>three times</strong> stuck together (<code>word * 3</code>), and <strong>how many letters</strong> it has (<code>len(word)</code>).",
      accept: 'For cat: a line with <code>CAT</code>, a line with <code>catcatcat</code>, and the number <code>3</code> somewhere. The robot tries other words too.',
      starter:
        '# The word machine\n' +
        'word = input("Give me a word: ")\n' +
        '# 1. print it SHOUTED: word.upper() plus a "!"\n' +
        '# 2. print it three times stuck together: word * 3\n' +
        '# 3. print how many letters it has: len(word)\n',
      tests: [
        { label: "cat", inputs: ["cat"], check: function (r) { return checkWordMachine(r, "cat"); } },
        { label: "python", inputs: ["python"], check: function (r) { return checkWordMachine(r, "python"); } },
        { label: "banana", inputs: ["banana"], check: function (r) { return checkWordMachine(r, "banana"); } }
      ]
    },
    {
      // Loops module, "for" task. Same grader as Countdown, but tagged with a
      // module + its own recordAs so passing it is one quarter of the Loops
      // module. Embedded on /topics/loops/ via a .module-task wrapper.
      id: "loops-for",
      tier: "beginner",
      module: "loops",
      recordAs: "loops-for-task",
      title: "Countdown with a for loop",
      brief: "Use a for loop to count down from 5, then blast off.",
      detail: "Use a <code>for</code> loop with <code>range</code> to print <strong>5, 4, 3, 2, 1</strong> (each on its own line), then print <strong>GO!</strong> after the loop. Hint: <code>range(5, 0, -1)</code> counts from 5 down to 1.",
      accept: "Your output must contain 5, 4, 3, 2, 1 and the word GO.",
      starter:
        '# Countdown with a for loop\n' +
        'for i in range(5, 0, -1):\n' +
        '    # print each number\n' +
        '    pass\n' +
        '# after the loop, print GO!\n',
      tests: [
        { label: "Counts down to GO", inputs: [], check: checkCountdown }
      ]
    },
    {
      // Loops module, "while" task. Same grader as the Guessing game, with its
      // own module + recordAs so passing it is the other quarter of the module.
      id: "loops-while",
      tier: "beginner",
      module: "loops",
      recordAs: "loops-while-task",
      title: "Guess the number with a while loop",
      brief: "Use a while loop to keep asking until the guess is right.",
      detail: "The computer hides a number from 1 to 10. Read a guess with <code>int(input(...))</code>, then use a <code>while</code> loop to keep asking <em>while</em> the guess is wrong. When it finally matches, print a success message like <code>Correct!</code>.",
      accept: "Your program must keep asking for a guess until one matches the secret, then print a success word (correct / well done / got it / you win). A wrong guess should lead to another guess.",
      starter:
        '# Guess the number (while loop)\n' +
        'import random\n' +
        '\n' +
        'secret = random.randint(1, 10)   # the hidden number, 1 to 10\n' +
        '\n' +
        '# 1) Read a first guess:  guess = int(input("Your guess: "))\n' +
        '# 2) while guess != secret:  say "wrong", then ask again\n' +
        '# 3) when guess == secret, print "Correct!"\n',
      tests: [
        { label: "Secret 7 - guesses 3, 1, 7",   forceSecret: 7, inputs: ["3", "1", "7"], check: checkGuess },
        { label: "Secret 2 - guesses 5, 2",      forceSecret: 2, inputs: ["5", "2"],      check: checkGuess },
        { label: "Secret 4 - guessed first try", forceSecret: 4, inputs: ["4"],           check: checkGuess }
      ]
    },
    {
      // Codes & Colour module task, embedded on /topics/codes/. input +
      // if/else + the col= colour print, verified across two runs: answering
      // "favourite" and "least" must produce two DIFFERENT colours.
      id: "codes-hello",
      tier: "beginner",
      module: "codes",
      recordAs: "codes-task",
      title: "Hello World, in YOUR colours",
      brief: "Ask favourite or least favourite, then print Hello World in a matching colour.",
      detail: 'Ask the user with <code>input()</code>: do they want your <strong>favourite</strong> or your <strong>least</strong> favourite colour? If they answer <code>favourite</code>, print <strong>Hello World</strong> in a colour you love. Otherwise print it in a colour you can\'t stand. Colour any print with <code>col=</code>, like <code>print("Hello World", col="#FF8800")</code>. Colour names work too (<code>col="hotpink"</code>), and the <a href="/topics/codes/#colour">colour mixer</a> is full of hex codes.',
      accept: 'Answering favourite prints Hello World in one colour; answering least prints it in a DIFFERENT colour. Any two colours you like, as long as they differ.',
      starter:
        '# Hello World, in YOUR colours\n' +
        'answer = input("Favourite or least favourite? ")\n' +
        '\n' +
        '# if the answer is "favourite":\n' +
        '#     print Hello World in a colour you love\n' +
        '# else:\n' +
        "#     print it in a colour you can't stand\n" +
        '# colour a print like this:  print("Hello World", col="#FF8800")\n',
      tests: [
        { label: 'Answering "favourite"', inputs: ["favourite"], check: function (r) { return checkHelloColour(r, "favourite"); } },
        { label: 'Answering "least"',     inputs: ["least"],     check: function (r) { return checkHelloColour(r, "least"); } }
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
      id: "faces",
      tier: "intermediate",
      title: "Face swap",
      brief: "Turn typed-out faces like :) into real emoji, the way a chat app does.",
      detail: 'Long before emoji, people made faces out of punctuation: <code>:)</code> was happy and <code>:(</code> was sad. Chat apps now swap them for you as you type. Read a message with <code>input()</code>, turn every <code>:)</code> into ' + FACE_SMILE +
        ' and every <code>:(</code> into ' + FACE_FROWN + ', then print it. The two faces are already in the starter code as <code>SMILE</code> and <code>FROWN</code>, so you never have to type an emoji yourself. Hint: <code>.replace(old, new)</code> swaps every copy it finds.',
      accept: 'Every <code>:)</code> comes out as ' + FACE_SMILE + ' and every <code>:(</code> as ' + FACE_FROWN +
        ', the rest of the message is unchanged, and no <code>:)</code> or <code>:(</code> is left behind. A message with no faces in it must come out exactly as it went in.',
      starter:
        '# Face swap\n' +
        'SMILE = "' + FACE_SMILE + '"\n' +
        'FROWN = "' + FACE_FROWN + '"\n' +
        '\n' +
        'message = input("Your message: ")\n' +
        '# swap every :) for SMILE and every :( for FROWN, then print the message\n',
      tests: [
        { label: 'Message: "hi :)"',            inputs: ["hi :)"],            check: function (r) { return checkFaces(r, "hi :)"); } },
        { label: 'Message: "lost my homework :("', inputs: ["lost my homework :("], check: function (r) { return checkFaces(r, "lost my homework :("); } },
        { label: 'Message: "test today :( party after :)"', inputs: ["test today :( party after :)"], check: function (r) { return checkFaces(r, "test today :( party after :)"); } },
        { label: 'Message: "yes :) yes :) yes :)"', inputs: ["yes :) yes :) yes :)"], check: function (r) { return checkFaces(r, "yes :) yes :) yes :)"); } },
        { label: 'Message: "no faces in this one"', inputs: ["no faces in this one"], check: function (r) { return checkFaces(r, "no faces in this one"); } }
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
      detail: "The computer hides the number, and the player has to find it." +
        '<ol class="challenge-steps">' +
        "<li>Pick the secret with <code>random.randint(1, 10)</code>.</li>" +
        "<li>Ask for a guess with <code>input()</code>, and convert it to a number with <code>int()</code> so you can compare it.</li>" +
        "<li>Use a loop: <em>while</em> the guess is wrong, tell them and ask again.</li>" +
        "<li>When the guess matches the secret, print a success message like <code>Correct!</code>.</li>" +
        "</ol>",
      accept: "Your program must keep asking for a guess until one matches the secret, then print a success word (correct / well done / got it / you win). A wrong guess should lead to another guess, not stop the program.",
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
    },
    {
      // The only challenge whose starter is a program the student joins rather
      // than writes: main() is finished and calls two functions that are not.
      // The stubs return 0.0 so the starter RUNS from the first click. An empty
      // "# TODO" body is a SyntaxError, and a red error before you have typed
      // anything is a rotten first impression of functions.
      id: "fete-discount",
      tier: "stretch",
      title: "Fete stall discount",
      brief: "Finish two small functions so the fete price board works out the discount.",
      detail: "Your stall at the Hallam fete has a sale on. The price comes in as text like <code>$12.50</code> and the discount as text like <code>20%</code>, and neither can be multiplied while it still has that symbol stuck to it. " +
        "<code>main()</code> is already written and calls two functions that are not: <code>dollars_to_float</code> must take <code>\"$12.50\"</code> and give back the number <code>12.5</code>, and <code>percent_to_float</code> must take <code>\"20%\"</code> and give back <code>0.2</code>. " +
        "Hint: <code>text[1:]</code> is everything after the first character, <code>text[:-1]</code> is everything before the last one, and <code>float()</code> turns what is left into a number.",
      accept: "Both printed amounts must be right, to the cent. Remember 20% off means 0.2 of the price, not 20 times it.",
      starter:
        '# Fete stall discount\n' +
        '# main() is finished. Fill in the two functions underneath it.\n' +
        '\n' +
        'def main():\n' +
        '    price = dollars_to_float(input("Price on the tag? "))\n' +
        '    percent = percent_to_float(input("How much off? "))\n' +
        '    saving = price * percent\n' +
        '    print(f"You save ${saving:.2f}")\n' +
        '    print(f"You pay ${price - saving:.2f}")\n' +
        '\n' +
        '\n' +
        'def dollars_to_float(d):\n' +
        '    # d arrives as "$12.50". Give back the number 12.5\n' +
        '    return 0.0\n' +
        '\n' +
        '\n' +
        'def percent_to_float(p):\n' +
        '    # p arrives as "20%". Give back the number 0.2\n' +
        '    return 0.0\n' +
        '\n' +
        '\n' +
        'main()\n',
      tests: [
        { label: '$50.00, 20% off  -> save $10.00, pay $40.00', inputs: ["$50.00", "20%"],  check: function (r) { return checkFete(r, 50, 0.2); } },
        { label: '$12.50, 10% off  -> save $1.25, pay $11.25',  inputs: ["$12.50", "10%"],  check: function (r) { return checkFete(r, 12.5, 0.1); } },
        { label: '$8.00, 25% off   -> save $2.00, pay $6.00',   inputs: ["$8.00", "25%"],   check: function (r) { return checkFete(r, 8, 0.25); } },
        { label: '$100.00, 5% off  -> save $5.00, pay $95.00',  inputs: ["$100.00", "5%"],  check: function (r) { return checkFete(r, 100, 0.05); } }
      ]
    }
  ];

  // Hand-holding hints, appended into the editor as comments by the Hint
  // button. Year 7 depth: the last line is one inch from the answer. Each
  // entry is an array of lines; the engine prefixes "# " and a header.
  const CHALLENGE_HINTS = {
    "greeter": [
      "we are looking for print()",
      "the typed name is saved in the variable called name",
      "a comma joins things inside a print",
      'print("Hello,", name)'
    ],
    "shout": [
      "word.upper() gives the word in CAPITALS",
      "we want to print that",
      "print(word.upper())"
    ],
    "indoor": [
      "message.lower() gives the quiet version",
      "we want to print that",
      "print(message.lower())"
    ],
    "double": [
      "double means times 2, and times is *",
      "we are looking for print()",
      "print(n * something)"
    ],
    "add-two": [
      "we are looking for print()",
      "then inside the brackets something + something",
      "what variables do we want to add together?",
      "print(something + something)"
    ],
    "countdown": [
      "easiest way: five prints, then GO",
      "print(5) then print(4) ... down to print(1)",
      'then print("GO!")',
      "fancy way: for i in range(5, 0, -1): with print(i) indented under it"
    ],
    "even-odd": [
      "n % 2 gives the remainder after dividing by 2",
      "even numbers have remainder 0",
      'if n % 2 == 0: print("Even")',
      'else: print("Odd")'
    ],
    "letter-count": [
      "len(word) counts the letters",
      "we want to print that number",
      "print(len(word))"
    ],
    "age": [
      "13 and over means age >= 13",
      'if age >= 13: print("You can watch it!")',
      'else: print("Too young, sorry")'
    ],
    "decisions-age": [
      "13 and over means age >= 13",
      'if age >= 13: print a message that lets them in',
      "else: print a message that turns them away"
    ],
    "variables-nametag": [
      'animal = input("Favourite animal? ")',
      'print("Hello " + name + "!")',
      'print(name + " loves " + animal)'
    ],
    "strings-shout": [
      'print(word.upper() + "!")',
      "print(word * 3)",
      "print(len(word))"
    ],
    "loops-for": [
      "range(5, 0, -1) counts 5, 4, 3, 2, 1",
      "inside the loop, print(i)",
      'AFTER the loop (no indent), print("GO!")'
    ],
    "loops-while": [
      'first read a guess: guess = int(input("Your guess: "))',
      "while guess != secret: means keep going while it's wrong",
      'inside the loop: print("Wrong!") then guess = int(input("Guess again: "))',
      'after the loop: print("Correct!")'
    ],
    "codes-hello": [
      'if answer == "favourite":',
      '    print("Hello World", col="#00FF00")',
      "else: print it again with a DIFFERENT colour",
      "any two colours work, as long as they're different"
    ],
    "times": [
      "a loop can count 1 to 12: for i in range(1, 13):",
      "inside the loop we print one row of the table",
      "print(n * i)"
    ],
    "sum-to-n": [
      "make a total that starts at 0: total = 0",
      "for i in range(1, n + 1): visits every number",
      "inside the loop: total = total + i",
      "after the loop: print(total)"
    ],
    "multiples": [
      "for i in range(1, 6): counts 1, 2, 3, 4, 5",
      "inside the loop, print(n * i)"
    ],
    "biggest3": [
      "the shortcut: max() picks the biggest of whatever you give it",
      "print(max(a, b, c))"
    ],
    "vowels": [
      "make a counter: count = 0",
      "for letter in word: looks at each letter in turn",
      'if letter in "aeiou": count = count + 1',
      "after the loop: print(count)",
      "capitals tricky? use word.lower() first"
    ],
    "reverse": [
      "the slice trick [::-1] reverses a word",
      "print(word[::-1])"
    ],
    "faces": [
      '.replace(old, new) swaps every copy it finds',
      'replace hands you back a NEW message, so you have to save it',
      'message = message.replace(":)", SMILE)',
      'now the same line again for ":(" and FROWN',
      "then print(message)"
    ],
    "fizz": [
      "for i in range(1, n + 1): visits 1 up to n",
      "a multiple of 3 has remainder 0: i % 3 == 0",
      'if i % 3 == 0: print("Fizz")',
      "else: print(i)"
    ],
    "guess": [
      'read the first guess: guess = int(input("Your guess: "))',
      "while guess != secret:",
      '    print("Wrong!")',
      '    guess = int(input("Guess again: "))',
      'after the loop: print("Correct!")'
    ],
    "fizzbuzz": [
      "check BOTH first, because 15 is a multiple of 3 and 5",
      'if i % 15 == 0: print("FizzBuzz")',
      'elif i % 3 == 0: print("Fizz")',
      'elif i % 5 == 0: print("Buzz")',
      "else: print(i)"
    ],
    "palindrome": [
      "word[::-1] is the word backwards",
      "a palindrome means word == word[::-1]",
      'if word == word[::-1]: print("Palindrome")',
      'else: print("Not a palindrome")'
    ],
    "password": [
      'read one answer first: pw = input("Password? ")',
      'while pw != "hallam": keep asking',
      '    pw = input("Password? ")',
      'after the loop: print("Welcome!")'
    ],
    "sum-many": [
      'line.split() chops "3 7 12" into ["3", "7", "12"]',
      "make a total = 0, then loop: for piece in line.split():",
      "    total = total + int(piece)",
      "after the loop: print(total)"
    ],
    "fete-discount": [
      'd arrives as "$12.50", and d[1:] is that without the dollar sign',
      "float() turns the leftover text into a number",
      "return float(d[1:])",
      'p arrives as "20%", and p[:-1] is that without the percent sign',
      "20% means 20 out of 100, so divide by 100",
      "return float(p[:-1]) / 100"
    ]
  };

  // Every quiz_name a challenge pass can be saved under. Most save under
  // "livecoding"; module-linked tasks add their own (e.g. "decisions-task").
  // loadPassed() reads all of these so ticks show up wherever a challenge runs.
  const RECORD_NAMES = (function () {
    const set = { livecoding: true };
    CHALLENGES.forEach(function (c) { if (c.recordAs) set[c.recordAs] = true; });
    return Object.keys(set);
  })();

  // Challenges tagged with a "module" belong to that module's page (embedded via
  // window.CHALLENGE_ONLY) and are hidden from the public Live Coding tab list
  // and scoreboard. Everything else is a free-play challenge.
  const PUBLIC_CHALLENGES = CHALLENGES.filter(function (c) { return !c.module; });

  // Lightweight catalog (id/title/tier) of the public Live Coding challenges,
  // exposed so other pages (e.g. the teacher export) can list them without
  // duplicating the definitions. Set early, before any DOM lookups bail out.
  try {
    window.ITBASICS_CHALLENGE_CATALOG = PUBLIC_CHALLENGES.map(function (c) {
      return { id: c.id, title: c.title, tier: c.tier };
    });
  } catch (e) {}

  // ---- Grading checks -------------------------------------------------------
  function norm(s) { return String(s || "").toLowerCase(); }
  function pass(why) { return { pass: true, why: why || "Looks good." }; }
  function fail(why) { return { pass: false, why: why }; }

  // Variables module: the output must use both typed-in values, and one line
  // must combine them. Different names across the test runs stop hardcoding.
  function checkNametag(r, name, animal) {
    if (r.error) return fail("Your code stopped with an error: " + r.error);
    const out = String(r.output || "");
    if (out.indexOf(name) === -1) {
      return fail('I could not find the name "' + name + '" in your output. Print the variable, not a fixed word.');
    }
    if (out.indexOf(animal) === -1) {
      return fail('I could not find "' + animal + '" in your output. Store the animal in a variable and print it too.');
    }
    const together = out.split("\n").some(function (l) {
      return l.indexOf(name) !== -1 && l.indexOf(animal) !== -1;
    });
    if (!together) {
      return fail("One line should use BOTH variables together, like: " + name + " loves " + animal);
    }
    return pass("Name tag printed, variables doing the work.");
  }

  // Strings module: shout with .upper(), stretch with * 3, count with len().
  function checkWordMachine(r, w) {
    if (r.error) return fail("Your code stopped with an error: " + r.error);
    const out = String(r.output || "");
    if (out.indexOf(w.toUpperCase()) === -1) {
      return fail("I could not find " + w.toUpperCase() + " (the word in capitals). Shout it with word.upper().");
    }
    if (norm(out).indexOf(w + w + w) === -1) {
      return fail('I could not find "' + (w + w + w) + '". Stretch it with word * 3.');
    }
    if (!new RegExp("\\b" + w.length + "\\b").test(out)) {
      return fail("I could not find the number " + w.length + " (how many letters). Count them with len(word).");
    }
    return pass("Shouted, stretched and counted. The word machine works.");
  }

  // The Hello World colour task compares colours ACROSS its two test runs:
  // the "favourite" run records its colour, the "least" run must differ.
  // Tests always run in order within one Check, so this is safe.
  var helloColourSeen = null;
  function checkHelloColour(r, mode) {
    if (r.error) return fail("Your program hit an error: " + r.error);
    if (!/hello[\s,!]*world/i.test(String(r.output))) {
      return fail('I need to see "Hello World" in the output.');
    }
    var cols = (r.colors || []).map(function (c) {
      return String(c).trim().toLowerCase();
    }).filter(Boolean);
    if (!cols.length) {
      return fail('Hello World has no colour yet. Print it with col=, like print("Hello World", col="#FF8800").');
    }
    var last = cols[cols.length - 1];
    if (mode === "favourite") {
      helloColourSeen = last;
      return pass("Hello World in " + last + ". Nice choice.");
    }
    if (helloColourSeen !== null && last === helloColourSeen) {
      return fail("Both answers came out in the SAME colour (" + last + "). favourite and least favourite need two different colours: that's what the if / else is for.");
    }
    return pass("Two answers, two colours. That's an if / else doing its job.");
  }
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

  // The mirror of checkShout. The second test is the interesting one: printing
  // the message straight back passes for "50", which has no capitals to lose,
  // so every other case also insists the SHOUTY original is gone.
  function checkIndoor(r, message) {
    if (r.error) return fail("Your code stopped with an error: " + r.error);
    const out = String(r.output || "");
    const quiet = message.toLowerCase();
    if (out.indexOf(quiet) === -1) {
      return fail('I typed "' + message + '" but I didn\'t see "' + quiet + '" in the output. Try the .lower() method.');
    }
    if (quiet !== message && out.indexOf(message) !== -1) {
      return fail("The shouty version is still in your output. Print only the quiet one.");
    }
    return pass(quiet === message ? "Nothing to quieten, and it came through unchanged." : '"' + message + '" said quietly.');
  }

  // Face swap. The expected line is built the same way the student's code
  // should build it, so the whole message has to survive, not just the faces.
  function checkFaces(r, message) {
    if (r.error) return fail("Your code stopped with an error: " + r.error);
    const out = String(r.output || "");
    const want = message.split(":)").join(FACE_SMILE).split(":(").join(FACE_FROWN);
    if (out.indexOf(want) !== -1) {
      return pass(want === message ? "No faces in that one, and it came through untouched." : "Swapped to: " + want);
    }
    // Swapping the two over leaves both faces present, so spotting it needs the
    // back-to-front line built and compared, not a hunt for a missing emoji.
    const backwards = message.split(":)").join(FACE_FROWN).split(":(").join(FACE_SMILE);
    if (backwards !== want && out.indexOf(backwards) !== -1) {
      return fail("The faces came out the wrong way round: :) is the happy one, :( is the sad one.");
    }
    // A face still sitting there in punctuation form. Two different mistakes
    // land here, missing that face's .replace() and writing it without saving
    // the result, and a single run cannot tell them apart: a message with only
    // a :( in it comes out identical either way. So name the face that is left
    // and point at both causes rather than guessing at one.
    const stillHappy = message.indexOf(":)") !== -1 && out.indexOf(":)") !== -1;
    const stillSad   = message.indexOf(":(") !== -1 && out.indexOf(":(") !== -1;
    if (stillHappy || stillSad) {
      const which = (stillHappy && stillSad) ? ":) and :(" : (stillHappy ? ":)" : ":(");
      const shown = stillHappy ? '":)", SMILE' : '":(", FROWN';
      return fail("There is still a " + which + " in your output. Check that face has a .replace() of its own, " +
        "and that you SAVED what it handed back: message = message.replace(" + shown + ")");
    }
    if (message.indexOf(":)") !== -1 && out.indexOf(FACE_SMILE) === -1) {
      return fail("That message had a :) in it, but no " + FACE_SMILE + " came out. Swap it for SMILE.");
    }
    if (message.indexOf(":(") !== -1 && out.indexOf(FACE_FROWN) === -1) {
      return fail("That message had a :( in it, but no " + FACE_FROWN + " came out. Swap it for FROWN.");
    }
    return fail("I expected this line: " + want + "  ...but I didn't find it. The rest of the message has to come out unchanged.");
  }

  // Fete stall discount. Only the two printed amounts are graded: main() is
  // given, so a wrong total means one of the two conversions is wrong, and the
  // two usual wrong answers (symbol left on, percent not divided) get named.
  function checkFete(r, price, percent) {
    if (r.error) {
      if (/could not convert string to float/.test(r.error)) {
        return fail("Your code stopped: " + r.error +
          '  (Hint: float() cannot read the $ or the %. Chop the symbol off first with d[1:] or p[:-1].)');
      }
      return fail("Your code stopped: " + r.error);
    }
    const out = String(r.output || "");
    const saving = price * percent;
    const money = (out.match(/\d+\.\d\d/g) || []);
    const has = function (v) {
      const want = v.toFixed(2);
      return money.indexOf(want) !== -1;
    };
    if (has(saving) && has(price - saving)) {
      return pass("$" + price.toFixed(2) + " less " + Math.round(percent * 100) + "% is $" + (price - saving).toFixed(2) + ".");
    }
    if (has(price * percent * 100)) {
      return fail("Your discount is 100 times too big. " + Math.round(percent * 100) +
        "% means " + Math.round(percent * 100) + " out of 100, so percent_to_float has to divide by 100.");
    }
    if (money.indexOf("0.00") !== -1) {
      return fail("Everything came out as $0.00, so the two functions are still handing back the 0.0 they started with. Give back the real numbers instead.");
    }
    return fail("Expected to see $" + saving.toFixed(2) + " saved and $" + (price - saving).toFixed(2) +
      " to pay, but I saw " + (money.length ? "$" + money.join(", $") : "no amounts at all") + ".");
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
    if (sawEven && sawOdd) return fail("You printed both \"Even\" and \"Odd\", only print one.");
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

    # Colour-aware print: records every col=/color= value so graders can
    # check WHICH colours a program used, while the text still lands in the
    # captured stdout like a normal print.
    colors = []
    def _student_print(*args, col=None, color=None, sep=" ", end="\\n", file=None, flush=False):
        chosen = col if col is not None else color
        if chosen is not None:
            colors.append(str(chosen))
        builtins.print(*args, sep=sep, end=end, file=file, flush=flush)

    err = None
    g = {"__name__": "__main__", "print": _student_print}
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
        "colors": colors,
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

  // The col= keyword on print(), same as the sandbox, so colour challenges
  // behave identically under the interactive Run button. Graded runs use
  // their own print wrapper inside _run_student instead.
  const PY_INSTALL_COLOR_PRINT = `
def _sandbox_install_color_print():
    import sys, builtins
    from _sandbox_io import writeColored
    real_print = builtins.print
    def print(*args, col=None, color=None, sep=' ', end='\\n', file=None, flush=False):
        chosen = col if col is not None else color
        if chosen is not None and file is None:
            sys.stdout.flush()
            sys.stderr.flush()
            text = sep.join(str(a) for a in args) + end
            writeColored(text, str(chosen))
        else:
            real_print(*args, sep=sep, end=end, file=file, flush=flush)
    builtins.print = print
_sandbox_install_color_print()
del _sandbox_install_color_print
`;

  // ---- Shared across the editor instances on a page -------------------------
  // A page can host more than one editor (e.g. the Loops module has a "for" task
  // and a "while" task). Pyodide, the saved-code map and the passed set are
  // shared so the runtime boots only once and the two editors can't clobber each
  // other's saved code. `active` is whichever instance is currently running, so
  // the single set of stdout/stderr/input callbacks routes to the right panel.
  let pyodide = null;
  let loadingPromise = null;
  let active = null;
  let pageBusy = false;
  let codeMap = null;
  const passed = new Set();

  // ---- Pyodide bootstrap (shared, hoisted above createApp) ------------------
  // Kept at IIFE scope so the read-only snippet runner (window.ITCode, below)
  // works even on lesson pages with no coding task at all, e.g. Programming /
  // Python Basics, which only run inline snippets.
  function jspiSupported() {
    return typeof WebAssembly !== "undefined" && typeof WebAssembly.Suspending === "function";
  }
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
  // `announce` is an optional callback run once, just before the (one-time) load
  // begins, so a calling editor can show its own "Loading Python…" state. The
  // snippet runner passes nothing.
  async function ensurePyodide(announce) {
    if (pyodide) return pyodide;
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async function () {
      if (typeof announce === "function") announce();
      await loadPyodideScript();
      pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/"
      });
      pyodide.setStdout({ batched: function (s) { if (active) active.appendOut(s, "stdout"); } });
      pyodide.setStderr({ batched: function (s) { if (active) active.appendOut(s, "stderr"); } });
      pyodide.registerJsModule("_sandbox_io", {
        readLine: function (p) { return active ? active.readLine(p) : Promise.resolve(""); },
        writeColored: function (text, color) {
          if (active && active.writeColored) active.writeColored(text, color);
        }
      });
      await pyodide.runPythonAsync(jspiSupported() ? PY_INSTALL_INPUT : PY_DISABLE_INPUT);
      await pyodide.runPythonAsync(PY_INSTALL_COLOR_PRINT);
      pyodide.runPython(PY_RUNNER);
      return pyodide;
    })();
    return loadingPromise;
  }

  // Tiny shared runner for read-only lesson snippets (snippet-run.js): reuses the
  // shared Pyodide + sandboxed grader behind the same page lock, so a snippet and
  // a coding task never execute at once. Registered as soon as this script loads,
  // independent of whether the page has an editor.
  if (!window.ITCode) {
    window.ITCode = {
      run: async function (code, inputs) {
        if (pageBusy) return { error: "Busy, let the current run finish, then try again." };
        pageBusy = true; active = null;
        try {
          const py = await ensurePyodide();
          py.globals.set("_code", String(code));
          py.globals.set("_inputs", JSON.stringify(inputs || []));
          py.globals.set("_force", "null");
          return JSON.parse(py.runPython("_run_student(_code, _inputs, _force)"));
        } finally {
          pageBusy = false;
        }
      }
    };
  }

  // One editor instance, scoped to `root`: the whole document on the standalone
  // Live Coding page (and single-embed pages), or one .module-task wrapper for a
  // task embedded in a lesson. Lookups prefer the legacy ids, then fall back to
  // classes so several instances can coexist without duplicate ids.
  function createApp(root, onlyId) {
    function q(sel) { return root.querySelector(sel); }
    const editor      = q("#challenge-code") || q(".sandbox-code");
    const output      = q("#challenge-output") || q(".sandbox-out-body");
    const runBtn      = q("#challenge-run") || q(".challenge-run");
    const runLabel    = runBtn ? runBtn.querySelector(".challenge-run-label") : null;
    const checkBtn    = q("#challenge-check") || q(".challenge-check");
    const checkLabel  = checkBtn ? checkBtn.querySelector(".challenge-check-label") : null;
    const resetBtn    = q(".challenge-reset");
    const clearBtn    = q(".challenge-clear");
    const tabsEl      = q("#challenge-tabs");
    const briefEl     = q("#challenge-brief") || q(".challenge-brief");
    const resultsEl   = q("#challenge-results") || q(".challenge-results");
    const scoreboardEl = q("#challenge-scoreboard");
    const fileEl      = q("#challenge-file") || q(".sandbox-editor .sandbox-title");

    if (!editor || !runBtn || !checkBtn) return;

    if (codeMap === null) codeMap = loadCodeMap();
    let jar = null;
    let busy = false;
    /* Set while a run is blocked on input(), so Clear can get the student out.
       Clearing the output wipes the DOM node holding the input box, and
       without this the run would sit awaiting a promise that can never
       resolve, with Run disabled and no way back except reloading the page
       and losing their code. */
    let pendingInput = null;
    // onlyId pins this instance to one challenge (embedded task or single embed);
    // the standalone page passes null and starts on the first challenge, or on
    // the challenge named in the URL hash (used by homework links).
    let current = (onlyId && challengeById(onlyId)) ||
      (!onlyId && location.hash && challengeById(decodeURIComponent(location.hash.slice(1)))) ||
      CHALLENGES[0];
    // Routing handle for the shared stdout/stderr/input callbacks.
    const io = { appendOut: appendOut, readLine: readLineInteractive, writeColored: writeColored };

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

  // Coloured text from print(col=...) during interactive runs.
  function writeColored(text, color) {
    const span = document.createElement("span");
    span.style.color = String(color || "");
    span.textContent = String(text);
    output.appendChild(span);
    output.scrollTop = output.scrollHeight;
  }

  function readLineInteractive(promptText) {
    return new Promise(function (resolve, reject) {
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

      pendingInput = function () {
        pendingInput = null;
        field.removeEventListener("input", resize);
        field.removeEventListener("keydown", onKey);
        const err = new Error("Stopped");
        err.itStopped = true;
        reject(err);
      };

      function onKey(e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const value = field.value;
        pendingInput = null;
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
  // Pyodide bootstrap (jspiSupported / loadPyodideScript / ensurePyodide) and the
  // shared window.ITCode snippet runner now live at the top of the IIFE, above
  // createApp, so read-only lesson snippets can run on pages with no coding task.


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
    if (busy || pageBusy) return;
    busy = true; pageBusy = true; active = io;
    clearOut();
    setRunLabel("Running…", true);
    setCheckBusy(true, "Check");
    try {
      const py = await ensurePyodide(function () {
        setRunLabel("Loading Python…", true);
        appendOut("Loading Python runtime (one-time, ~10 MB)…", "info");
        setCheckBusy(true, "Loading…");
      });
      // Fresh namespace each run so a previous run's variables can't linger
      // (the Check button already runs each attempt in a clean namespace).
      const ns = py.runPython("dict(__name__='__main__')");
      try {
        await py.runPythonAsync(getCode(), { globals: ns });
      } finally {
        ns.destroy();
      }
    } catch (err) {
      if (err && err.itStopped) appendOut("Stopped.", "info");
      else appendOut((err && err.message) ? err.message : String(err), "stderr");
    } finally {
      pendingInput = null;
      setRunLabel("Run", false);
      setCheckBusy(false);
      busy = false; pageBusy = false;
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
    if (busy || pageBusy) return;
    busy = true; pageBusy = true; active = io;
    setCheckBusy(true, "Checking…");
    setRunLabel("Run", true);
    renderResults(null); // clears
    const code = getCode();
    try {
      await ensurePyodide();
    } catch (err) {
      setCheckBusy(false);
      setRunLabel("Run", false);
      busy = false; pageBusy = false;
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
    busy = false; pageBusy = false;

    if (allPass && !passed.has(ch.id)) {
      passed.add(ch.id);
      renderTabs();
      renderScoreboard();
      if (window.ITBasics && window.ITBasics.getSession()) {
        // Module-linked tasks record under their own quiz_name (recordAs) so
        // they count towards that module; everything else is generic livecoding.
        window.ITBasics.saveAttempt(ch.recordAs || QUIZ_NAME, 1, 1, { challenge: ch.id, code: code });
      }
    }
    renderResults({ rows: rows, allPass: allPass, challenge: ch });
  }

  // ---- Rendering ------------------------------------------------------------
  function renderTabs() {
    if (!tabsEl) return; // embedded single-challenge mode has no tab strip
    tabsEl.innerHTML = "";
    const byTier = { beginner: [], intermediate: [], stretch: [] };
    PUBLIC_CHALLENGES.forEach(function (ch) {
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
    updateHintBtn();
  }

  // ---- Hint button (under the editor) ---------------------------------------
  // Appends the challenge's hand-holding hint into the editor as comments,
  // so the help stays with the student's code. One hint per challenge; the
  // button greys out while the hint block is in the editor.
  let hintBtn = null;
  (function initHintBtn() {
    const editorBox = editor.closest(".sandbox-editor");
    if (!editorBox) return;
    const row = document.createElement("div");
    row.className = "hint-row";
    hintBtn = document.createElement("button");
    hintBtn.type = "button";
    hintBtn.className = "btn btn-hint";
    hintBtn.textContent = "Hint?";
    row.appendChild(hintBtn);
    editorBox.appendChild(row);
    hintBtn.addEventListener("click", addHint);
    editor.addEventListener("keyup", updateHintBtn);
  })();

  function updateHintBtn() {
    if (!hintBtn) return;
    const lines = CHALLENGE_HINTS[current.id];
    hintBtn.parentNode.style.display = lines ? "" : "none";
    if (!lines) return;
    const used = getCode().indexOf("*** hint ***") !== -1;
    hintBtn.disabled = used;
    hintBtn.innerHTML = used
      ? 'Hint added below your code <span class="arrow down" aria-hidden="true"></span>'
      : "Hint?";
  }

  function addHint() {
    const lines = CHALLENGE_HINTS[current.id];
    if (!lines) return;
    if (getCode().indexOf("*** hint ***") !== -1) { updateHintBtn(); return; }
    const block = "\n\n# *** hint ***\n" +
      lines.map(function (l) { return "# " + l; }).join("\n") + "\n";
    const newCode = getCode().replace(/\s+$/, "") + block;
    setCode(newCode);
    codeMap[current.id] = newCode;
    saveCodeMap();
    editor.scrollTop = editor.scrollHeight;
    updateHintBtn();
  }
  function renderScoreboard() {
    if (!scoreboardEl) return; // embedded single-challenge mode has no scoreboard
    const total = PUBLIC_CHALLENGES.length;
    const done = PUBLIC_CHALLENGES.filter(function (c) { return passed.has(c.id); }).length;
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
        ? '🎉 Passed all ' + rows.length + ' tests, <strong>' + escapeHtml(state.challenge.title) + '</strong> complete!'
        : passCount + ' / ' + rows.length + ' tests passed, keep going!') +
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
    if (fileEl) fileEl.textContent = current.id + ".py";
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
          .eq("student_code", s.code).in("quiz_name", RECORD_NAMES);
        (res.data || []).forEach(function (r) {
          const c = r.answers && r.answers.challenge;
          if (c) out.add(c);
        });
      } catch (e) {}
    } else {
      RECORD_NAMES.forEach(function (name) {
        try {
          const arr = JSON.parse(localStorage.getItem("itbasics-attempts-" + s.code + "-" + name) || "[]");
          arr.forEach(function (a) { const c = a.answers && a.answers.challenge; if (c) out.add(c); });
        } catch (e) {}
      });
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
  if (clearBtn) clearBtn.addEventListener("click", function () {
    // Clearing while something waits for input ends the run rather than
    // stranding it. Cancel after clearing, so the "Stopped." note lands in
    // the freshly emptied panel instead of being wiped by it.
    const waiting = pendingInput;
    clearOut();
    if (waiting) waiting();
  });

  async function boot() {
    if (fileEl) fileEl.textContent = current.id + ".py";
    initEditor();
    renderTabs();
    renderBrief();
    renderScoreboard();
    (await loadPassed()).forEach(function (id) { passed.add(id); });
    renderTabs();
    renderBrief();
    renderScoreboard();
  }
  boot();

  window.addEventListener("itbasics:auth", async function () {
    passed.clear();
    (await loadPassed()).forEach(function (id) { passed.add(id); });
    renderTabs();
    renderBrief();
    renderScoreboard();
  });
  } // end createApp

  // Dispatch. A lesson can stack several embedded tasks (e.g. the Loops module's
  // "for" and "while" tasks), each in a .module-task[data-challenge] wrapper and
  // all sharing the single Pyodide runtime. Otherwise there is one page-wide app
  // for the standalone Live Coding page and single-embed module pages.
  const moduleTasks = document.querySelectorAll(".module-task[data-challenge]");
  if (moduleTasks.length) {
    Array.prototype.forEach.call(moduleTasks, function (wrap) {
      createApp(wrap, wrap.getAttribute("data-challenge"));
    });
  } else if (document.getElementById("challenge-code")) {
    createApp(document, window.CHALLENGE_ONLY || null);
  }
})();
