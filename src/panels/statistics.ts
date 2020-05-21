import * as vscode from 'vscode';
import * as path from 'path';
import { Statistics } from '../types';

export class StatisticsPanel {
    public static currentPanel: StatisticsPanel | undefined;

    public static readonly viewType = 'statistics';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];
    private _statistics: Statistics = Statistics.defaults();
    private _storyName: string = "Unknown";

    public static createOrShow(
        extensionPath: string,
        statistics: Statistics,
        mainFileUri: vscode.Uri
    ) {
        const storyName = path.basename(mainFileUri.path);

        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (StatisticsPanel.currentPanel) {
            StatisticsPanel.currentPanel._statistics = statistics;
            StatisticsPanel.currentPanel._storyName = storyName;
            StatisticsPanel.currentPanel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            StatisticsPanel.viewType,
            'Story Overview',
            column || vscode.ViewColumn.One,
            {
                // Enable javascript in the webview
                enableScripts: true,
            }
        );

        StatisticsPanel.currentPanel = new StatisticsPanel(
            panel,
            extensionPath,
            statistics,
            storyName
        );
    }

    private constructor(
        panel: vscode.WebviewPanel,
        extensionPath: string,
        statistics: Statistics,
        storyName: string
    ) {
        this._panel = panel;
        this._extensionPath = extensionPath;
        this._statistics = statistics;
        this._storyName = storyName;

        // Set the webview's initial html content
        this._update();
        this._updateValuesInWebview();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel
        // or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public dispose() {
        StatisticsPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    public reveal(viewColumn?: vscode.ViewColumn, preserveFocus?: boolean) {
        this._updateValuesInWebview();
        this._panel.reveal(viewColumn, preserveFocus);
    }

    private _update() {
        const webview = this._panel.webview;

        this._getHtmlForWebview().then((result) => {
            webview.html = result;
        }, (result) => { console.error(result); });
    }

    private _updateValuesInWebview() {
        this._panel.webview.postMessage({
            command: 'updateStatistics',
            storyName: this._storyName,
            statistics: this._statistics
        });
    }

    private async _getHtmlForWebview() {
        const filePath = path.join(this._extensionPath, 'webviews', 'statistics.html');
        const document = await vscode.workspace.openTextDocument(filePath);
        return document.getText();
    }
}
