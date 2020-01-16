# Project Title

Car hub backend server

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

  NodeJS
  https://nodejs.org/en/download/

  Postman
  https://www.getpostman.com/downloads/

  Yarn
  ```
  choco install yarn
  ```

### Installing

Follow these step to get a development env running

Clone the repository

```
git clone https://github.com/truongpham17/carhub-service.git
```

Install packages

```
yarn install
```



Open folder src, add env/dev.env file with content in slack


## Static compilation
  Install extensions

  Prettier - Code formatter
  Eslint

  Open VSCode settings, choose Edit in settings.json, and change the content as following:
  ```
  {
    "editor.fontFamily": "Operator Mono Lig",
    "editor.formatOnSave": true,
    "[javascript]": {
        "editor.formatOnSave": false
    },
    "eslint.autoFixOnSave": true,
    "prettier.disableLanguages": [
        "js",
        "graphql"
    ],
    "javascript.updateImportsOnFileMove.enabled": "never",
    "editor.tabSize": 2,
    "window.zoomLevel": -1,
    "workbench.startupEditor": "newUntitledFile",
    "editor.fontSize": 16,
    "editor.parameterHints": false,
    "javascript.validate.enable": false,
    "workbench.colorTheme": "Atom One Dark",
    "editor.suggestSelection": "first",
    "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
    "java.configuration.checkProjectSettingsExclusions": false,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
  }
  ```

  Open the src/constants/TestPrettierAndEslint.js, and add these following code: 
  ```
  const a = 12 ;;


  ```
  Installing static compilation is success when the VSCode show error, and when Ctrl + S, it automaticly re-format the code.

## Deployment

Create your own branch before coding
Deploy to your branch, and create merge request and assign to @truongpham17

## Running

Starting bundle
```
yarn dev
```


## Authors

* **Truong Pham** - *Initial work* 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

