// This shows the HTML page in Figma.
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'generate-image') {
    const { prompt, apiUrl } = msg;

    // --- API Call Logic ---
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        stream: false, // Important: ensures you get the full response at once
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.images && data.images.length > 0) {
        const imageData = data.images[0]; // Assuming the first image is the one we want
        const imageBytes = figma.base64Decode(imageData);

        // --- Create Image Node in Figma ---
        const image = figma.createImage(imageBytes);
        const node = figma.createRectangle();
        node.resize(512, 512);
        node.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
        figma.currentPage.appendChild(node);
        figma.viewport.scrollAndZoomIntoView([node]);
      } else {
        figma.notify('No image data received from the server.');
      }
    })
    .catch(error => {
      figma.notify(`Error: ${error.message}. Check your settings and make sure the local server is running.`);
    });
    // --- End API Call Logic ---
  }
};
