import * as vscode from 'vscode';
import { createOrShowPanel } from './ui/webviewPanel';

export function activate(context: vscode.ExtensionContext) {
    // Register the command to generate code
    let generateDisposable = vscode.commands.registerCommand('velox.codeAssistant.generate', () => {
        try {
            createOrShowPanel(context, 'generate');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to open code generator: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });

    // Register the command to fix code
    let fixDisposable = vscode.commands.registerCommand('velox.codeAssistant.fix', () => {
        try {
            createOrShowPanel(context, 'fix');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to open code fixer: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });

    // Add command to context subscriptions
    context.subscriptions.push(generateDisposable);
    context.subscriptions.push(fixDisposable);

    // Optional: Show a welcome message when the extension is activated
    vscode.window.showInformationMessage('Velox Code Assistant is now active!');
}

export function deactivate() {
    // Clean up resources if needed
}
