'use strict';

const path = require('path');

const SORT_ORDER = [
  'name',
  'version',
  'type',
  'private',
  'description',

  'keywords',
  'repository',
  'homepage',
  'bugs',
  'license',
  'author',

  'main',
  'module',
  'esnext',
  'browser',
  'types',
  'exports',

  'scripts',
  'files',

  'dependencies',
  'devDependencies',
  'peerDependencies',

  'sideEffects',
  'publishConfig',
  'engines',
  'devEngines',
  'msw',
];

const prefix = 'module.exports = ';

module.exports = {
  processors: {
    json: {
      preprocess(text) {
        return [`${prefix}${text}`];
      },
      postprocess(messages) {
        return messages
          .reduce((total, next) => total.concat(next), [])
          .map(message =>
            message.fix
              ? {
                  ...message,
                  fix: {
                    ...message.fix,
                    range: message.fix.range.map(r =>
                      Math.max(0, r - prefix.length)
                    ),
                  },
                }
              : message
          );
      },
      supportsAutofix: true,
    },
  },
  rules: {
    'sort-keys': {
      meta: {
        docs: {
          description: 'Enforce top-level key ordering in package.json',
        },
        fixable: 'code',
        schema: [],
      },
      create(context) {
        if (!context.getFilename().includes('package.json')) {
          return {};
        }
        const sourceCode = context.getSourceCode();
        return {
          AssignmentExpression(node) {
            const jsonNode = node.right;
            const jsonText = sourceCode.text.substring(...jsonNode.range);
            const pkg = JSON.parse(jsonText);
            const keys = Object.keys(pkg);

            const knownKeys = keys.filter(k => SORT_ORDER.includes(k));
            const unknownKeys = keys.filter(k => !SORT_ORDER.includes(k));
            const expectedOrder = [
              ...knownKeys.sort(
                (a, b) => SORT_ORDER.indexOf(a) - SORT_ORDER.indexOf(b)
              ),
              ...unknownKeys,
            ];

            if (keys.every((key, i) => key === expectedOrder[i])) {
              return;
            }

            context.report({
              node: jsonNode,
              message: 'package.json top-level keys are not sorted correctly.',
              fix(fixer) {
                const sorted = {};
                for (const key of expectedOrder) {
                  sorted[key] = pkg[key];
                }
                return fixer.replaceText(
                  jsonNode,
                  JSON.stringify(sorted, null, 2)
                );
              },
            });
          },
        };
      },
    },
  },
};
