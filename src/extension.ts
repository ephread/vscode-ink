// The module 'vscode' contains the VS Code extensibility API.
// Import the module and reference it with the alias vscode in your code below.
import * as vscode from 'vscode';
import { activateLanguageClient, deactivateLanguageClient } from "./client";

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext) {
    activateLanguageClient(context);

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('ink.useLanguageServer')) {
            let configuration = vscode.workspace.getConfiguration('ink');
            let useLanguageServer: boolean = configuration.get('useLanguageServer', false);
            if (useLanguageServer) {
                activateLanguageClient(context);
            } else {
                deactivateLanguageClient();
            }
        }
    });
}

// This method is called when your extension is deactivated.
export function deactivate(): Thenable<void> {
    return deactivateLanguageClient();
}
