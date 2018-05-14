import 'bootstrap-css-only/css/bootstrap.min.css';
import './jseditor.css';

import $ from 'jquery-slim';
import ace from 'ace-builds/src-min-noconflict/ace.js';
import FileSave from 'file-saver';

import Messages from './messages.json';
import {resizer} from './util/resizer';

const JsEditorMessages = function (messages) {

    this._default_lang_name = 'en';
    this._messages = messages;

    this.msg = function (title) {

        const customLang = this._getParameterByName('lang');

        const lang = customLang ? customLang.toLowerCase()
                : (window.navigator && window.navigator.language) ? window.navigator.language.substring(0, 2)
                             : this._default_lang_name;

        return (this._messages[lang] && this._messages[lang][title]) ? this._messages[lang][title]
                : this._messages[this._default_lang_name][title] ? this._messages[this._default_lang_name][title]
                       : title;
    }

    this._getParameterByName = function (name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}

const JsEditor = function (container, jsMessages, saveAsFile) {

    this._container = container;
    this._messages = jsMessages;
    this._saveAsFile = saveAsFile;

    this._customCode = container.html();

    this._msg = function (title) {
        return this._messages.msg(title);
    }

    this.init = function () {
        this._setupLayout(this._container);
    }

    this._setupLayout = function (container) {
        const main = $('<div id="main"></div>');
        const editor = $('<div id="editorMain"></div>');
        const workspace = $('<div id="workspaceMain">'
                            + '<div id="workspace"></div>'
                            + '<div id="terminalMain"><div id="terminal"></div></div>'
                            + '</div>');

        main.append(editor).append(workspace);

        container.html(main);

        const help = $('#help');
        const helpDiv = $('<div id="helpDiv"></div>');
        helpDiv.html(help.html());
        help.html(helpDiv);

        this._setupJsEditor(editor, help);

        help.width(editor.width());

        return main;
    }

    this._setupJsEditor = function (container, help) {
        const _this = this;

        const jseditor = $('<pre id="editor">' + (this._customCode ? this._customCode : this._msg('defaultCode')) + '</pre>');
        const scriptBlock = $('<div id="script" style="display:none"></div>');

        container.html(jseditor);

        const executeCode = function (code) {
            _this._executeCode(code, scriptBlock);
        }

        ace.config.set('basePath', 'js/ace');

        const aceEditor = ace.edit('editor');
        aceEditor.session.setMode('ace/mode/javascript');
        aceEditor.commands.addCommand(
                {
                    name: 'Execute',
                    bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
                    exec: function (_editor) {
                        executeCode(_editor.getValue());
                    }
                });
        aceEditor.setTheme("ace/theme/clouds");
        aceEditor.focus();

        this._setupControls(
                container,
                function () {
                    return _this._executeCode(aceEditor.getValue(), scriptBlock);
                },
                function () {
                    return _this._saveCode(aceEditor.getValue());
                },
                function (theme) {
                    return aceEditor.setTheme("ace/theme/" + theme);
                }
        );

        jseditor.after(scriptBlock);

        resizer(jseditor, help, function () {
            aceEditor.resize();
        });

        return jseditor;
    }

    this._setupControls = function (container, executeCode, saveCode, changeTheme) {
        const _this = this;

        const form = $('<form action="#" id="form"></form>');

        const controls = $('<div id="controls"></div>');

        const themes = $('<select id="themes">'
                         + '<option value="clouds">' + this._msg('theme_clouds') + '</option>'
                         + '<option value="dracula">' + this._msg('theme_dracula') + '</option>'
                         + '</select>');

        themes.change(function () {
            return _this._changeTheme(themes.val(), changeTheme);
        });

        const runButton = $('<button type="button" class="button run">' + this._msg('runButton') + '</button>');
        const saveButton = $('<button type="button" class="button save">' + this._msg('saveButton') + '</button>');

        runButton.click(function () {
            return executeCode();
        });
        saveButton.click(function () {
            return saveCode();
        });

        controls.append(runButton);
        controls.append(saveButton);

        form.append(themes);
        form.append(controls);

        container.append(form);

        themes.height(runButton.height());

        return form;
    }

    this._executeCode = function (code, scriptBlock) {
        const scriptEl = $(document.createElement("script"));
        scriptEl.html(code);
        scriptBlock.html(scriptEl);
    }

    this._saveCode = function (code) {
        this._saveAsFile(code, 'jseditor-' + new Date().toISOString().substr(0, 10) + '.txt')
    }

    this._changeTheme = function (theme, changeEditorTheme) {
        $('body').removeClass(function (index, className) {
            return (className.match(/(^|\s)theme-\S+/g) || []).join(' ');
        });
        $('body').addClass('theme-' + theme);

        changeEditorTheme(theme);
    }
}

var _jsEditor;

$(function () {
    const containerEl = $('#jsEditor');

    const jsEditorMessages = new JsEditorMessages(Messages);

    const saveAsFile = function (code, filename) {
        const blob = new Blob([code], {type: 'text/plain;charset=utf-8'});
        FileSave.saveAs(blob, filename);
    }

    _jsEditor = new JsEditor(containerEl, jsEditorMessages, saveAsFile);
    _jsEditor.init();

    document.title = jsEditorMessages.msg('title');

});