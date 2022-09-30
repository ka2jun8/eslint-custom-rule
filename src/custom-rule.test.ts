import { TSESLint } from "@typescript-eslint/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rule = require("./custom-rule").rule;

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});
ruleTester.run("custom-rule", rule, {
  valid: [
    `
    const func = () => {
      const a = usePreloadedQuery();
      useDispose();
    };
  `,
  ],
  invalid: [
    {
      code: `
        const func = () => {
          const a = usePreloadedQuery();
        };
      `,
      errors: [
        {
          messageId: "noUseDispose",
        },
      ],
    },
  ],
});
