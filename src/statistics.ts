import * as vscode from 'vscode';
import { StatisticsPanel } from './panels/statistics';
import { LanguageClient } from 'vscode-languageclient';
import { StatisticsParams, Statistics } from './types';

const statisticsCommandId = 'ink.showStatistics';

let wordsStatusbarItem: vscode.StatusBarItem;
let statisticsStore: Map<string, Statistics> = new Map();

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(statisticsCommandId, () => {
            let documentUri = getMainDocumentUri();

            if (!documentUri) {
                documentUri = vscode.window.activeTextEditor?.document.uri;
            }

            if (documentUri) {
                let statistics = statisticsStore.get(documentUri.toString());
                if (statistics) {
                    StatisticsPanel.createOrShow(
                        context.extensionPath,
                        statistics,
                        documentUri
                    );
                }
            }
        })
    );

    wordsStatusbarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    wordsStatusbarItem.command = statisticsCommandId;
    wordsStatusbarItem.tooltip = "Show statistics for the current story";
    context.subscriptions.push(wordsStatusbarItem);

    // register some listener that make sure the status bar
    // item always up-to-date
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));

    // update status bar item once at start
    updateStatusBarItem();
}

export function deactivate(): Thenable<void> {
    statisticsStore.clear();
    return Promise.resolve();
}

export function registerStatisticsNotification(client: LanguageClient) {
    client.onNotification("story/statistics", (params: StatisticsParams) => {
        const documentUri = vscode.Uri.parse(params.mainDocumentUri, true);
        statisticsStore.set(documentUri.toString(), params.statistics);

        updateStatusBarItem();
    });
}

function updateStatusBarItem(): void {
    if (vscode.window.activeTextEditor?.document.languageId === 'ink') {
        let documentUri = getMainDocumentUri();

        if (!documentUri) {
            documentUri = vscode.window.activeTextEditor?.document.uri;
        }

        if (documentUri) {
            let statistics = statisticsStore.get(documentUri.toString());
            if (statistics) {
                wordsStatusbarItem.show();
                wordsStatusbarItem.text = `ink: ${statistics.words.toLocaleString('en-US')} words`;
            }
        }
    } else {
        wordsStatusbarItem.hide();
    }
}

function getMainDocumentUri() {
    const configuration = vscode.workspace.getConfiguration("ink");
    const mainFilePath: string | undefined = configuration.get('languageServer.mainFilePath');

    if (!mainFilePath) { return; }

    var workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) { return; }

    var workspaceUri = workspaceFolders[0].uri;
    return vscode.Uri.joinPath(workspaceUri, mainFilePath);
}
