// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below.
import { ExtensionContext, workspace } from 'vscode';
import * as languageClient from "./client";
import * as statistics from "./statistics";

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed.
export function activate(context: ExtensionContext) {
    languageClient.activate(context);
    statistics.activate(context);

    workspace.onDidChangeConfiguration(event => {
        languageClient.handleConfigurationChange(event, context);
    });
}

// This method is called when your extension is deactivated.
export function deactivate(): Thenable<void> {
    return Promise.all([
        languageClient.deactivate(),
        statistics.deactivate()
    ]).then(() => {
        return Promise.resolve();
    });
}
