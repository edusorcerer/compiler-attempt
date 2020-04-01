import { getTokens, getAbstractSyntexTree } from "./parser.js"
import { getTransformedAbstractSyntaxTree } from "./transformer.js"
import { getGeneratedCode } from "./code-generator.js"

/**
 * Compiles a given input into Javascript code
 */
export function compile(input) {
  const tokens = getTokens(input)
  const ast = getAbstractSyntexTree(tokens)
  const newAst = getTransformedAbstractSyntaxTree(ast)
  const code = getGeneratedCode(newAst)

  return code
}

console.log(compile("(add 2 (subtract 2 4))"))
