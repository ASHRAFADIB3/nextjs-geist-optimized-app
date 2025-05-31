import * as vscode from 'vscode';

let currentPanel: vscode.WebviewPanel | undefined;

export function createOrShowPanel(context: vscode.ExtensionContext, mode: "generate" | "fix") {
    const column = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

    // If we already have a panel, show it
    if (currentPanel) {
        currentPanel.reveal(column);
        return;
    }

    // Otherwise, create a new panel
    currentPanel = vscode.window.createWebviewPanel(
        'veloxCodeAssistant',
        `Velox Code Assistant - ${mode === 'generate' ? 'Generate' : 'Fix'} Code`,
        column || vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // Set webview content
    currentPanel.webview.html = getWebviewContent(mode);

    // Handle messages from the webview
    currentPanel.webview.onDidReceiveMessage(
        async (message) => {
            switch (message.command) {
                case 'submit':
                    try {
                        const { callGeminiAPI } = require('../api/gemini');
                        const result = await callGeminiAPI(message.text, mode);
                        currentPanel?.webview.postMessage({ type: 'result', content: result });
                    } catch (error) {
                        currentPanel?.webview.postMessage({
                            type: 'error',
                            content: error instanceof Error ? error.message : 'An unknown error occurred'
                        });
                    }
                    break;
            }
        },
        undefined,
        context.subscriptions
    );

    // Reset when the panel is closed
    currentPanel.onDidDispose(
        () => {
            currentPanel = undefined;
        },
        null,
        context.subscriptions
    );
}

function getWebviewContent(mode: "generate" | "fix"): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Velox Code Assistant</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                padding: 20px;
                color: var(--vscode-editor-foreground);
                background-color: var(--vscode-editor-background);
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            .header {
                margin-bottom: 20px;
                text-align: center;
            }
            .input-area {
                margin-bottom: 20px;
            }
            textarea {
                width: 100%;
                min-height: 200px;
                padding: 10px;
                border: 1px solid var(--vscode-input-border);
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border-radius: 4px;
                resize: vertical;
                font-family: 'Courier New', Courier, monospace;
            }
            button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .output {
                margin-top: 20px;
                padding: 15px;
                background-color: var(--vscode-editor-background);
                border: 1px solid var(--vscode-input-border);
                border-radius: 4px;
                white-space: pre-wrap;
                font-family: 'Courier New', Courier, monospace;
            }
            .error {
                color: var(--vscode-errorForeground);
                margin-top: 10px;
            }
            .loading {
                display: none;
                text-align: center;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Velox Code Assistant</h1>
                <p>${mode === 'generate' ? 'Generate new code using AI' : 'Fix and improve your code using AI'}</p>
            </div>
            <div class="input-area">
                <textarea id="codeInput" placeholder="${
                    mode === 'generate'
                        ? 'Describe the code you want to generate...'
                        : 'Paste the code you want to fix...'
                }"></textarea>
            </div>
            <button id="submitButton">${mode === 'generate' ? 'Generate Code' : 'Fix Code'}</button>
            <div id="loading" class="loading">Processing...</div>
            <div id="output" class="output" style="display: none;"></div>
            <div id="error" class="error" style="display: none;"></div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const codeInput = document.getElementById('codeInput');
            const submitButton = document.getElementById('submitButton');
            const loadingDiv = document.getElementById('loading');
            const outputDiv = document.getElementById('output');
            const errorDiv = document.getElementById('error');

            submitButton.addEventListener('click', () => {
                const text = codeInput.value.trim();
                if (!text) {
                    showError('Please enter some text');
                    return;
                }

                showLoading();
                vscode.postMessage({
                    command: 'submit',
                    text: text
                });
            });

            window.addEventListener('message', event => {
                const message = event.data;
                hideLoading();

                if (message.type === 'result') {
                    showOutput(message.content);
                } else if (message.type === 'error') {
                    showError(message.content);
                }
            });

            function showLoading() {
                loadingDiv.style.display = 'block';
                outputDiv.style.display = 'none';
                errorDiv.style.display = 'none';
            }

            function hideLoading() {
                loadingDiv.style.display = 'none';
            }

            function showOutput(content) {
                outputDiv.textContent = content;
                outputDiv.style.display = 'block';
                errorDiv.style.display = 'none';
            }

            function showError(message) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                outputDiv.style.display = 'none';
            }
        </script>
    </body>
    </html>`;
}
