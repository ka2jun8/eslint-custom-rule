import { Rule } from "eslint";
import {
  CallExpression,
  Expression,
  Super,
  Identifier,
  PrivateIdentifier,
  BlockStatement,
  Statement,
  VariableDeclaration,
  ExpressionStatement,
} from "estree";

const isTest = process.env.NODE_ENV === "test";

const isBlockStatement = (
  expression: Expression | BlockStatement
): expression is BlockStatement => {
  return expression.type === "BlockStatement";
};

const isVariableDeclaration = (
  statement: Statement
): statement is VariableDeclaration => {
  return statement.type === "VariableDeclaration";
};

const isExpressionStatement = (
  statement: Statement
): statement is ExpressionStatement => {
  return statement.type === "ExpressionStatement";
};

const isCallExpression = (
  expression?: Expression | null
): expression is CallExpression => {
  return expression?.type === "CallExpression";
};

const isIdentifier = (
  expression: Expression | Super | PrivateIdentifier
): expression is Identifier => {
  return expression.type === "Identifier";
};

const isNextPageFile = (filename: string) => {
  // next.config.js の pageExtensions から取得する方が良さそう
  return filename.endsWith(".page.tsx");
};

export const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    hasSuggestions: true,
    docs: {
      description: "",
      suggestion: true,
    },
    messages: {
      noUseDispose:
        "Must write `useDispose` if `usePreloadedQuery` exists in the Next pages file.",
    },
  },
  create(context) {
    const filename = context.getPhysicalFilename();

    if (!isTest && !isNextPageFile(filename)) {
      return {};
    }

    return {
      ArrowFunctionExpression(node) {
        const body = node.body;

        if (!isBlockStatement(body)) {
          return;
        }

        let usePreloadedQueryFlag = false;
        let useDisposeFlag = false;

        const statements = body.body;
        for (let statement of statements) {
          if (isVariableDeclaration(statement)) {
            for (let declaration of statement.declarations) {
              const expression = declaration.init;
              if (!isCallExpression(expression)) {
                continue;
              }

              const identifier = expression.callee;
              if (!isIdentifier(identifier)) {
                continue;
              }

              if (identifier.name === "usePreloadedQuery") {
                usePreloadedQueryFlag = true;
              }

              continue;
            }
          }

          if (isExpressionStatement(statement)) {
            const expression = statement.expression;

            if (!isCallExpression(expression)) {
              continue;
            }

            const identifier = expression.callee;

            if (!isIdentifier(identifier)) {
              continue;
            }

            if (identifier.name === "useDispose") {
              useDisposeFlag = true;
            }
          }
        }

        if (usePreloadedQueryFlag && !useDisposeFlag) {
          context.report({
            node,
            messageId: "noUseDispose",
            suggest: [
              {
                messageId: "noUseDispose",
                fix(fixer) {
                  return fixer.insertTextBeforeRange(
                    [body.range![0] + 2, body.range![1]],
                    "useDispose(initialPreloadedQuery);\n"
                  );
                },
              },
            ],
          });
        }

        return;
      },
    };
  },
};
