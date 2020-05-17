import { ExtensionContext, ConfigurationChangeEvent, workspace, window } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    Executable
} from 'vscode-languageclient';

let client: LanguageClient | undefined;

export function activate(context: ExtensionContext) {
    if (client) { return; }

    let configuration = workspace.getConfiguration("ink");

    const useLanguageServer: boolean = configuration.get('useLanguageServer', false);

    if (!useLanguageServer) {
        return;
    }

    const inklecatePath: string = configuration.get('languageServer.inklecatePath', 'inklecate');
    const useSpecificRuntime: string = configuration.get('languageServer.useSpecificRuntime', 'none');

    let run: Executable;
    let debug: Executable;

    if (useSpecificRuntime === 'dotnet') {
        run = { command: 'dotnet', args: [inklecatePath, '-s'] };
        debug = run;
    } else if (useSpecificRuntime === "mono") {
        run = { command: 'mono', args: [inklecatePath, '-s'] };
        debug = { command: 'mono', args: ['--debug', inklecatePath, '-s'] };
    } else {
        run = { command: inklecatePath, args: ['-s'] };
        debug = run;
    }

    // If the extension is launched in debug mode then the debug server options are used
    // otherwise the run options are used.
    const serverOptions: ServerOptions = {
        run: run,
        debug: debug
    };

    // Options to control the language client.
    const clientOptions: LanguageClientOptions = {
        // The server only supports the `file` scheme.
        documentSelector: [{scheme: 'file', language: 'ink'}],
        synchronize: {}
    };

    // Create the language client and start the client.
    client = new LanguageClient('inkLanguage', 'Ink Language Server', serverOptions, clientOptions);

    // Start the client. This will also launch the server.
    let disposable = client.start();
    context.subscriptions.push(disposable);
}

export function deactivate(): Thenable<void> {
    if (!client) { return Promise.resolve(); }

    let localClient = client;
    client = undefined;

    return localClient.stop();
}

export function handleConfigurationChange(
    event: ConfigurationChangeEvent,
    context: ExtensionContext
) {
    if (event.affectsConfiguration('ink.useLanguageServer') ||
        event.affectsConfiguration('ink.languageServer')) {
        if (client) {
            deactivate().then(() => {
                activate(context);
            }, () => {
                window.showErrorMessage('Could not restart the Language Server for ink.');
            });
        } else {
            activate(context);
        }
    }
}
