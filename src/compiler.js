function getTokens(input) {
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

    /** whitespace is not important for now, just skipping it */
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

      tokens.push({ type, value })
      continue
    }

    if (char === '"') {
      type = "string"
      char = input[++current]

      /** loop through each character inside double quotes. they all compose a string */
      while (char !== '"') {
        value += char
        char = input[++current]
      }

      /** skip the closing double quote. */
      current++

      tokens.push({ type, value })
      continue
    }

    if (LETTERS.test(char)) {
      type = "name"

      /** loop through all the letters */
      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type, value })
      continue
    }

    tokens.push({ type, value })
    current++

    continue
  }

  return tokens
}

/**
 * Parses tokens into an Abstract Syntax Tree
 *
 * Example:
 * {
 *   type: "Program",
 *   body: [
 *     {
 *       type: "CallExpression",
 *       name: "add",
 *       params: [
 *         {
 *           type: "NumberLiteral",
 *           value: 2
 *         },
 *         {
 *           type: "CallExpression"
 *           name: "subtract",
 *           params: [
 *             {
 *               type: "NumberLiteral",
 *               value: 4
 *             },
 *             {
 *               type: "NumberLiteral",
 *               value: 4
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 * @param {Array} tokens The tokens array
 */
function getAbstractSyntexTree(tokens) {
  let current = 0

  function walk() {
    let token = tokens[current]

    if (token.type === "number") {
      current++

      return {
        type: "NumberLiteral",
        value: token.value
      }
    }

    if (token.type === "string") {
      current++

      return {
        type: "StringLiteral",
        value: token.value
      }
    }

    if (token.type === "paren" && token.value === "(") {
      /** skip the parenthesis since its not used on the AST */
      token = tokens[++current]

      let node = {
        type: "CallExpression",
        name: token.value,
        params: []
      }

      token = tokens[++current]

      /** push to the node params using the walk function, until it reaches an enclosing parenthesis */
      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        node.params.push(walk())
        token = tokens[current]
      }

      current++

      return node
    }

    throw new TypeError(token.type)
  }

  let ast = {
    type: "Program",
    body: []
  }

  while (current < tokens.length) {
    ast.body.push(walk())
  }

  return ast
}

const tokens = getTokens("(add 2 (subtract 2 4))")
console.log(tokens)

const ast = getAbstractSyntexTree(tokens)
console.log(JSON.stringify(ast))
