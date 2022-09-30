import { RuleTester } from "eslint";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rule = require("./custom-rule");

// TODO テスト作る
const ruleTester = new RuleTester();
ruleTester.run("custom-rule", rule, {
  valid: ["process.env"],
  invalid: [
    {
      code: "process.env.NODE_ENV",
      errors: [
        {
          messageId: "sample",
          type: "MemberExpression",
        },
      ],
    },
  ],
});
