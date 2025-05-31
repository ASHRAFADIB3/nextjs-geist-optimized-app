# Velox Code Assistant

A Visual Studio Code extension that uses Google's Gemini AI to help generate and fix code.

## Features

- **Code Generation**: Generate code snippets based on natural language descriptions
- **Code Fixing**: Get suggestions and fixes for existing code
- **Modern UI**: Clean and intuitive interface integrated into VS Code
- **Real-time Processing**: Quick responses from Gemini AI

## Requirements

- Visual Studio Code 1.70.0 or higher
- Internet connection for API access

## Installation

1. Clone this repository
2. Navigate to the extension directory:
   ```bash
   cd velox-code-assistant
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run compile
   ```
5. Package the extension:
   ```bash
   vsce package
   ```
6. Install the generated .vsix file in VS Code

## Usage

1. Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type one of the following commands:
   - `Velox: Generate Code` - To generate new code
   - `Velox: Fix Code` - To fix existing code

3. Enter your prompt or paste your code in the input area
4. Click the submit button and wait for the AI response

## Commands

- `velox.codeAssistant.generate`: Opens the code generation panel
- `velox.codeAssistant.fix`: Opens the code fixing panel

## Development

### Building

1. Clone the repository
2. Run `npm install`
3. Open in VS Code
4. Press F5 to start debugging

### Project Structure

```
velox-code-assistant/
├── src/
│   ├── extension.ts        # Extension entry point
│   ├── api/
│   │   └── gemini.ts      # Gemini API integration
│   └── ui/
│       └── webviewPanel.ts # UI components
├── package.json           # Extension manifest
└── tsconfig.json         # TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Acknowledgments

- Built with Google's Gemini AI
- Developed for Visual Studio Code
