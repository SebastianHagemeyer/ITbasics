/*
 * Freeplay scenario bank.
 *
 * Each scenario has:
 *   id         unique key
 *   topic      python | html | logic | concept | errors
 *   difficulty easy | medium | hard
 *   prompt     the question text (plain text)
 *   code       optional code/HTML snippet, rendered as literal text in a <pre>
 *   options    4 multiple-choice options (plain text)
 *   answer     index of the correct option (0-3)
 *   explain    short reason shown after the student picks
 *   xp         optional XP override; anything without one is worth 1
 */
window.SCENARIOS = [
  // ======================================================================
  // PYTHON: arithmetic & numbers
  // ======================================================================
  { id: "py-001", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(5 + 3)",
    options: ["53", "8", "5+3", "Error"], answer: 1,
    explain: "+ adds the numbers: 5 + 3 = 8." },

  { id: "py-002", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(10 - 4)",
    options: ["6", "-6", "14", "104"], answer: 0,
    explain: "10 - 4 = 6." },

  { id: "py-003", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(6 * 4)",
    options: ["10", "24", "64", "46"], answer: 1,
    explain: "6 multiplied by 4 is 24." },

  { id: "py-004", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(15 / 4)",
    options: ["3", "3.75", "4", "3.5"], answer: 1,
    explain: "A single / always gives a decimal in Python. 15 / 4 = 3.75." },

  { id: "py-005", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(15 // 4)",
    options: ["3", "3.75", "4", "3.5"], answer: 0,
    explain: "// is whole-number division. 15 // 4 = 3 (the leftover is thrown away)." },

  { id: "py-006", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(15 % 4)",
    options: ["3", "3.75", "4", "15"], answer: 0,
    explain: "% gives the remainder. 15 ÷ 4 = 3 remainder 3." },

  { id: "py-007", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(2 ** 3)",
    options: ["6", "8", "5", "23"], answer: 1,
    explain: "** means “to the power of”. 2 to the power 3 = 2 × 2 × 2 = 8." },

  { id: "py-008", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(2 + 3 * 4)",
    options: ["20", "14", "9", "24"], answer: 1,
    explain: "Multiplication happens before addition. 3 × 4 = 12, then 2 + 12 = 14." },

  { id: "py-009", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print((2 + 3) * 4)",
    options: ["20", "14", "9", "24"], answer: 0,
    explain: "Brackets first: (2 + 3) = 5, then 5 × 4 = 20." },

  { id: "py-010", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(100 % 10)",
    options: ["10", "0", "1", "100"], answer: 1,
    explain: "100 divides exactly by 10 with no remainder." },

  { id: "py-011", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(7 // 2)",
    options: ["3", "3.5", "4", "Error"], answer: 0,
    explain: "// throws away the decimal part. 7 ÷ 2 = 3.5, so // gives 3." },

  { id: "py-012", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(5 + 3.0)",
    options: ["8", "8.0", "53", "Error"], answer: 1,
    explain: "Mixing int and float gives a float: 8.0." },

  // ======================================================================
  // PYTHON: strings
  // ======================================================================
  { id: "py-013", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(\"hi\" + \"bye\")",
    options: ["hibye", "hi bye", "hi+bye", "Error"], answer: 0,
    explain: "+ on strings glues them together with no space." },

  { id: "py-014", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(\"ha\" * 3)",
    options: ["ha 3", "hahaha", "ha ha ha", "Error"], answer: 1,
    explain: "A string times a number repeats it. \"ha\" * 3 = \"hahaha\"." },

  { id: "py-015", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(\"-\" * 5)",
    options: ["-5", "-----", "- - - - -", "Error"], answer: 1,
    explain: "A dash repeated 5 times makes -----." },

  { id: "py-016", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "name = \"Sam\"\nprint(\"Hi \" + name)",
    options: ["Hi name", "Hi Sam", "HiSam", "Error"], answer: 1,
    explain: "The variable name holds \"Sam\", so \"Hi \" + \"Sam\" = \"Hi Sam\"." },

  { id: "py-017", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(\"Hi \" + 5)",
    options: ["Hi 5", "Hi5", "Error", "5 Hi"], answer: 2,
    explain: "You can’t add a number to a string in Python. Wrap the 5 in str() first." },

  { id: "py-018", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(len(\"hello\"))",
    options: ["4", "5", "6", "hello"], answer: 1,
    explain: "len() counts characters. \"hello\" has 5 letters." },

  { id: "py-019", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(len(\"Hi there\"))",
    options: ["7", "8", "9", "2"], answer: 1,
    explain: "len() counts every character including the space: 8 in total." },

  { id: "py-020", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "word = \"PYTHON\"\nprint(word.lower())",
    options: ["PYTHON", "python", "Python", "Error"], answer: 1,
    explain: ".lower() turns the whole string into small letters." },

  { id: "py-021", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "word = \"hello\"\nprint(word.upper())",
    options: ["hello", "HELLO", "Hello", "hELLO"], answer: 1,
    explain: ".upper() turns the whole string into capital letters." },

  { id: "py-022", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "s = \"Hallam\"\nprint(s[0])",
    options: ["H", "a", "Hallam", "1"], answer: 0,
    explain: "Indexes start at 0, so s[0] is the FIRST character, H." },

  { id: "py-023", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "s = \"Hallam\"\nprint(s[-1])",
    options: ["H", "m", "Error", "a"], answer: 1,
    explain: "Negative indexes count from the end. -1 is the LAST character, m." },

  { id: "py-024", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "s = \"Hallam\"\nprint(s[0:3])",
    options: ["Hal", "Hall", "alla", "Ha"], answer: 0,
    explain: "Slicing [0:3] takes characters 0, 1 and 2 (stops BEFORE 3): \"Hal\"." },

  { id: "py-025", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(\"cat\".replace(\"c\", \"b\"))",
    options: ["cat", "bat", "rat", "bcat"], answer: 1,
    explain: ".replace(\"c\",\"b\") swaps every c for b: \"bat\"." },

  { id: "py-026", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(\"5\" + \"3\")",
    options: ["8", "53", "5+3", "Error"], answer: 1,
    explain: "These are STRINGS (in quotes). + joins them. Result: \"53\"." },

  { id: "py-027", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "fruit = \"banana\"\nprint(fruit.count(\"a\"))",
    options: ["1", "2", "3", "banana"], answer: 2,
    explain: "\"banana\" has three a’s." },

  { id: "py-028", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(\"CAT\".lower() == \"cat\")",
    options: ["True", "False", "cat", "Error"], answer: 0,
    explain: ".lower() makes \"CAT\" become \"cat\". \"cat\" == \"cat\" is True." },

  { id: "py-029", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(\"Python\"[0:3])",
    options: ["Py", "Pyt", "Pyth", "PYT"], answer: 1,
    explain: "Slice [0:3] takes characters at index 0, 1 and 2, giving \"Pyt\"." },

  { id: "py-030", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(\"hello world\".split())",
    options: ["'hello world'", "['hello', 'world']", "['hello world']", "Error"], answer: 1,
    explain: ".split() with no argument breaks the string on spaces into a list of words." },

  { id: "py-031", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(\",\".join([\"a\", \"b\", \"c\"]))",
    options: ["abc", "a,b,c", "['a','b','c']", "a, b, c"], answer: 1,
    explain: "\"sep\".join(list) glues list items together with sep between them." },

  // ======================================================================
  // PYTHON: variables
  // ======================================================================
  { id: "py-032", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "x = 5\nprint(x)",
    options: ["x", "5", "\"5\"", "Error"], answer: 1,
    explain: "x stores the value 5. print(x) shows what is INSIDE x." },

  { id: "py-033", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 5\nx = x + 1\nprint(x)",
    options: ["5", "6", "x+1", "Error"], answer: 1,
    explain: "x becomes 5 + 1 = 6. The second line REPLACES the value of x." },

  { id: "py-034", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "a = 3\nb = 4\nprint(a + b)",
    options: ["34", "7", "3+4", "ab"], answer: 1,
    explain: "a holds 3, b holds 4, so a + b = 7." },

  { id: "py-035", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 10\ny = x\nx = 99\nprint(y)",
    options: ["10", "99", "x", "Error"], answer: 0,
    explain: "y was set to 10 BEFORE x changed. y did not “follow” x, it just took a copy." },

  { id: "py-036", topic: "python", difficulty: "medium",
    prompt: "What is the value of x?",
    code: "x = 4\nx += 6",
    options: ["4", "6", "10", "46"], answer: 2,
    explain: "x += 6 means x = x + 6. So x becomes 4 + 6 = 10." },

  { id: "py-037", topic: "python", difficulty: "easy",
    prompt: "Which is a valid Python variable name?",
    options: ["1score", "score-1", "score_1", "score 1"], answer: 2,
    explain: "Variable names can’t start with a digit, can’t contain spaces or dashes, but underscores are fine." },

  { id: "py-038", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "a, b, c = 1, 2, 3\nprint(b)",
    options: ["1", "2", "3", "(1, 2, 3)"], answer: 1,
    explain: "Multiple assignment: a = 1, b = 2, c = 3." },

  // ======================================================================
  // PYTHON: if / else
  // ======================================================================
  { id: "py-039", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 7\nif x > 5:\n    print(\"big\")\nelse:\n    print(\"small\")",
    options: ["big", "small", "7", "nothing"], answer: 0,
    explain: "7 IS greater than 5, so the if branch runs." },

  { id: "py-040", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 3\nif x > 5:\n    print(\"big\")\nelse:\n    print(\"small\")",
    options: ["big", "small", "3", "nothing"], answer: 1,
    explain: "3 is NOT greater than 5, so the else branch runs." },

  { id: "py-041", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 5\nif x > 5:\n    print(\"big\")\nelif x == 5:\n    print(\"five\")\nelse:\n    print(\"small\")",
    options: ["big", "five", "small", "Error"], answer: 1,
    explain: "x > 5 is False, but x == 5 is True, so \"five\" prints." },

  { id: "py-042", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "x = 10\nif x > 0:\n    if x > 5:\n        print(\"A\")\n    else:\n        print(\"B\")\nelse:\n    print(\"C\")",
    options: ["A", "B", "C", "AB"], answer: 0,
    explain: "x > 0 is True, so enter the outer if. x > 5 is also True, so enter the inner if. Print A." },

  { id: "py-043", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 10\nif x > 0:\n    print(\"positive\")\nif x > 5:\n    print(\"big\")",
    options: ["positive", "big", "positive (then) big", "big (then) positive"], answer: 2,
    explain: "Both ifs are SEPARATE statements. Both conditions are True, so both print, on two lines." },

  { id: "py-044", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 7\nprint(\"odd\" if x % 2 else \"even\")",
    options: ["odd", "even", "7", "Error"], answer: 0,
    explain: "x % 2 = 1 (truthy), so the if part runs and prints \"odd\"." },

  // ======================================================================
  // PYTHON: loops
  // ======================================================================
  { id: "py-045", topic: "python", difficulty: "medium",
    prompt: "How many times does this loop run?",
    code: "for i in range(5):\n    print(i)",
    options: ["4", "5", "6", "infinite"], answer: 1,
    explain: "range(5) gives 0, 1, 2, 3, 4, that’s 5 numbers." },

  { id: "py-046", topic: "python", difficulty: "medium",
    prompt: "What does this code print (each on its own line)?",
    code: "for i in range(3):\n    print(i)",
    options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"], answer: 1,
    explain: "range(3) is 0, 1, 2 (stops BEFORE 3)." },

  { id: "py-047", topic: "python", difficulty: "medium",
    prompt: "What does this code print (each on its own line)?",
    code: "for i in range(1, 5):\n    print(i)",
    options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "5, 4, 3, 2, 1"], answer: 1,
    explain: "range(1, 5) starts at 1 and stops BEFORE 5: 1, 2, 3, 4." },

  { id: "py-048", topic: "python", difficulty: "hard",
    prompt: "What does this code print (each on its own line)?",
    code: "for i in range(0, 10, 2):\n    print(i)",
    options: ["0 through 9", "0, 2, 4, 6, 8", "2, 4, 6, 8, 10", "0, 2, 4, 6, 8, 10"], answer: 1,
    explain: "The third number is the STEP. Start 0, stop before 10, jump by 2: 0, 2, 4, 6, 8." },

  { id: "py-049", topic: "python", difficulty: "hard",
    prompt: "What is the final value of total?",
    code: "total = 0\nfor i in range(4):\n    total = total + i\nprint(total)",
    options: ["4", "6", "10", "0"], answer: 1,
    explain: "i takes 0, 1, 2, 3, adding them all gives 0+1+2+3 = 6." },

  { id: "py-050", topic: "python", difficulty: "medium",
    prompt: "What does this code print (each on its own line)?",
    code: "for letter in \"cat\":\n    print(letter)",
    options: ["cat", "c, a, t", "Just the letter t", "3"], answer: 1,
    explain: "You can loop over a string letter by letter, c, then a, then t." },

  { id: "py-051", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "count = 0\nfor letter in \"Python\":\n    count = count + 1\nprint(count)",
    options: ["5", "6", "Python", "0"], answer: 1,
    explain: "\"Python\" has 6 letters. The loop runs once per letter, so count ends at 6." },

  { id: "py-052", topic: "python", difficulty: "hard",
    prompt: "What does this code print (each on its own line)?",
    code: "x = 0\nwhile x < 3:\n    print(x)\n    x = x + 1",
    options: ["0, 1, 2", "0, 1, 2, 3", "1, 2, 3", "infinite loop"], answer: 0,
    explain: "Loop runs while x is below 3, printing 0, then 1, then 2, stops when x = 3." },

  { id: "py-053", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "x = 5\nwhile x > 0:\n    x = x - 1\nprint(x)",
    options: ["0", "5", "-1", "infinite loop"], answer: 0,
    explain: "x counts down 4, 3, 2, 1, 0. Loop stops when x = 0. Final value: 0." },

  // ======================================================================
  // PYTHON: lists
  // ======================================================================
  { id: "py-054", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "nums = [10, 20, 30]\nprint(nums[0])",
    options: ["10", "20", "30", "0"], answer: 0,
    explain: "List indexes start at 0, so nums[0] is the first item: 10." },

  { id: "py-055", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "nums = [10, 20, 30]\nprint(nums[-1])",
    options: ["10", "20", "30", "Error"], answer: 2,
    explain: "-1 means the LAST item: 30." },

  { id: "py-056", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "nums = [4, 8, 15, 16]\nprint(len(nums))",
    options: ["3", "4", "15", "16"], answer: 1,
    explain: "len() counts how many items are in the list: 4 items." },

  { id: "py-057", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "nums = [1, 2, 3]\nnums.append(4)\nprint(nums)",
    options: ["[1, 2, 3]", "[4]", "[1, 2, 3, 4]", "[4, 1, 2, 3]"], answer: 2,
    explain: ".append(4) adds 4 to the END of the list." },

  { id: "py-058", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "nums = [1, 2, 3]\ntotal = 0\nfor n in nums:\n    total = total + n\nprint(total)",
    options: ["3", "6", "9", "123"], answer: 1,
    explain: "Adds every item: 1 + 2 + 3 = 6." },

  { id: "py-059", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "words = [\"red\", \"blue\", \"green\"]\nprint(words[1])",
    options: ["red", "blue", "green", "Error"], answer: 1,
    explain: "Indexes start at 0, so words[1] is the SECOND item: \"blue\"." },

  { id: "py-060", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "nums = [1, 2, 3, 4, 5]\nprint(nums[1:4])",
    options: ["[1, 2, 3]", "[2, 3, 4]", "[2, 3, 4, 5]", "[1, 2, 3, 4]"], answer: 1,
    explain: "Slice [1:4] takes items at index 1, 2, 3 (stops BEFORE index 4): [2, 3, 4]." },

  { id: "py-061", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "nums = [3, 1, 4, 1, 5]\nprint(min(nums))",
    options: ["1", "3", "5", "15"], answer: 0,
    explain: "min() finds the smallest item. Smallest in the list is 1." },

  { id: "py-062", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "nums = [3, 1, 4, 1, 5]\nprint(max(nums))",
    options: ["1", "3", "5", "15"], answer: 2,
    explain: "max() finds the largest item: 5." },

  { id: "py-063", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "nums = [1, 2, 3, 4]\nprint(sum(nums))",
    options: ["4", "10", "1234", "Error"], answer: 1,
    explain: "sum() adds all items: 1 + 2 + 3 + 4 = 10." },

  { id: "py-064", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(list(range(3)))",
    options: ["range(3)", "[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]"], answer: 1,
    explain: "list(range(3)) makes a real list of [0, 1, 2]." },

  { id: "py-065", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)",
    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4, 1, 2, 3]", "Error"], answer: 1,
    explain: "b = a makes b POINT to the same list. Changing b changes a too." },

  { id: "py-066", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "nums = [1, 2, 3, 4]\ndoubled = []\nfor n in nums:\n    doubled.append(n * 2)\nprint(doubled)",
    options: ["[1, 2, 3, 4]", "[2, 4, 6, 8]", "[1, 4, 9, 16]", "Error"], answer: 1,
    explain: "The loop doubles each number and adds it to a new list." },

  // ======================================================================
  // PYTHON: booleans
  // ======================================================================
  { id: "py-067", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(True and False)",
    options: ["True", "False", "None", "Error"], answer: 1,
    explain: "\"and\" is only True when BOTH sides are True. One False makes the whole thing False." },

  { id: "py-068", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(True or False)",
    options: ["True", "False", "None", "Error"], answer: 0,
    explain: "\"or\" is True if EITHER side is True." },

  { id: "py-069", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(not True)",
    options: ["True", "False", "None", "Error"], answer: 1,
    explain: "\"not\" flips the value: not True = False." },

  { id: "py-070", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(5 == 5)",
    options: ["True", "False", "5", "Error"], answer: 0,
    explain: "== checks if both sides are equal. 5 IS 5, so True." },

  { id: "py-071", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(5 != 5)",
    options: ["True", "False", "5", "Error"], answer: 1,
    explain: "!= means \"not equal\". 5 IS equal to 5, so \"not equal\" is False." },

  { id: "py-072", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "x = 10\nprint(x > 5 and x < 20)",
    options: ["True", "False", "10", "Error"], answer: 0,
    explain: "x > 5 is True AND x < 20 is True, so the whole thing is True." },

  { id: "py-073", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(bool(0))",
    options: ["True", "False", "0", "Error"], answer: 1,
    explain: "0 counts as False in Python. Any other number is True." },

  { id: "py-074", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(bool(\"\"))",
    options: ["True", "False", "None", "Error"], answer: 1,
    explain: "An empty string is “falsy”, bool(\"\") is False." },

  { id: "py-075", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(bool(\"False\"))",
    options: ["True", "False", "None", "Error"], answer: 0,
    explain: "A non-empty string is truthy, even if it spells \"False\". bool(\"False\") = True." },

  { id: "py-076", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(10 == 10.0)",
    options: ["True", "False", "None", "Error"], answer: 0,
    explain: "== compares values. 10 (int) and 10.0 (float) have the same value, so True." },

  { id: "py-077", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "print(3 > 2 > 1)",
    options: ["True", "False", "Error", "3 > 2"], answer: 0,
    explain: "Python chains comparisons. 3 > 2 AND 2 > 1, both True, so the whole thing is True." },

  // ======================================================================
  // PYTHON: functions
  // ======================================================================
  { id: "py-078", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "def add(a, b):\n    return a + b\n\nprint(add(2, 3))",
    options: ["add", "5", "23", "None"], answer: 1,
    explain: "add(2, 3) runs the function with a = 2 and b = 3, returning 5." },

  { id: "py-079", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "def greet(name):\n    return \"Hi \" + name\n\nprint(greet(\"Sam\"))",
    options: ["name", "Sam", "Hi name", "Hi Sam"], answer: 3,
    explain: "name becomes \"Sam\", so it returns \"Hi \" + \"Sam\" = \"Hi Sam\"." },

  { id: "py-080", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "def square(x):\n    return x * x\n\nprint(square(4))",
    options: ["4", "8", "16", "x*x"], answer: 2,
    explain: "4 × 4 = 16." },

  { id: "py-081", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "def f(x):\n    x = x + 1\n    return x\n\ny = 5\nf(y)\nprint(y)",
    options: ["5", "6", "None", "Error"], answer: 0,
    explain: "The function makes its own copy of x. y is unchanged because the returned value was never saved." },

  { id: "py-082", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "def hello(name=\"World\"):\n    return \"Hello \" + name\n\nprint(hello())",
    options: ["Hello", "Hello name", "Hello World", "Error"], answer: 2,
    explain: "When you don’t pass a name, the default \"World\" is used." },

  // ======================================================================
  // PYTHON: type conversion / misc
  // ======================================================================
  { id: "py-083", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(int(\"5\") + 2)",
    options: ["52", "7", "5+2", "Error"], answer: 1,
    explain: "int(\"5\") converts the TEXT \"5\" into the NUMBER 5, then 5 + 2 = 7." },

  { id: "py-084", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(str(5) + \"2\")",
    options: ["7", "52", "5+2", "Error"], answer: 1,
    explain: "str(5) makes \"5\" (text). Then \"5\" + \"2\" glues into \"52\"." },

  { id: "py-085", topic: "python", difficulty: "hard",
    prompt: "What is the type of   input(\"?: \")   in Python?",
    options: ["int", "float", "str", "bool"], answer: 2,
    explain: "input() ALWAYS returns a string. Convert with int() if you want a number." },

  { id: "py-086", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(type(5))",
    options: ["<class 'int'>", "<class 'str'>", "number", "int"], answer: 0,
    explain: "5 is a whole number, so its type is int. Python wraps it as <class 'int'>." },

  { id: "py-087", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(type(\"5\"))",
    options: ["<class 'int'>", "<class 'str'>", "text", "string"], answer: 1,
    explain: "\"5\" is in quotes, it’s a string, type str." },

  { id: "py-088", topic: "python", difficulty: "easy",
    prompt: "How do you write a one-line comment in Python?",
    options: ["// like this", "# like this", "/* like this */", "<!-- like this -->"], answer: 1,
    explain: "Python uses # for single-line comments." },

  { id: "py-089", topic: "python", difficulty: "easy",
    prompt: "What does this code print?",
    code: "print(abs(-7))",
    options: ["-7", "7", "0", "Error"], answer: 1,
    explain: "abs() gives the absolute (positive) value. |-7| = 7." },

  { id: "py-090", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "print(round(3.7))",
    options: ["3", "4", "3.7", "3.5"], answer: 1,
    explain: "round(3.7) rounds UP to 4 because .7 is past halfway." },

  { id: "py-091", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "a = 2\nb = 3\nc = a * b + 1\nprint(c)",
    options: ["5", "7", "8", "11"], answer: 1,
    explain: "a * b = 6, then 6 + 1 = 7." },

  { id: "py-092", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "word = \"hello\"\nresult = \"\"\nfor letter in word:\n    result = letter + result\nprint(result)",
    options: ["hello", "olleh", "HELLO", "oleh"], answer: 1,
    explain: "Each letter is added to the FRONT of result, reversing the string." },

  { id: "py-093", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "word = \"abc\"\nprint(word[::-1])",
    options: ["abc", "cba", "aaa", "Error"], answer: 1,
    explain: "[::-1] is a Python trick to reverse a string." },

  { id: "py-094", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "words = [\"ant\", \"bee\", \"cat\"]\nfor w in words:\n    if \"e\" in w:\n        print(w)",
    options: ["ant", "bee", "cat", "ant, bee, cat"], answer: 1,
    explain: "Only \"bee\" contains the letter \"e\"." },

  { id: "py-095", topic: "python", difficulty: "hard",
    prompt: "What does this code print?",
    code: "data = {\"name\": \"Sam\", \"age\": 12}\nprint(data[\"name\"])",
    options: ["name", "Sam", "12", "Error"], answer: 1,
    explain: "A dictionary stores key/value pairs. data[\"name\"] looks up \"Sam\"." },

  { id: "py-096", topic: "python", difficulty: "medium",
    prompt: "What is the output type of   3 / 2   in Python 3?",
    options: ["int", "float", "str", "None"], answer: 1,
    explain: "In Python 3, / always returns a float, even when it divides evenly." },

  { id: "py-097", topic: "python", difficulty: "easy",
    prompt: "How do you start a Python program in IDLE / VS Code?",
    options: ["Press F5 or click Run", "Right-click, then Cook", "Drag the file to the bin", "Print the file"], answer: 0,
    explain: "F5 (or the Run button) runs the script." },

  { id: "py-098", topic: "python", difficulty: "medium",
    prompt: "What does this code print?",
    code: "nums = [3, 1, 4, 1, 5]\nnums.sort()\nprint(nums)",
    options: ["[3, 1, 4, 1, 5]", "[1, 1, 3, 4, 5]", "[5, 4, 3, 1, 1]", "[1, 3, 4, 5]"], answer: 1,
    explain: ".sort() puts the list in ASCENDING order (low to high). Duplicates stay." },

  { id: "py-099", topic: "python", difficulty: "medium",
    prompt: "Which of these creates a LIST in Python?",
    options: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "<1, 2, 3>"], answer: 2,
    explain: "Square brackets make a list. Round brackets make a tuple, curly braces a set." },

  { id: "py-100", topic: "python", difficulty: "medium",
    prompt: "What file extension does a Python script use?",
    options: [".py", ".python", ".txt", ".js"], answer: 0,
    explain: "Python files end in .py." },

  // ======================================================================
  // HTML
  // ======================================================================
  { id: "html-001", topic: "html", difficulty: "easy",
    prompt: "Which tag makes the BIGGEST heading on a page?",
    options: ["<head>", "<h1>", "<h6>", "<big>"], answer: 1,
    explain: "<h1> is the biggest. Headings shrink from <h1> down to <h6>." },

  { id: "html-002", topic: "html", difficulty: "easy",
    prompt: "Which tag creates a paragraph?",
    options: ["<para>", "<p>", "<text>", "<pg>"], answer: 1,
    explain: "<p> is the paragraph tag." },

  { id: "html-003", topic: "html", difficulty: "easy",
    prompt: "Which is the correct way to link to another website?",
    options: ["<link url=\"...\">", "<a href=\"...\">click</a>", "<href=\"...\">", "<goto>...</goto>"], answer: 1,
    explain: "The anchor tag <a> with href=\"...\" sets the destination." },

  { id: "html-004", topic: "html", difficulty: "medium",
    prompt: "Which tag creates a NUMBERED list?",
    options: ["<ul>", "<ol>", "<list>", "<nl>"], answer: 1,
    explain: "<ol> = ordered (numbered) list. <ul> = unordered (bullets)." },

  { id: "html-005", topic: "html", difficulty: "medium",
    prompt: "Which tag creates a BULLET (unordered) list?",
    options: ["<ul>", "<ol>", "<bl>", "<dot>"], answer: 0,
    explain: "<ul> = unordered list, shows bullet points." },

  { id: "html-006", topic: "html", difficulty: "easy",
    prompt: "What does <br> do?",
    options: ["Makes text bold", "Adds a line break", "Creates a border", "Inserts a button"], answer: 1,
    explain: "<br> forces a new line without starting a new paragraph." },

  { id: "html-007", topic: "html", difficulty: "medium",
    prompt: "Which renders an image?",
    options: ["<image src=\"cat.png\">", "<img src=\"cat.png\">", "<picture file=\"cat.png\">", "<src=\"cat.png\">"], answer: 1,
    explain: "The tag is <img>, with the src attribute pointing to the file." },

  { id: "html-008", topic: "html", difficulty: "medium",
    prompt: "Where does the <title> tag go?",
    options: ["Inside <body>", "Inside <head>", "Inside <footer>", "Anywhere"], answer: 1,
    explain: "<title> goes in <head>. It controls the browser tab text." },

  { id: "html-009", topic: "html", difficulty: "easy",
    prompt: "Which tag is used for the MAIN heading of a page?",
    options: ["<header>", "<h1>", "<main>", "<heading>"], answer: 1,
    explain: "<h1> is for the most important heading. There should usually be only one per page." },

  { id: "html-010", topic: "html", difficulty: "medium",
    prompt: "Why should images include an alt attribute?",
    options: [
      "So they load faster",
      "To describe the image for screen readers / when loading fails",
      "To make them clickable",
      "To set their colour"
    ], answer: 1,
    explain: "alt text is what blind users’ screen readers say, and what shows if the image breaks." },

  { id: "html-011", topic: "html", difficulty: "medium",
    prompt: "How does this HTML appear on the page?",
    code: "<p>Hello <strong>Hallam</strong></p>",
    options: [
      "Hello Hallam (everything bold)",
      "Hello Hallam (only “Hallam” bold)",
      "Shows the tags as text",
      "Just the word “Hello”"
    ], answer: 1,
    explain: "<strong> bolds whatever is inside it. Only \"Hallam\" gets the bold styling." },

  { id: "html-012", topic: "html", difficulty: "easy",
    prompt: "Which can make text italic?",
    options: ["<i>text</i>", "<italic>text</italic>", "<em>text</em>", "Both <i> and <em>"], answer: 3,
    explain: "Both work. <em> means emphasis (preferred for screen readers); <i> is just visual italic." },

  { id: "html-013", topic: "html", difficulty: "medium",
    prompt: "What does a CSS class let you do?",
    options: ["Style many elements at once", "Style only one element", "Replace JavaScript", "Add a database"], answer: 0,
    explain: "A class can be applied to many elements; IDs should be unique to one element." },

  { id: "html-014", topic: "html", difficulty: "medium",
    prompt: "How do you write a comment in HTML?",
    options: ["// comment", "# comment", "<!-- comment -->", "/* comment */"], answer: 2,
    explain: "HTML comments are wrapped in <!-- ... -->. The browser ignores them." },

  { id: "html-015", topic: "html", difficulty: "medium",
    prompt: "Which attribute points <link> at a CSS file?",
    options: ["src", "href", "rel", "file"], answer: 1,
    explain: "<link rel=\"stylesheet\" href=\"styles.css\">, href points to the CSS file." },

  { id: "html-016", topic: "html", difficulty: "easy",
    prompt: "Which tag holds everything the user SEES on the page?",
    options: ["<head>", "<body>", "<main>", "<page>"], answer: 1,
    explain: "<body> wraps all visible content. <head> holds info about the page." },

  { id: "html-017", topic: "html", difficulty: "hard",
    prompt: "What is wrong with this HTML?",
    code: "<p>Hi <strong>there</p></strong>",
    options: [
      "Nothing",
      "Tags are wrongly nested",
      "<strong> is not a real tag",
      "<p> can’t hold text"
    ], answer: 1,
    explain: "<strong> opens INSIDE <p> but closes AFTER </p>. Tags must close in reverse order they opened." },

  { id: "html-018", topic: "html", difficulty: "medium",
    prompt: "Which is a self-closing tag (no end tag needed)?",
    options: ["<p>", "<img>", "<div>", "<a>"], answer: 1,
    explain: "<img> is a void / self-closing element, you don’t write </img>." },

  { id: "html-019", topic: "html", difficulty: "medium",
    prompt: "What does lang=\"en\" on <html> do?",
    options: [
      "Sets the programming language",
      "Tells browsers and screen readers the page is in English",
      "Selects a font",
      "Forces a translation"
    ], answer: 1,
    explain: "<html lang=\"en\"> helps accessibility tools and search engines." },

  { id: "html-020", topic: "html", difficulty: "easy",
    prompt: "Which is the correct DOCTYPE for HTML5?",
    options: ["<!DOCTYPE html>", "<DOCTYPE html5>", "<doctype>html</doctype>", "<html5>"], answer: 0,
    explain: "<!DOCTYPE html> at the very top tells the browser to use modern HTML5." },

  { id: "html-021", topic: "html", difficulty: "medium",
    prompt: "How does this HTML appear visually?",
    code: "<h2>Hi</h2>\n<p>Hello</p>",
    options: [
      "“Hi” small, “Hello” big",
      "“Hi” big heading, “Hello” normal paragraph",
      "One long line: Hi Hello",
      "Just the word Hello"
    ], answer: 1,
    explain: "<h2> renders as a heading (large, bold). <p> is a normal paragraph beneath it." },

  { id: "html-022", topic: "html", difficulty: "medium",
    prompt: "How many bullet items appear?",
    code: "<ul>\n  <li>One</li>\n  <li>Two</li>\n  <li>Three</li>\n</ul>",
    options: ["1", "2", "3", "4"], answer: 2,
    explain: "Three <li> tags = three bullet points." },

  { id: "html-023", topic: "html", difficulty: "medium",
    prompt: "Which CSS rule makes <h1> red?",
    options: [
      "h1 { color: red; }",
      "h1.colour(red)",
      "<h1 color=\"red\">",
      "red(h1)"
    ], answer: 0,
    explain: "CSS uses selector { property: value; }, h1 { color: red; }." },

  { id: "html-024", topic: "html", difficulty: "medium",
    prompt: "What is <div> for?",
    options: [
      "Dividing a number",
      "A generic container with no built-in meaning",
      "Adding a divider line",
      "Splitting the page into columns"
    ], answer: 1,
    explain: "<div> is a generic “box” you can style and group elements with." },

  { id: "html-025", topic: "html", difficulty: "hard",
    prompt: "What does target=\"_blank\" do on a link?",
    options: ["Hides the link", "Opens it in a NEW tab", "Disables the link", "Makes the link bigger"], answer: 1,
    explain: "target=\"_blank\" tells the browser to open the link in a new tab/window." },

  // ======================================================================
  // LOGIC / algorithm tracing
  // ======================================================================
  { id: "logic-001", topic: "logic", difficulty: "medium",
    prompt: "What is x at the end?",
    code: "x = 1\nx = x + 1\nx = x * 3",
    options: ["1", "3", "6", "9"], answer: 2,
    explain: "Step 1: x = 1. Step 2: x = 2. Step 3: x = 2 × 3 = 6." },

  { id: "logic-002", topic: "logic", difficulty: "hard",
    prompt: "What does this code print?",
    code: "a = 5\nb = 10\na, b = b, a\nprint(a, b)",
    options: ["5 10", "10 5", "5 5", "10 10"], answer: 1,
    explain: "a, b = b, a swaps them. After the swap, a = 10 and b = 5." },

  { id: "logic-003", topic: "logic", difficulty: "hard",
    prompt: "What does this code print?",
    code: "def f(n):\n    if n == 0:\n        return 0\n    return n + f(n - 1)\n\nprint(f(3))",
    options: ["3", "6", "9", "Error"], answer: 1,
    explain: "f(3) = 3 + f(2) = 3 + 2 + f(1) = 3 + 2 + 1 + f(0) = 6." },

  { id: "logic-004", topic: "logic", difficulty: "hard",
    prompt: "What is total at the end?",
    code: "total = 0\nfor i in range(1, 6):\n    if i % 2 == 0:\n        total += i\nprint(total)",
    options: ["6", "9", "15", "30"], answer: 0,
    explain: "Only EVEN numbers in 1..5 add to total: 2 + 4 = 6." },

  { id: "logic-005", topic: "logic", difficulty: "medium",
    prompt: "What does count become?",
    code: "count = 0\nfor letter in \"hello\":\n    if letter == \"l\":\n        count += 1\nprint(count)",
    options: ["1", "2", "3", "5"], answer: 1,
    explain: "\"hello\" has two l’s, so count goes up twice, final value 2." },

  { id: "logic-006", topic: "logic", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 5\ny = \"5\"\nprint(x == y)",
    options: ["True", "False", "Error", "5"], answer: 1,
    explain: "An int 5 and a string \"5\" are different types, so == returns False." },

  { id: "logic-007", topic: "logic", difficulty: "hard",
    prompt: "What does biggest end up as?",
    code: "nums = [3, 7, 2, 8, 5]\nbiggest = nums[0]\nfor n in nums:\n    if n > biggest:\n        biggest = n\nprint(biggest)",
    options: ["3", "5", "7", "8"], answer: 3,
    explain: "This is the classic “find the largest” pattern. 8 is the largest." },

  { id: "logic-008", topic: "logic", difficulty: "medium",
    prompt: "Which loop will NEVER stop on its own?",
    options: [
      "for i in range(5):",
      "while True:",
      "for i in [1, 2, 3]:",
      "while x < 10: x = x + 1"
    ], answer: 1,
    explain: "while True has no condition to stop. The others end naturally or when x reaches 10." },

  { id: "logic-009", topic: "logic", difficulty: "medium",
    prompt: "What does this code print?",
    code: "x = 3\nif x > 0 or x > 100:\n    print(\"yes\")\nelse:\n    print(\"no\")",
    options: ["yes", "no", "Error", "nothing"], answer: 0,
    explain: "x > 0 is True, so the whole \"or\" is True. Prints \"yes\"." },

  { id: "logic-010", topic: "logic", difficulty: "hard",
    prompt: "What does this code print?",
    code: "def mystery(x):\n    return x * 2 + 1\n\nprint(mystery(mystery(2)))",
    options: ["5", "11", "12", "21"], answer: 1,
    explain: "mystery(2) = 5. mystery(5) = 11." },

  { id: "logic-011", topic: "logic", difficulty: "medium",
    prompt: "The goal is to print “Even” when n is even. Which line has the bug?",
    code: "n = 4\nif n % 2 == 1:\n    print(\"Even\")\nelse:\n    print(\"Odd\")",
    options: ["n = 4", "if n % 2 == 1:", "print(\"Even\")", "print(\"Odd\")"], answer: 1,
    explain: "n % 2 == 1 catches ODD numbers. The condition is the wrong way round, should be == 0." },

  { id: "logic-012", topic: "logic", difficulty: "medium",
    prompt: "What does this code print?",
    code: "a = True\nb = False\nprint(a and not b)",
    options: ["True", "False", "None", "Error"], answer: 0,
    explain: "not b = not False = True. True and True = True." },

  { id: "logic-013", topic: "logic", difficulty: "hard",
    prompt: "What does this code print?",
    code: "i = 1\nwhile i < 100:\n    i = i * 2\nprint(i)",
    options: ["64", "100", "128", "Error"], answer: 2,
    explain: "i doubles: 2, 4, 8, 16, 32, 64. 64 < 100, so doubles to 128. 128 stops the loop. Final: 128." },

  { id: "logic-014", topic: "logic", difficulty: "medium",
    prompt: "What does this code print?",
    code: "nums = [4, 1, 9, 2]\nnums.sort()\nprint(nums[-1])",
    options: ["1", "2", "4", "9"], answer: 3,
    explain: "After sorting: [1, 2, 4, 9]. nums[-1] is the last item: 9." },

  { id: "logic-015", topic: "logic", difficulty: "hard",
    prompt: "What does this code print?",
    code: "words = [\"hi\", \"bye\", \"hello\"]\nlongest = \"\"\nfor w in words:\n    if len(w) > len(longest):\n        longest = w\nprint(longest)",
    options: ["hi", "bye", "hello", "(nothing)"], answer: 2,
    explain: "Tracks the longest word so far. \"hello\" (5 letters) beats \"hi\" (2) and \"bye\" (3)." },

  // ======================================================================
  // CONCEPTS
  // ======================================================================
  { id: "con-001", topic: "concept", difficulty: "easy",
    prompt: "What is an algorithm?",
    options: [
      "A type of computer virus",
      "A step-by-step plan to solve a problem",
      "A programming language",
      "A type of monitor"
    ], answer: 1,
    explain: "An algorithm is just a clear list of steps in the right order, like a recipe." },

  { id: "con-002", topic: "concept", difficulty: "easy",
    prompt: "What is debugging?",
    options: [
      "Writing brand-new code",
      "Removing insects from your laptop",
      "Finding and fixing mistakes in code",
      "Deleting projects you don’t need"
    ], answer: 2,
    explain: "Every programmer debugs, it’s a normal, important skill." },

  { id: "con-003", topic: "concept", difficulty: "easy",
    prompt: "A variable is best described as…",
    options: [
      "A bug in the code",
      "A named box that stores a value",
      "A hardware component",
      "The name of a website"
    ], answer: 1,
    explain: "Variables have a name and hold a value you can read and change later." },

  { id: "con-004", topic: "concept", difficulty: "medium",
    prompt: "A SYNTAX error means…",
    options: [
      "The code is too slow",
      "The code breaks the language’s rules and won’t run",
      "The code makes the wrong answer",
      "The internet is down"
    ], answer: 1,
    explain: "Syntax errors stop the program before it even starts (e.g. a missing bracket)." },

  { id: "con-005", topic: "concept", difficulty: "medium",
    prompt: "A LOGIC error means…",
    options: [
      "A missing semicolon",
      "The code runs but gives the wrong answer",
      "The code won’t open",
      "The computer is broken"
    ], answer: 1,
    explain: "Logic errors are sneaky, code runs fine, but the result is wrong." },

  { id: "con-006", topic: "concept", difficulty: "medium",
    prompt: "Pseudocode is…",
    options: [
      "A real programming language",
      "A plan of code in plain English (or near-English)",
      "A type of password",
      "The first language Python ran on"
    ], answer: 1,
    explain: "Pseudocode means “fake code”, used to plan an algorithm before writing real code." },

  { id: "con-007", topic: "concept", difficulty: "medium",
    prompt: "Which symbol checks if two values are EQUAL in Python?",
    options: ["=", "==", "!=", "<>"], answer: 1,
    explain: "= ASSIGNS, == COMPARES. A super common bug is using = instead of ==." },

  { id: "con-008", topic: "concept", difficulty: "easy",
    prompt: "A boolean value can be…",
    options: ["Any number", "True or False only", "Any letter", "Up to 256 things"], answer: 1,
    explain: "Booleans are yes/no values. Computers use them for every decision." },

  { id: "con-009", topic: "concept", difficulty: "medium",
    prompt: "A function is…",
    options: [
      "A single number",
      "A reusable block of code that does a specific job",
      "A type of error",
      "A part of the keyboard"
    ], answer: 1,
    explain: "Functions wrap up code under a name so you can call (run) it whenever you need." },

  { id: "con-010", topic: "concept", difficulty: "medium",
    prompt: "In a computer, what mainly does the calculations?",
    options: ["RAM", "Hard drive", "CPU", "Monitor"], answer: 2,
    explain: "The CPU (central processing unit) is the brain of the computer." },

  { id: "con-011", topic: "concept", difficulty: "medium",
    prompt: "What is RAM mainly for?",
    options: [
      "Permanently storing files",
      "Fast, temporary memory while programs are running",
      "Displaying images",
      "Powering the computer"
    ], answer: 1,
    explain: "RAM holds running programs and data while in use. Switch it off and it forgets everything." },

  { id: "con-012", topic: "concept", difficulty: "easy",
    prompt: "Which of these is hardware?",
    options: ["Chrome", "Python", "Keyboard", "Word"], answer: 2,
    explain: "Hardware = physical parts. Keyboard is hardware; Chrome / Python / Word are software." },

  { id: "con-013", topic: "concept", difficulty: "easy",
    prompt: "Which of these is software?",
    options: ["Monitor", "Mouse", "Operating system", "RAM"], answer: 2,
    explain: "An OS like Windows or macOS is software, instructions, not a physical thing." },

  { id: "con-014", topic: "concept", difficulty: "medium",
    prompt: "What does HTML stand for?",
    options: [
      "How To Make Links",
      "HyperText Markup Language",
      "High Tech Modern Layout",
      "Home Tools Modern Look"
    ], answer: 1,
    explain: "HTML = HyperText Markup Language. It marks up the structure of web pages." },

  { id: "con-015", topic: "concept", difficulty: "medium",
    prompt: "What does a website URL usually start with?",
    options: ["html://", "http:// or https://", "www://", "file://"], answer: 1,
    explain: "http:// or https://, the s means it’s a SECURE connection." },

  { id: "con-016", topic: "concept", difficulty: "easy",
    prompt: "Which is faster: RAM or hard drive?",
    options: ["RAM", "Hard drive", "Same speed", "Depends on the monitor"], answer: 0,
    explain: "RAM is FAR faster than a disk. That’s why programs are loaded into RAM to run." },

  { id: "con-017", topic: "concept", difficulty: "medium",
    prompt: "Computers store data in…",
    options: ["Words", "Decimals", "Binary (0s and 1s)", "Pictures only"], answer: 2,
    explain: "Everything inside a computer is stored as 0s and 1s, binary." },

  { id: "con-018", topic: "concept", difficulty: "medium",
    prompt: "A byte is how many bits?",
    options: ["1", "4", "8", "16"], answer: 2,
    explain: "1 byte = 8 bits." },

  { id: "con-019", topic: "concept", difficulty: "medium",
    prompt: "What is an IDE used for?",
    options: [
      "Writing, running and debugging code in one place",
      "Storing files online",
      "Printing pages",
      "Editing photos"
    ], answer: 0,
    explain: "IDE = Integrated Development Environment. VS Code, PyCharm and IDLE are examples." },

  { id: "con-020", topic: "concept", difficulty: "easy",
    prompt: "Which file extension is used for a Python script?",
    options: [".py", ".python", ".txt", ".js"], answer: 0,
    explain: "Python files end in .py." },

  // ======================================================================
  // SPOT THE ERROR: every snippet below was run through real Python 3, and
  // the line numbers and messages quoted here are the ones it actually
  // prints. Worth 2 XP each: reading broken code is harder than reading
  // working code, and it is the skill that unblocks everything else.
  // ======================================================================

  { id: "err-001", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "Which line has the mistake?",
    code: "age = 15\nif age > 12\n    print(\"Teen\")",
    options: ["Line 1", "Line 2", "Line 3", "The code is fine"], answer: 1,
    explain: "Line 2 opens a block, so it must end with a colon. Python says: SyntaxError: expected ':'" },

  { id: "err-002", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "What is wrong with this code?",
    code: "name = \"Ada\nprint(name)",
    options: [
      "The closing quote after Ada is missing",
      "print needs a colon",
      "name is a reserved word",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "Every \" needs a partner. Python says: SyntaxError: unterminated string literal (detected at line 1)" },

  { id: "err-003", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What is wrong with this code?",
    code: "greeting = Hello\"\nprint(greeting)",
    options: [
      "The opening quote before Hello is missing",
      "greeting is spelled wrong on line 2",
      "print should be Print",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "The text has a closing quote but no opening one, so Python reads on looking for the partner: SyntaxError: unterminated string literal" },

  { id: "err-004", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What is wrong with this code?",
    code: "message = \"Good morning'\nprint(message)",
    options: [
      "The quotes do not match: it opens with \" and closes with '",
      "message is too long",
      "You cannot put a space inside a string",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "Quotes come in matching pairs. A \" must be closed by a \", not by a '. Python says: unterminated string literal" },

  { id: "err-005", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "What is wrong with this code?",
    code: "total = 10\nprint(\"Total is\", total",
    options: [
      "The closing bracket on line 2 is missing",
      "total should be in quotes",
      "There should be a colon after print",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "Count the brackets: line 2 opens one and closes none. Python says: SyntaxError: '(' was never closed" },

  { id: "err-006", topic: "errors", difficulty: "hard", xp: 2,
    prompt: "How many closing brackets does line 1 still need?",
    code: "age = int(input(\"Age? \")\nprint(age)",
    options: ["None, it is fine", "One", "Two", "Three"], answer: 1,
    explain: "int( and input( both opened, only one ) closed them. One more ) is needed. Python says: '(' was never closed" },

  { id: "err-007", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "Which line has the mistake?",
    code: "score = 10\nif score > 5:\nprint(\"Good\")",
    options: ["Line 1", "Line 2", "Line 3", "The code is fine"], answer: 2,
    explain: "Line 2 ends with a colon, so line 3 must be indented to show it belongs inside the if. Python says: IndentationError: expected an indented block" },

  { id: "err-008", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "What is wrong with this code?",
    code: "for i in range(3):\nprint(i)",
    options: [
      "Line 2 needs to be indented",
      "range(3) should be range[3]",
      "i needs to be created first",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "Colon, then indent, every time. Python says: IndentationError: expected an indented block after 'for' statement on line 1" },

  { id: "err-009", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What is wrong with this code?",
    code: "name = \"Sam\"\n    print(name)",
    options: [
      "Line 2 is indented when it should not be",
      "name should be in single quotes",
      "print is spelled wrong",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "Nothing on line 1 opened a block, so line 2 has no reason to be indented. Python says: IndentationError: unexpected indent" },

  { id: "err-010", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "Which line has the mistake?",
    code: "age = 13\nif age = 13:\n    print(\"Yes\")",
    options: ["Line 1", "Line 2", "Line 3", "The code is fine"], answer: 1,
    explain: "One = stores, two == asks. Inside an if you are asking. Python even guesses: Maybe you meant '==' instead of '='?" },

  { id: "err-011", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "What is wrong with this code?",
    code: "user_name = \"Ada\"\nprint(username)",
    options: [
      "Line 2 is missing the underscore in user_name",
      "The quotes should be single quotes",
      "print cannot take a variable",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "user_name and username are two different names to Python. It says: NameError: name 'username' is not defined. Did you mean: 'user_name'?" },

  { id: "err-012", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What is wrong with this code?",
    code: "Score = 100\nprint(score)",
    options: [
      "The capital S: Score and score are different names",
      "100 should be in quotes",
      "Variables cannot start with a capital letter",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "Python is case sensitive. Score and score are unrelated. It says: NameError: name 'score' is not defined. Did you mean: 'Score'?" },

  { id: "err-013", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "What is wrong with this code?",
    code: "pirnt(\"Hello\")",
    options: [
      "print is spelled wrong",
      "Hello needs single quotes",
      "It is missing a colon",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "Python does not know a command called pirnt, so it treats it as a name: NameError: name 'pirnt' is not defined. Did you mean: 'print'?" },

  { id: "err-014", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What is wrong with this code?",
    code: "game_over = true\nprint(game_over)",
    options: [
      "true needs a capital T",
      "game_over cannot have an underscore",
      "It needs quotes around true",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "Python spells it True with a capital T. Lowercase true is just an unknown name: NameError: name 'true' is not defined. Did you mean: 'True'?" },

  { id: "err-015", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "Which line has the mistake?",
    code: "count = 0\nwhile count < 3\n    count = count + 1",
    options: ["Line 1", "Line 2", "Line 3", "The code is fine"], answer: 1,
    explain: "while opens a block, so it needs a colon on the end. Python says: SyntaxError: expected ':'" },

  { id: "err-016", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What is wrong with this code?",
    code: "def greet()\n    print(\"Hi\")",
    options: [
      "Line 1 is missing the colon",
      "greet needs to be called",
      "print should not be indented",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "def opens a block just like if and for, so it ends with a colon: def greet():" },

  { id: "err-017", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "What is wrong with this code?",
    code: "print \"Hello\"",
    options: [
      "print needs brackets around what it prints",
      "Hello should not have quotes",
      "It needs a colon on the end",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "In Python 3 print is a function, so it needs brackets. Python says: SyntaxError: Missing parentheses in call to 'print'" },

  { id: "err-018", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What error does this give?",
    code: "age = 15\nprint(\"You are \" + age)",
    options: [
      "TypeError: you cannot join text to a number",
      "NameError: age is not defined",
      "SyntaxError: invalid syntax",
      "No error, it prints You are 15"
    ], answer: 0,
    explain: "+ joins text to text, or adds number to number, never one of each. Wrap it: \"You are \" + str(age). Python says: can only concatenate str (not \"int\") to str" },

  { id: "err-019", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "Which line has the mistake?",
    code: "score = 100\nmessage = \"Score: \" + score\nprint(message)",
    options: ["Line 1", "Line 2", "Line 3", "The code is fine"], answer: 1,
    explain: "Line 2 tries to glue a number onto text. It needs str(score) to turn the number into text first." },

  { id: "err-020", topic: "errors", difficulty: "hard", xp: 2,
    prompt: "Which line has the mistake?",
    code: "age = input(\"How old are you? \")\nif age > 18:\n    print(\"Adult\")",
    options: ["Line 1", "Line 2", "Line 3", "The code is fine"], answer: 1,
    explain: "input always hands back text, so line 2 compares text to a number. Python says: '>' not supported between instances of 'str' and 'int'. Fix it with int(input(...))" },

  { id: "err-021", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What error does this give?",
    code: "number = input(\"Pick a number: \")\nprint(number + 10)",
    options: [
      "TypeError: number is text, not a number",
      "ValueError: 10 is not valid",
      "SyntaxError: missing bracket",
      "No error, it adds 10"
    ], answer: 0,
    explain: "input gives text even when they type digits, so + tries to glue 10 onto text. Wrap it: int(input(...))" },

  { id: "err-022", topic: "errors", difficulty: "hard", xp: 2,
    prompt: "What does this print?",
    code: "a = \"5\"\nb = \"3\"\nprint(a + b)",
    options: ["8", "53", "An error", "5 + 3"], answer: 1,
    explain: "Both are text because of the quotes, so + joins them instead of adding: 53. This one runs happily and still gives the wrong answer, which makes it harder to spot than a crash. Use int(a) + int(b) for 8." },

  { id: "err-023", topic: "errors", difficulty: "easy", xp: 2,
    prompt: "What is wrong with this code?",
    code: "scores = [10, 20, 30\nprint(scores)",
    options: [
      "The closing square bracket is missing",
      "Lists cannot hold numbers",
      "It needs a colon after scores",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "A list opens with [ and must close with ]. Python says: SyntaxError: '[' was never closed" },

  { id: "err-024", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "Which line has the mistake?",
    code: "word = \"hello\"\nprint(len(word)",
    options: ["Line 1", "Line 2", "Both lines", "The code is fine"], answer: 1,
    explain: "Line 2 opens two brackets and closes one. print( needs its own closing bracket too: print(len(word))" },

  { id: "err-025", topic: "errors", difficulty: "hard", xp: 2,
    prompt: "What is wrong with this code?",
    code: "print(\"She said \"hello\" to me\")",
    options: [
      "The inner quotes end the string early",
      "You cannot use the word hello",
      "print can only take one word",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "The second \" closes the string, so Python sees hello sitting outside it. Use single quotes inside: \"She said 'hello' to me\"" },

  { id: "err-026", topic: "errors", difficulty: "hard", xp: 2,
    prompt: "Which line has the mistake?",
    code: "age = 10\nif age > 12:\n    print(\"Teen\")\n  else:\n    print(\"Child\")",
    options: ["Line 2", "Line 3", "Line 4", "Line 5"], answer: 2,
    explain: "else must line up exactly with its if. Line 4 is indented two spaces, matching nothing. Python says: IndentationError: unindent does not match any outer indentation level" },

  { id: "err-027", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "Which line has the mistake?",
    code: "print(total)\ntotal = 10",
    options: ["Line 1", "Line 2", "Both lines", "The code is fine"], answer: 0,
    explain: "Python runs top to bottom, so on line 1 total does not exist yet. Make it before you use it. NameError: name 'total' is not defined" },

  { id: "err-028", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What is wrong with this code?",
    code: "for i range(5):\n    print(i)",
    options: [
      "The word in is missing",
      "range(5) should be range[5]",
      "i should be in quotes",
      "Nothing, it runs fine"
    ], answer: 0,
    explain: "The shape is always: for <name> in <something>:. Without in, Python says: SyntaxError: invalid syntax" },

  { id: "err-029", topic: "errors", difficulty: "hard", xp: 2,
    prompt: "What error does this give?",
    code: "word = \"Python\"\nprint(word[10])",
    options: [
      "IndexError: there is no letter number 10",
      "TypeError: you cannot index a string",
      "SyntaxError: invalid syntax",
      "No error, it prints n"
    ], answer: 0,
    explain: "Python has 6 letters, numbered 0 to 5, so there is no position 10. Python says: IndexError: string index out of range" },

  { id: "err-030", topic: "errors", difficulty: "medium", xp: 2,
    prompt: "What error does this give?",
    code: "age = int(\"fifteen\")\nprint(age)",
    options: [
      "ValueError: int() cannot read a word as a number",
      "TypeError: int() takes no arguments",
      "NameError: fifteen is not defined",
      "No error, it prints 15"
    ], answer: 0,
    explain: "int() converts digits like \"15\", not words. Python says: ValueError: invalid literal for int() with base 10: 'fifteen'" },
];
