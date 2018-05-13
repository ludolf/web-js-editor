import 'bootstrap-css-only/css/bootstrap.min.css';
import './jseditor.css';

import $ from 'jquery-slim';
import ace from 'ace-builds/src-min-noconflict/ace.js';
import FileSave from 'file-saver';

import Messages from './messages.json';

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

  constructor(container, jsMessages, saveAsFile) {
    this._container = container;
    this._messages = jsMessages;
    this._saveAsFile = saveAsFile;

    this._customCode = container.html();
  }
  
  _msg(title) {
    return this._messages.msg(title);
  }
  
  init() {
    this._setupLayout(this._container);
  }

  _setupLayout(container) {
    const main = $('<div id="main"></div>');
    const editor = $('<div id="editorMain"></div>');
    const workspace = $('<div id="workspaceMain"><div id="workspace">ws</div><div id="console">console</div></div>');

    main.append(editor)
        .append(workspace);

    container.html(main);

    this._setupJsEditor(editor);

    return main;
  }

  _setupJsEditor(container) {
    const jseditor = $('<pre id="editor">' + (this._customCode ? this._customCode : this._msg('defaultCode')) + '</pre>');
    const scriptBlock = $('<div id="script" style="display:none"></div>');

    container.html(jseditor);

    const executeCode = (code) => this._executeCode(code, scriptBlock);

    ace.config.set('basePath', 'js/ace');

    const aceEditor = ace.edit('editor');
    aceEditor.session.setMode('ace/mode/javascript');
    aceEditor.commands.addCommand({
        name: 'Execute',
        bindKey: { win: 'Ctrl-Enter',  mac: 'Command-Enter' },
        exec: function(_editor) {
             executeCode(_editor.getValue());
        }
    });
    aceEditor.setTheme("ace/theme/clouds");
    aceEditor.focus();

    this._setupControls(
        container,
        () => this._executeCode(aceEditor.getValue(), scriptBlock),
        () => this._saveCode(aceEditor.getValue()),
        (theme) => aceEditor.setTheme("ace/theme/" + theme)
    );

    jseditor.after(scriptBlock);

    return jseditor;
  }

  _setupControls(container, executeCode, saveCode, changeTheme) {
    const form = $('<form action="#" id="form"></form>');

    const controls = $('<div id="controls"></div>');

    const themes = $('<select id="themes">'
      + '<option value="clouds">' + this._msg('theme_clouds') + '</option>'
      + '<option value="dracula">' + this._msg('theme_dracula') + '</option>'
    + '</select>');

    themes.change(() => this._changeTheme(themes.val(), changeTheme));

    const runButton = $('<button type="button" class="button run">' + this._msg('runButton') + '</button>');
    const saveButton = $('<button type="button" class="button save">' + this._msg('saveButton') + '</button>');

    runButton.click(() => executeCode());
    saveButton.click(() => saveCode());

    controls.append(runButton);
    controls.append(saveButton);

    form.append(themes);
    form.append(controls);

    container.append(form);

    themes.height(runButton.height());

    return form;
  }

  _executeCode(code, scriptBlock) {
    let scriptEl = $(document.createElement("script"));
    scriptEl.html(code);
    scriptBlock.html(scriptEl);
  }

  _saveCode(code) {
    this._saveAsFile(code, 'jseditor-' + new Date().toISOString().substr(0, 10) + '.txt')
  }

  _changeTheme(theme, changeEditorTheme) {
    $('body').removeClass(function(index, className) {
      return (className.match(/(^|\s)theme-\S+/g) || []).join(' ');
    });
    $('body').addClass('theme-' + theme);

    changeEditorTheme(theme);
  }
}

var _jsEditor;

$(function() {
  const containerEl = $('#jsEditor');

  const jsEditorMessages = new JsEditorMessages(Messages);

  const saveAsFile = (code, filename) => {
    const blob = new Blob([code], {type: 'text/plain;charset=utf-8'});
    FileSave.saveAs(blob, filename);
  }

  _jsEditor = new JsEditor(containerEl, jsEditorMessages, saveAsFile);
  _jsEditor.init();
  
  document.title = jsEditorMessages.msg('title');

});