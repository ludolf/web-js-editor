const jsEditorMessages = {

  _default_lang: 'def',
  
  _messages: {
    def: {
      defaultCode: 'alert("Let your code dance!");',
      runButton: 'Run it!',
      saveButton: 'Save',
      theme_clouds: 'Clouds',
      theme_dracula: 'Dracula'
    },
    de: {
      defaultCode: 'alert("Lass deinen Code tanzen!");',
      runButton: 'Ausführen!',
      saveButton: 'Speichern',
      theme_clouds: 'Wolken',
      theme_dracula: 'Dracula'    
    }
  },
  
  msg: function(title) {    
    let lang = (window.navigator && window.navigator.language) ? window.navigator.language.substring(0, 2) : this._default_lang; 
    
    return (this._messages[lang] && this._messages[lang][title]) ? this._messages[lang][title] : 
      (this._messages[this._default_lang][title]) ? this._messages[this._default_lang][title] :
         title;
  }
}

class JsEditor {

  constructor(jsEditor, messages) {
    this._jsEditor = jsEditor;
    this._messages = messages;
  }

  _executeCode(code, scriptBlock) {
    let scriptEl = $(document.createElement("script"));
    scriptEl.html(code);
    scriptBlock.html(scriptEl);  
  }
  
  _saveCode(code) {
    let blob = new Blob([code], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, 'jseditor.txt'); 
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
    const code = $('<pre id="editor">' + this._msg('defaultCode') + '</pre>');
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
  _jsEditor = new JsEditor($('#jsEditor'), jsEditorMessages);
  _jsEditor.init();
});