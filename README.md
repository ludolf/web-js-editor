# JavaScript Web Editor for Kids

## Prerequisites
```
npm i -g webpack webpack-cli
npm i
```

## Build 
```
# dev
npm run build -- --mode development
# prod
npm run build -- --mode production
```

## Run
```
dist/index.html
```

## Config
Set the `lang` GET parameter to set up the app language.
```
index.html?lang=de 
```  

## Usage
Execute the code by `Ctrl+Enter`.

You can use the workspace and terminal:
```
var workspace = $('#workspace');
terminal.print('some text');
terminal.clean();
```