"use strict";
exports.__esModule = true;
exports.rule = void 0;
var isBlockStatement = function (expression) {
    return expression.type === "BlockStatement";
};
var isVariableDeclaration = function (statement) {
    return statement.type === "VariableDeclaration";
};
var isExpressionStatement = function (statement) {
    return statement.type === "ExpressionStatement";
};
var isCallExpression = function (expression) {
    return (expression === null || expression === void 0 ? void 0 : expression.type) === "CallExpression";
};
var isIdentifier = function (expression) {
    return expression.type === "Identifier";
};
exports.rule = {
    meta: {
        type: "problem",
        hasSuggestions: true,
        docs: {
            description: "",
            suggestion: true
        },
        messages: {
            noUseDispose: "`useDispose()`がありません"
        }
    },
    create: function (context) {
        return {
            ArrowFunctionExpression: function (node) {
                var body = node.body;
                if (!isBlockStatement(body)) {
                    return;
                }
                var usePreloadedQueryFlag = false;
                var useDisposeFlag = false;
                var statements = body.body;
                for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
                    var statement = statements_1[_i];
                    if (isVariableDeclaration(statement)) {
                        for (var _a = 0, _b = statement.declarations; _a < _b.length; _a++) {
                            var declaration = _b[_a];
                            var expression = declaration.init;
                            if (!isCallExpression(expression)) {
                                continue;
                            }
                            var identifier = expression.callee;
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
                        var expression = statement.expression;
                        if (!isCallExpression(expression)) {
                            continue;
                        }
                        var identifier = expression.callee;
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
                        node: node,
                        messageId: "noUseDispose",
                        suggest: [
                            {
                                messageId: "noUseDispose",
                                fix: function (fixer) {
                                    return fixer.insertTextBeforeRange([body.range[0] + 2, body.range[1]], "useDispose();\n");
                                }
                            },
                        ]
                    });
                }
                return;
            }
        };
    }
};
