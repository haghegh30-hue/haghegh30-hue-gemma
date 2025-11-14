# AI Image Generator Figma Plugin

This Figma plugin allows you to generate images using a local AI model.

## Features

-   **Generate images from a text prompt:** Simply enter a prompt and the plugin will generate an image.
-   **Configurable AI provider:** Choose between Ollama (default) or a custom AI provider.
-   **Persistent settings:** Your AI provider settings are saved in your browser's local storage.

## How to Use

1.  **Install the plugin:** Download the plugin files and install them in Figma.
2.  **Open the plugin:** Open a Figma file and run the plugin.
3.  **Enter a prompt:** Enter a text prompt in the text area and click "Generate".
4.  **Configure the AI provider (optional):**
    -   Click the settings icon in the top right corner of the plugin.
    -   Select your preferred AI provider from the dropdown menu.
    -   If you select "Custom", you can enter a custom API URL.
    -   Click "Save" to save your settings.

## Files

-   `manifest.json`: The plugin's manifest file.
-   `ui.html`: The plugin's user interface.
-   `code.js`: The plugin's core logic.
