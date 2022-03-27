import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { StalinBot } from "./stalinBot";

export function activate() {
  let bot = new StalinBot();

  let queryUrl = vscode.commands.registerCommand("codeyoinker.queryUrl", () => {
    vscode.window.activeTextEditor?.document.save();
    vscode.window.showInputBox().then(async (search) => {
      if (search !== undefined) {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Fetching data...",
            cancellable: false,
          },
          async (progress, token) => {
            await bot.query(search);
            templatelist = bot.getData;

            vscode.window.activeTextEditor?.document.save();
            //templatelist.forEach((v) => doThing(v));

            const p = new Promise<void>((resolve) => {
              resolve();
            });

            return p;
          }
        );
      } else {
        vscode.window.showErrorMessage("Boite vide");
      }
    });
  });

  let pt = vscode.commands.registerCommand("codeyoinker.pt", async () => {});

  vscode.commands.registerCommand("codeyoinker.stackoverflow", () => {
    vscode.window.showInputBox().then(() => {
      fetch(
        "https://api.stackexchange.com/2.2/questions?pagesize=5&tagged=inflation&site=economics"
      )
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            return response.status;
          }
        })
        .then((rJsn) => console.log(rJsn))
        .catch((err) => console.log(err));
    });
  });
  vscode.commands.registerCommand("codeyoinker.test", () => {
    write(templatelist[currentPos]);
  });

  vscode.commands.registerCommand("codeyoinker.incrementPos", () => {
    if (currentPos >= -1 && currentPos < templatelist.length - 1) {
      currentPos++;
      replaceSelection(templatelist, currentPos);
    }
  });

  vscode.commands.registerCommand("codeyoinker.decrementPos", () => {
    if (currentPos > 0 && currentPos < templatelist.length) {
      currentPos--;
      replaceSelection(templatelist, currentPos);
    }
  });

  //context.subscriptions.push(queryUrl);
}

function write(content: string) {
  vscode.window.activeTextEditor?.document.save();
  var htmlContent = content;
  var currentlyOpenTabfilePath =
    vscode.window.activeTextEditor?.document.uri.fsPath;
  if (currentlyOpenTabfilePath !== undefined) {
    vscode.window.activeTextEditor?.document.save();
    fs.appendFile(currentlyOpenTabfilePath, htmlContent, (err) => {
      if (err) {
        console.log(err);
        return vscode.window.showErrorMessage(err.message);
      }
    });
  } else {
    if (vscode.workspace.workspaceFolders !== undefined) {
      currentlyOpenTabfilePath = vscode.workspace.workspaceFolders[0].uri
        .toString()
        .split(":")[1];
      currentlyOpenTabfilePath = currentlyOpenTabfilePath.substring(
        currentlyOpenTabfilePath.indexOf("/", 4),
        undefined
      );
      currentlyOpenTabfilePath = "C:" + currentlyOpenTabfilePath;
      vscode.window.showInformationMessage(currentlyOpenTabfilePath);
      fs.writeFile(
        path.join(currentlyOpenTabfilePath, "search.html"),
        htmlContent,
        (err) => {
          if (err) {
          }
        }
      );
    }
  }
}

let templatelist: string[] = ["ddada", "djjdjajndka"];
let currentPos: number = -1;

function replaceSelection(templatelist: string[], currentPos: number) {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    return; // No open text editor
  }

  let spos = vscode.window.activeTextEditor?.selection.start;
  let epos = vscode.window.activeTextEditor?.selection.end;
  let sline = vscode.window.activeTextEditor?.selection.start.line ?? 0;
  let eline = vscode.window.activeTextEditor?.selection.end.line ?? 0;
  var textRange = new vscode.Range(
    sline,
    spos?.character ?? 0,
    eline,
    epos?.character ?? 0
  );

  textEditor.edit(function (editBuilder) {
    editBuilder.replace(textRange, templatelist[currentPos]);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
