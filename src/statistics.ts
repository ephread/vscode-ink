import * as vscode from 'vscode';
import { StatisticsPanel } from './panels/statistics';
import { LanguageClient } from 'vscode-languageclient';
import { StatisticsParams, Statistics } from './types';

const statisticsCommandId = 'ink.showStatistics';
let wordsStatusbarItem: vscode.StatusBarItem;
let statistics: Statistics | undefined;
let mainFileUri: vscode.Uri | undefined;

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(statisticsCommandId, () => {
            if (statistics && mainFileUri) {
                StatisticsPanel.createOrShow(context.extensionPath, statistics, mainFileUri);
            }
        })
    );

    wordsStatusbarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10000);
    wordsStatusbarItem.command = statisticsCommandId;
    context.subscriptions.push(wordsStatusbarItem);

    // register some listener that make sure the status bar
    // item always up-to-date
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));

    // update status bar item once at start
    updateStatusBarItem();
}

export function registerStatisticsNotification(client: LanguageClient) {
    client.onNotification("story/statistics", (params: StatisticsParams) => {
        statistics = params.statistics;
        mainFileUri = vscode.Uri.parse(params.mainFileUri, true);
        updateStatusBarItem();
    });
}

function updateStatusBarItem(): void {
    if (vscode.window.activeTextEditor?.document.languageId === 'ink' && statistics) {
        wordsStatusbarItem.show();
        wordsStatusbarItem.text = `ink: ${statistics.words.toLocaleString('en-US')} words`;
    } else {
        wordsStatusbarItem.hide();
    }
}
