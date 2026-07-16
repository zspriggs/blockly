/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';

class ToolboxLabel extends Blockly.ToolboxItem {
  /** @override */
  init() {
    // Create the label.
    this.label = document.createElement('label');
    // Set ARIA role and description, so that screenreaders can see and read the label
    this.label.setAttribute('role', 'treeitem');
    this.label.setAttribute('aria-roledescription', 'label');
    // Set the id.
    this.label.id = this.getId();
    // Set the name.
    this.label.textContent = this.toolboxItemDef_['name'];
    // Set the color.
    this.label.style.color = this.toolboxItemDef_['colour'];

    const cssConfig = this.toolboxItemDef_['cssconfig'];
    // Add the class.
    if (cssConfig) {
      this.label.classList.add(cssConfig['label']);
    }
  }

  /** @override */
  getDiv() {
    return this.label;
  }
}

export function registerToolboxLabel() {
  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    'toolboxlabel',
    ToolboxLabel,
  );
}
