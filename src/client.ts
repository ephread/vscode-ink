import { ExtensionContext, workspace } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    Executable
} from 'vscode-languageclient';

let client: LanguageClient;

export function activateLanguageClient(context: ExtensionContext) {

    const inklecatePath = workspace.getConfiguration("ink").get("inklecatePath", "inklecate");
    const runThroughMono = workspace.getConfiguration("ink").get("runThroughMono", false);

    let run: Executable;
    if (runThroughMono) {
        run = { command: 'mono', args: [inklecatePath, '-s'] };
    } else {
        run = { command: inklecatePath, args: ['-s'] };
    }

    let debug: Executable = run;

    // If the extension is launched in debug mode then the debug server options are used
    // otherwise the run options are used.
    const serverOptions: ServerOptions = {
        run: run,
        debug: debug
    };

    // Options to control the language client
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

export function deactivateLanguageClient(): Thenable<void> {
    if (!client) { return Promise.resolve(); }

    return client.stop();
}
