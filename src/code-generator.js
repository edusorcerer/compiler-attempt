/**
 * Calls itself recursively to print each node in the tree into a single string
 *
 * @param {Object} node
 */
export function getGeneratedCode(node) {
  switch (node.type) {
    /** map through each node in the body of the program, calling the getGeneratedCode and then join them */
    case "Program":
      return node.body.map(getGeneratedCode).join("\n")

    /** call the getGeneratedCode on the nested expression and add a semicolon */
    case "ExpressionStatement":
      return getGeneratedCode(node.expression) + ";"

    /** print the callee, add the parenthesis and generate code for each node in the arguments, while joining them with a comma */
    case "CallExpression":
      return (
        getGeneratedCode(node.callee) +
        "(" +
        node.arguments.map(getGeneratedCode).join(", ") +
        ")"
      )

    case "Identifier":
      return node.name

    case "NumberLiteral":
      return node.value

    /** add quotes for strings */
    case "StringLiteral":
      return '"' + node.value + '"'

    default:
      throw new TypeError(node.type)
  }
}
