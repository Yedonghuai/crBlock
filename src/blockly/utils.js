/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
export function start() {

  // Setup blocks
  // Parse the URL arguments.
  var locale = 'zh-cn';
  Blockly.ScratchMsgs.setLocale(locale);
  // document.forms.options.elements.locale.value = locale;

  // Create main workspace.
  window.workspace = Blockly.inject('blocklyDiv', {
    comments: true,
    disable: false,
    collapse: false,
    readOnly: false,
    rtl: false,
    scrollbars: true,
    toolbox: null,
    toolboxPosition: 'top',
    trashcan: true,
    sounds: false,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.75,
      maxScale: 4,
      minScale: 0.25,
      scaleSpeed: 1.1
    },
    colours: {
      fieldShadow: 'rgba(255, 255, 255, 0.3)',
      dragShadowOpacity: 0.6
    }
  });
  pythonGenerator()
}

export function getToolboxElement() {
  var match = location.search.match(/toolbox=([^&]+)/);
  return document.getElementById('toolbox-' + (match ? match[1] : 'categories'));
}

export function toXml() {
  var output = document.getElementById('importExport');
  var xml = Blockly.Xml.workspaceToDom(workspace);
  output.value = Blockly.Xml.domToPrettyText(xml);
  output.focus();
  output.select();
  taChange();
}

export function fromXml() {
  var input = document.getElementById('importExport');
  var xml = Blockly.Xml.textToDom(input.value);
  Blockly.Xml.domToWorkspace(xml, workspace);
  taChange();
}

export function toCode(lang) {
  var output = document.getElementById('codeDisplay');
  output.value = Blockly[lang].workspaceToCode(workspace);
}

export function pythonGenerator() {
  Blockly.Python = new Blockly.Generator('Python');
  Blockly.Python["motion_movesteps"] = function (block) {
    var arg0 = Blockly.Python.valueToCode(block, 'STEPS');
    console.log(block, arg0)
    return 'Python Code'
  }
  Blockly.Python['math_number'] = function (block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    return [code];
  };
}

// Disable the "Import from XML" button if the XML is invalid.
// Preserve text between page reloads.
export function taChange() {
  var textarea = document.getElementById('importExport');
  if (sessionStorage) {
    sessionStorage.setItem('textarea', textarea.value);
  }
  var valid = true;
  try {
    Blockly.Xml.textToDom(textarea.value);
  } catch (e) {
    valid = false;
  }
  document.getElementById('import').disabled = !valid;
}

export function logEvents(state) {
  var checkbox = document.getElementById('logCheck');
  checkbox.checked = state;
  if (sessionStorage) {
    sessionStorage.setItem('logEvents', state ? 'checked' : '');
  }
  if (state) {
    workspace.addChangeListener(logger);
  } else {
    workspace.removeChangeListener(logger);
  }
}

export function logFlyoutEvents(state) {
  var checkbox = document.getElementById('logFlyoutCheck');
  checkbox.checked = state;
  if (sessionStorage) {
    sessionStorage.setItem('logFlyoutEvents', state ? 'checked' : '');
  }
  var flyoutWorkspace = (workspace.flyout_) ? workspace.flyout_.workspace_ :
    workspace.toolbox_.flyout_.workspace_;
  if (state) {
    flyoutWorkspace.addChangeListener(logger);
  } else {
    flyoutWorkspace.removeChangeListener(logger);
  }
}

export function logger(e) {
  console.log(e);
}

export function glowBlock() {
  if (Blockly.selected) {
    workspace.glowBlock(Blockly.selected.id, true);
  }
}

export function unglowBlock() {
  if (Blockly.selected) {
    workspace.glowBlock(Blockly.selected.id, false);
  }
}

export function glowStack() {
  if (Blockly.selected) {
    workspace.glowStack(Blockly.selected.id, true);
  }
}

export function unglowStack() {
  if (Blockly.selected) {
    workspace.glowStack(Blockly.selected.id, false);
  }
}

export function reportDemo() {
  if (Blockly.selected) {
    workspace.reportValue(
      Blockly.selected.id,
      document.getElementById('reportValue').value
    );
  }
}

export function setLocale(locale) {
  workspace.getFlyout().setRecyclingEnabled(false);
  var xml = Blockly.Xml.workspaceToDom(workspace);
  Blockly.ScratchMsgs.setLocale(locale);
  Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
  workspace.getFlyout().setRecyclingEnabled(true);
}