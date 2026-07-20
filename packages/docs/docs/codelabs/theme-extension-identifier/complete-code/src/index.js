/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import { blocks } from './blocks/text';
import { forBlock } from './generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
import './index.css';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);

// Define a custom Halloween theme that extends the built-in Classic theme.
Blockly.Themes.Halloween = Blockly.Theme.defineTheme('halloween', {
  base: Blockly.Themes.Classic,
  categoryStyles: {
    logic_category: {
      colour: '#8b4513',
    },
    loop_category: {
      colour: '#85E21F',
    },
    math_category: {
      colour: '#542788',
    },
    text_category: {
      colour: '#FE9B13',
    },
    list_category: {
      colour: '#4a148c',
    },
    variable_category: {
      colour: '#cc0000',
    },
    procedure_category: {
      colour: '#1b5e20',
    },
  },
  blockStyles: {
    logic_blocks: {
      colourPrimary: '#8b4513',
      colourSecondary: '#ff0000',
      colourTertiary: '#C5EAFF',
    },
    loop_blocks: {
      colourPrimary: '#85E21F',
      colourSecondary: '#ff0000',
      colourTertiary: '#C5EAFF',
    },
    math_blocks: {
      colourPrimary: '#542788',
      colourSecondary: '#9a7fc7',
      colourTertiary: '#cdb6e9',
    },
    text_blocks: {
      colourPrimary: '#FE9B13',
      colourSecondary: '#ff0000',
      colourTertiary: '#C5EAFF',
    },
    list_blocks: {
      colourPrimary: '#4a148c',
      colourSecondary: '#AD7BE9',
      colourTertiary: '#CDB6E9',
    },
    variable_blocks: {
      colourPrimary: '#cc0000',
      colourSecondary: '#ff6666',
      colourTertiary: '#ffcccc',
    },
    procedure_blocks: {
      colourPrimary: '#1b5e20',
      colourSecondary: '#4caf50',
      colourTertiary: '#c8e6c9',
    },
  },
  componentStyles: {
    workspaceBackgroundColour: '#ff7518',
    toolboxBackgroundColour: '#F9C10E',
    toolboxForegroundColour: '#fff',
    flyoutBackgroundColour: '#252526',
    flyoutForegroundColour: '#ccc',
    flyoutOpacity: 1,
    scrollbarColour: '#ff0000',
    insertionMarkerColour: '#fff',
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    cursorColour: '#d0d0d0',
    blackBackground: '#333',
  },
});

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = Blockly.inject(blocklyDiv, {
  toolbox,
  theme: Blockly.Themes.Halloween,
});

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const code = javascriptGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;

  outputDiv.innerHTML = '';

  // Wrap `eval` in a `try/catch` so that any runtime errors are
  // logged to the console, instead of failing quietly.
  try {
    eval(code);
  } catch (error) {
    console.log(error);
  }
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (
    e.isUiEvent ||
    e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()
  ) {
    return;
  }
  runCode();
});
