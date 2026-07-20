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

// Register context menu items
registerHelloWorldItem();
registerHelpItem();
registerDisplayItem();
Blockly.ContextMenuRegistry.registry.unregister('workspaceDelete');
registerSeparators();
Blockly.ContextMenuItems.registerCommentOptions();

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

function registerHelloWorldItem() {
  const helloWorldItem = {
    displayText: 'Hello World',
    preconditionFn: function (scope) {
      // Only display this option for workspaces and blocks.
      if (
        scope.focusedNode instanceof Blockly.WorkspaceSvg ||
        scope.focusedNode instanceof Blockly.BlockSvg
      ) {
        // Enable for the first 30 seconds of every minute; disable for the next 30 seconds.
        const now = new Date(Date.now());
        if (now.getSeconds() < 30) {
          return 'enabled';
        }
        return 'disabled';
      }
      return 'hidden';
    },
    callback: function (scope) {},
    id: 'hello_world',
    weight: 100,
  };
  Blockly.ContextMenuRegistry.registry.register(helloWorldItem);
}

function registerHelpItem() {
  const helpItem = {
    displayText: 'Help! There are no blocks',
    preconditionFn: function (scope) {
      // Only display this option on workspace context menus.
      if (!(scope.focusedNode instanceof Blockly.WorkspaceSvg)) return 'hidden';
      // Use the focused node, which is a WorkspaceSvg, to check for blocks on the workspace.
      if (!scope.focusedNode.getTopBlocks().length) {
        return 'enabled';
      }
      return 'hidden';
    },
    // Use the focused node in the callback function to add a block to the workspace.
    callback: function (scope) {
      Blockly.serialization.blocks.append(
        {
          type: 'text',
          fields: {
            TEXT: 'Now there is a block',
          },
        },
        scope.focusedNode,
      );
    },
    id: 'help_no_blocks',
    weight: 100,
  };
  Blockly.ContextMenuRegistry.registry.register(helpItem);
}

function registerDisplayItem() {
  const displayItem = {
    // Use the focused node (a BlockSvg) to set display text dynamically based on the type of the block.
    displayText: function (scope) {
      if (scope.focusedNode.type.startsWith('text')) {
        return 'Text block';
      } else if (scope.focusedNode.type.startsWith('controls')) {
        return 'Controls block';
      } else {
        return 'Some other block';
      }
    },
    preconditionFn: function (scope) {
      return scope.focusedNode instanceof Blockly.BlockSvg
        ? 'enabled'
        : 'hidden';
    },
    callback: function (scope) {},
    id: 'display_text_example',
    weight: 100,
  };
  Blockly.ContextMenuRegistry.registry.register(displayItem);
}

function registerSeparators() {
  const workspaceSeparator = {
    id: 'workspace_separator',
    scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
    weight: 99,
    separator: true,
  };
  Blockly.ContextMenuRegistry.registry.register(workspaceSeparator);

  const blockSeparator = {
    id: 'block_separator',
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    weight: 99,
    separator: true,
  };
  Blockly.ContextMenuRegistry.registry.register(blockSeparator);
}
