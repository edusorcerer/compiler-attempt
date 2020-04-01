/**
 * Helper for traversing an AST with a given visitor
 *
 * @param {Object} ast
 * @param {Object} visitor
 */
function traverse(ast, visitor) {
  /**
   * Function to iterate over an array, and then traversing the child node
   *
   * @param {Array} array The array to be traversed
   * @param {Object} parent The array parent
   */
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent)
    })
  }

  /**
   * Accepts a node and its parent node so they both can be passed to the visitor methods
   *
   * @param {*} node
   * @param {*} parent
   */
  function traverseNode(node, parent) {
    /** Check if the visitor has a method for the current node type */
    let methods = visitor[node.type]

    /** Call the enter method for this node type if it exists */
    if (methods && methods.enter) {
      methods.enter(node, parent)
    }

    /** Split things by the current node type */
    switch (node.type) {
      /**
       * Starting with the root program.
       * (Remember that `traverseArray` will in turn call `traverseNode` so  we
       * are causing the tree to be traversed recursively)
       */
      case "Program":
        traverseArray(node.body, node)
        break

      case "CallExpression":
        traverseArray(node.params, node)
        break

      /** These types have no child nodes to visit, so we'll just break */
      case "NumberLiteral":
      case "StringLiteral":
        break

      default:
        throw new TypeError(node.type)
    }

    /** Call the exit method for this node type if it exists */
    if (methods && methods.exit) {
      methods.exit(node, parent)
    }
  }

  /** Kickstart by calling traverseNode, passing the given AST */
  traverseNode(ast, null)
}

/**
 * Creates a new AST from the given AST,
 * using traverse helper with a visitor
 *
 * @param {Object} ast The Abstract Syntax Tree
 * @returns {Object} The new Abstract Syntax Tree
 */
export function getTransformedAbstractSyntaxTree(ast) {
  let newAst = {
    type: "Program",
    body: []
  }

  /** the context is a reference from the old AST to the new AST */
  ast._context = newAst.body

  const visitor = {
    NumberLiteral: {
      enter(node, parent) {
        /** create a new node on the parent context */
        parent._context.push({
          type: "NumberLiteral",
          value: node.value
        })
      }
    },

    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "StringLiteral",
          value: node.value
        })
      }
    },

    CallExpression: {
      enter(node, parent) {
        /** create a new node with a nested identifier */
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name
          },
          arguments: []
        }

        /** define a new context on the CallExperssion node to reference the expression arguments */
        node._context = expression.arguments

        if (parent.type !== "CallExpression") {
          /**
           * since the parent isn't a CallExpression,
           * wrap the current CallExpression with an ExpressionStatement
           *
           * this is because the top level CallExpression in Javascript are actually statements
           * */
          expression = {
            type: "ExpressionStatement",
            expression: expression
          }
        }

        /** push the (possibly wrapped) CallExpression to the parent context */
        parent._context.push(expression)
      }
    }
  }

  /** traverse the AST with the visitor */
  traverse(ast, visitor)

  return newAst
}
