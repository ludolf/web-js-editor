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
Set up the JS variable `defLang` to the demanded language.
```
<head>
    ...
    <script>
        var defLang = 'de'; // for German
    </script>
</head>
```  

## Usage
```
var workspace = $('#workspace');
var terminal = $('#terminal');
```