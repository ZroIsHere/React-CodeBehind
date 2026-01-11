# React VSCode CodeBehind (as asp.net)

Go to execute command on VSCode (ctrl + shift + p) and search `Open Settings(JSON)`. Then, paste this 
```
{
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    "*.jsx": "${capture}.css, ${capture}.module.css, ${capture}.scss, ${capture}.module.scss",
    "*.tsx": "${capture}.css, ${capture}.module.css, ${capture}.scss, ${capture}.module.scss"
  }
}
```
Use the commands `install.bat` and `compile.bat`. This will go to generate a .vsix

Finally, open the extension menu, click on the dots (top right) and press Install .vsix

Reset VSCode and you are done