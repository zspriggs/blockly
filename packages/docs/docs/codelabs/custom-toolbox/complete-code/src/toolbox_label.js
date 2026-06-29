import * as Blockly from 'blockly';

class ToolboxLabel extends Blockly.ToolboxItem {
  constructor(toolboxItemDef, parentToolbox) {
    super(toolboxItemDef, parentToolbox);
  }

  /** @override */
  init() {
    // Create the label.
    this.label = document.createElement('label');
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

Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  'toolboxlabel',
  ToolboxLabel,
);