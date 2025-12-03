import express from 'express';
import cors from 'cors';
import { createUIResource } from '@mcp-ui/server';

const app = express();
const port = 8081;

app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());

type Variant = 'raw-basic' | 'raw-dark' | 'external' | 'remote-dom-basic' | 'remote-dom';

// ---------- rawHtml helpers ----------

function htmlForVariant(variant: Variant): string {
  if (variant === 'raw-basic') {
    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; }
      .card {
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        padding: 16px;
        background: #ffffff;
      }
      h2 {
        margin-top: 0;
        font-size: 18px;
      }
      button {
        padding: 6px 12px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        background: #3b82f6;
        color: white;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>MCP-UI raw-basic</h2>
      <p>This HTML came from the Node server using <code>createUIResource()</code>.</p>
      <button id="ping">Ping host (notify)</button>
    </div>

    <script>
      document.getElementById('ping').addEventListener('click', () => {
        window.parent.postMessage(
          {
            type: 'notify',
            payload: { message: 'Ping from raw-basic iframe!' }
          },
          '*'
        );
      });
    </script>
  </body>
</html>
`;
  }

  if (variant === 'raw-dark') {
    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
        padding: 16px;
        font-family: system-ui, sans-serif;
        background: #020617;
        color: #e5e7eb;
      }
      .card {
        border-radius: 12px;
        border: 1px solid #1e293b;
        padding: 16px;
        background: radial-gradient(circle at top left, #0f172a, #020617);
      }
      h2 { margin-top: 0; font-size: 18px; }
      p { font-size: 14px; }
      button {
        padding: 6px 14px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        background: #22c55e;
        color: #022c22;
        font-weight: 600;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>MCP-UI raw-dark</h2>
      <p>Dark themed card. Click the button to send an intent back to the host.</p>
      <button id="buy">Buy Now (intent)</button>
    </div>

    <script>
      document.getElementById('buy').addEventListener('click', () => {
        window.parent.postMessage(
          {
            type: 'intent',
            payload: {
              intent: 'checkout',
              params: { productId: 'p-123', price: 499 }
            }
          },
          '*'
        );
      });
    </script>
  </body>
</html>
`;
  }

  // external / remote-dom don’t use inline HTML
  return '';
}

// ---------- factory to build UIResources with @mcp-ui/server ----------

function makeResource(variant: Variant) {
  if (variant === 'external') {
    // externalUrl example – will be rendered in an iframe by the client 
    return createUIResource({
      uri: 'ui://demo/external',
      content: {
        type: 'externalUrl',
        iframeUrl: 'https://example.com', // replace with your app/dashboard URL if you want
      },
      encoding: 'text',
      uiMetadata: {
        'preferred-frame-size': ['800px', '500px'],
        'initial-render-data': {
          source: 'node-server',
          variant: 'external',
        },
      },
    });
  }

   if (variant === 'remote-dom-basic') {
    // --------- NEW: remoteDom resource ----------
    const remoteDomScript = `
       const rootStack = document.createElement('ui-stack');
        rootStack.setAttribute('direction', 'vertical');
        rootStack.setAttribute('spacing', '12');
        rootStack.setAttribute('align', 'center');

        const title = document.createElement('ui-text');
        title.setAttribute('content', 'Hello from Remote DOM!');
        rootStack.appendChild(title);

        const button = document.createElement('ui-button');
        button.setAttribute('label', 'Click me for a tool call!');
        button.addEventListener('press', () => {
          window.parent.postMessage({
            type: 'tool',
            payload: {
              toolName: 'uiInteraction',
              params: { action: 'button-click', from: 'remote-dom-basic', clickedAt: new Date().toISOString() }
            }
          }, '*');
        });
        rootStack.appendChild(button);

        root.appendChild(rootStack);
    `;

    return createUIResource({
      uri: 'ui://demo/remote-dom-basic',
      content: {
        type: 'remoteDom',
        script: remoteDomScript,
        framework: 'react',
      },
      encoding: 'text',
      uiMetadata: {
        'preferred-frame-size': ['420px', '220px'],
        'initial-render-data': {
          variant: 'remote-dom-basic',
        },
      },
    });
  }

  if (variant === 'remote-dom') {
    // Remote DOM example (like the docs Example 5 but using your tags) 
    const remoteDomScript = `
      const card = document.createElement('ui-card');
      card.setAttribute('title', 'Remote DOM + Custom Library');

      const text1 = document.createElement('ui-text');
      text1.setAttribute('value', 'This UI is rendered via Remote DOM using your React component library.');

      const text2 = document.createElement('ui-text');
      text2.setAttribute('value', 'Click the button below to trigger a tool action back in the host app.');
      text2.setAttribute('variant', 'muted');

      const button = document.createElement('ui-button');
      button.setAttribute('label', 'Trigger Tool Action');
      button.setAttribute('tone', 'primary');

      button.addEventListener('press', () => {
        window.parent.postMessage(
          {
            type: 'tool',
            payload: {
              toolName: 'uiInteraction',
              params: {
                action: 'button-click',
                from: 'remote-dom-custom-library',
                clickedAt: new Date().toISOString(),
              }
            }
          },
          '*'
        );
      });

      card.appendChild(text1);
      card.appendChild(text2);
      card.appendChild(button);

      root.appendChild(card);
    `;

    return createUIResource({
      uri: 'ui://demo/remote-dom-button',
      content: {
        type: 'remoteDom',
        script: remoteDomScript,
        framework: 'react', // or 'webcomponents'
      },
      encoding: 'text',
      uiMetadata: {
        'preferred-frame-size': ['420px', '220px'],
        'initial-render-data': {
          serverMessage: 'Hello from remoteDom resource (custom library)',
          variant: 'remote-dom',
        },
      },
    });
  }

  // rawHtml variants
  const htmlString = htmlForVariant(variant);

  if (variant === 'raw-basic' || variant === 'raw-dark') {
    return createUIResource({
      uri: `ui://demo/${variant}`,
      content: {
        type: 'rawHtml',
        htmlString,
      },
      encoding: 'text',
      uiMetadata: {
        'preferred-frame-size': ['420px', '260px'],
        'initial-render-data': {
          serverMessage: `Hello from ${variant}`,
          variant,
        },
      },
    });
  }

  throw new Error(`Unsupported variant: ${variant}`);
}

// ---------- HTTP API for your React client ----------

app.get('/ui/:variant', (req, res) => {
  try {
    const variant = req.params.variant as Variant;

    if (!['raw-basic', 'raw-dark', 'external', 'remote-dom-basic','remote-dom'].includes(variant)) {
      res.status(400).json({ error: 'Unknown variant' });
      return;
    }

    const uiResource = makeResource(variant);
    res.json(uiResource);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
});

app.listen(port, () => {
  console.log(`MCP-UI dev PoC server running at http://localhost:${port}`);
});
