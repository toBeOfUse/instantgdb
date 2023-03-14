const { existsSync } = require("fs");
const path = require("path");
const vscode = require("vscode");

function parseArgs(input) {
  //The parenthesis in the regex creates a captured group within the quotes
  const myRegexp = /[^\s"]+|"([^"]*)"/gi;
  const myArray = [];
  let match = null;
  do {
    //Each call to exec returns the next regex match as an array
    match = myRegexp.exec(input);
    if (match != null) {
      //Index 1 in the array is the captured group if it exists
      //Index 0 is the matched text, which we use if no captured group exists
      myArray.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);
  return myArray;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "instantgdb.startGDB",
    async function () {
      if (
        !(
          vscode.workspace.workspaceFolders &&
          vscode.workspace.workspaceFolders.length > 0
        )
      ) {
        vscode.window.showErrorMessage(
          "please go to the file menu and open the folder your executable is in"
        );
        return;
      }

      const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
      console.log(vscode.workspace.workspaceFolders);

      const gdbCommand = await vscode.window.showInputBox({
        placeHolder: "./a.out [arg1 arg2 ...]",
        prompt: "Executable to debug",
      });
      if (!gdbCommand) {
        return;
      }
      const cmds = parseArgs(gdbCommand);
      const exe = path.resolve(workspaceFolder, cmds[0]);
      const args = cmds.slice(1);
      if (!existsSync(exe)) {
        vscode.window.showErrorMessage(
          `"${exe}" not found; please make sure you have the right folder open using file->open folder`
        );
        return;
      }
      // we could take in a configuration option that could then be merged down onto this one, overwriting where contradicts
      const debugConfig = {
        type: "cppdbg",
        request: "launch",
        program: exe,
        args: args,
        stopAtEntry: false,
        cwd: workspaceFolder,
        externalConsole: true,
      };
      console.log("IGDB", debugConfig);
      vscode.debug
        .startDebugging(vscode.workspace.workspaceFolders[0], debugConfig)
        .then(function () {
          console.log(arguments);
        });
    }
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
