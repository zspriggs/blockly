export const toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    {
      kind: 'block',
      type: 'controls_repeat_ext',
      inputs: {
        TIMES: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 3,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'add_text',
      inputs: {
        TEXT: {
          shadow: {
            type: 'text',
            fields: {
              TEXT: 'abc',
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'text',
    },
  ]
};