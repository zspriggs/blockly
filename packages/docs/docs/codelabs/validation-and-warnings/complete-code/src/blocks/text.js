/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const addText = {
  type: 'add_text',
  message0: 'Add text %1',
  args0: [
    {
      type: 'input_value',
      name: 'TEXT',
      check: 'String',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};

// A custom block that generates a list of numbers counting up from FIRST to
// LAST. It validates itself using the 'list_range_validation' extension.
const listRange = {
  type: 'list_range',
  message0: 'create list of numbers from %1 up to %2',
  args0: [
    {
      type: 'field_number',
      name: 'FIRST',
      value: 0,
      min: 0,
      precision: 2,
    },
    {
      type: 'field_number',
      name: 'LAST',
      value: 5,
      min: 0,
      precision: 1,
    },
  ],
  output: 'Array',
  style: 'list_blocks',
  extensions: ['list_range_validation'],
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  addText,
  listRange,
]);
