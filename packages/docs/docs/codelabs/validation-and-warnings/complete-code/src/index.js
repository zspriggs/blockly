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

// Register the 'list_range_validation' extension that the list_range block
// uses. The extension function runs every time a list_range block is created,
// with the block instance available as `this`.
Blockly.Extensions.register('list_range_validation', function () {
  // Force the LAST field to be an odd number.
  this.getField('LAST').setValidator(function (newValue) {
    return Math.round((newValue - 1) / 2) * 2 + 1;
  });

  // Validate the entire block whenever any part of it changes,
  // and display a warning if the block cannot be made valid.
  this.setOnChange(function (event) {
    const first = this.getFieldValue('FIRST');
    const last = this.getFieldValue('LAST');
    const valid = first < last;
    this.setWarningText(
      valid
        ? null
        : `The first number (${first}) must be smaller than the last number (${last}).`,
    );

    // Disable invalid blocks (unless it's in a toolbox flyout,
    // since you can't drag disabled blocks to your workspace).
    if (!this.isInFlyout) {
      const initialGroup = Blockly.Events.getGroup();
      // Make it so the move and the disable event get undone together.
      Blockly.Events.setGroup(event.group);
      this.setDisabledReason(!valid, 'Invalid range');
      Blockly.Events.setGroup(initialGroup);
    }
  });
});

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = Blockly.inject(blocklyDiv, { toolbox });

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
