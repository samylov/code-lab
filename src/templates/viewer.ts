export default (htmlCode: string, cssCode: string, jsCode: string) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head><style>${cssCode}</style></head>
      <body>
        ${htmlCode}
        <script>
          (function() {
            const console = {
              log: function(...args) {
                parent.postMessage({ type: 'log', message: args.join(' ') }, '*');
              }
            };
            try {
              ${jsCode}
            } catch (e) {
              parent.postMessage({ type: 'error', message: e }, '*');
            }
          })();
        <\/script>
      </body>
      </html>
    `
}
