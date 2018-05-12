import './jseditor.css';
import Messages from './messages.json';

import $ from 'jquery-slim';
import FileSave from 'file-saver';

class JsEditorMessages {

    constructor(messages) {
        this._default_lang = 'def';
        this._messages = messages;
    }

    msg(title) {
        let lang = (window.navigator && window.navigator.language) ? window.navigator.language.substring(0, 2) : this._default_lang;

        return (this._messages[lang] && this._messages[lang][title]) ? this._messages[lang][title] :
          (this._messages[this._default_lang][title]) ? this._messages[this._default_lang][title] :
             title;
    }
}

class JsEditor {

  constructor(jsEditor, jsMessages, saveAsFile) {
    this._jsEditor = jsEditor;
    this._messages = jsMessages;
    this._saveAsFile = saveAsFile;
  }

  _executeCode(code, scriptBlock) {
    let scriptEl = $(document.createElement("script"));
    scriptEl.html(code);
    scriptBlock.html(scriptEl);  
  }
  
  _saveCode(code) {
    this._saveAsFile(code, 'jseditor-' + new Date().toISOString().substr(0, 10) + '.txt')
  }
  
  _changeTheme(theme, aceEditor) {
    $('body').removeClass(function(index, className) {
      return (className.match(/(^|\s)theme-\S+/g) || []).join(' ');
    });
    $('body').addClass('theme-' + theme);
    
    aceEditor.setTheme("ace/theme/" + theme);
  }
  
  _msg(title) {
    return this._messages.msg(title);
  }
  
  init() {
    const defaultCode = this._jsEditor.html() ? this._jsEditor.html() : this._msg('defaultCode');

    const code = $('<pre id="editor">' + defaultCode + '</pre>');
    const form = $('<form action="#" id="form"></form>');
    const scriptBlock = $('<div id="script" style="display:none"></div>');

    const controls = $('<div id="controls"></div>');

    const themes = $('<select id="themes">'
        + '<option value="clouds">' + this._msg('theme_clouds') + '</option>'
        + '<option value="dracula">' + this._msg('theme_dracula') + '</option>'
      + '</select>');

    const runButton = $('<button type="button" class="button run">' + this._msg('runButton') + '</button>');
    const saveButton = $('<button type="button" class="button save">' + this._msg('saveButton') + '</button>');

    controls.append(runButton);
    controls.append(saveButton);

    form.append(code);
    form.append(themes);
    form.append(controls);

    this._jsEditor.html(form);
    this._jsEditor.append(scriptBlock);

    themes.height(runButton.height());

    const executeCode = this._executeCode;

    const aceEditor = ace.edit("editor");
    aceEditor.session.setMode("ace/mode/javascript");
    aceEditor.commands.addCommand({
        name: 'Execute',
        bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
        exec: function(editor) {
             executeCode(editor.getValue(), scriptBlock);
        }
    });
    aceEditor.setTheme("ace/theme/clouds");
    aceEditor.focus();

    runButton.click(() => this._executeCode(aceEditor.getValue(), scriptBlock));
    saveButton.click(() => this._saveCode(aceEditor.getValue()));

    themes.change(() => this._changeTheme(themes.val(), aceEditor));
  }
}

var _jsEditor;

$(function() {
  const jsEditorEl = $('#jsEditor');

  const jsEditorMessages = new JsEditorMessages(Messages);

  const saveAsFile = (code, filename) => {
    const blob = new Blob([code], {type: 'text/plain;charset=utf-8'});
    FileSave.saveAs(blob, filename);
  }

  _jsEditor = new JsEditor(jsEditorEl, jsEditorMessages, saveAsFile);
  _jsEditor.init();
  
  document.title = jsEditorMessages.msg('title');
});