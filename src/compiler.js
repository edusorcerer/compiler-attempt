function tokenizer(input) {
  let current = 0
  let tokens = []
  const NUMBERS = /[0-9]/
  const LETTERS = /[a-z]/i
  const WHITESPACE = /\s/

  while (current < input.length) {
    let char = input[current]
    let type,
      value = ""

    if (char === "(" || char === ")") {
      type = "paren"
      value = char
    }

    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    if (NUMBERS.test(char)) {
      type = "number"

      /** loop through each next characters until encountering a character that is not a number */
      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }
    }

    if (char === '"') {
      type = "string"
      char = input[++current]

      /** loop through each character inside double quotes. they all compose a string */
      while (char !== '"') {
        value += char
        char = input[++current]
      }

      /** Skip the closing double quote. */

      char = input[++current]
    }

    if (LETTERS.test(char)) {
      type = "name"

      /** loop through all the letters */
      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }
    }

    tokens.push({ type, value })

    current++
    continue
  }

  console.log(tokens)
}

tokenizer("(add 2 2)")
