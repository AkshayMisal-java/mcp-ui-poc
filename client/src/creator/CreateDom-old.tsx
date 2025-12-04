import {
  UIResourceRenderer,
  remoteTextDefinition,
  remoteButtonDefinition,
  remoteStackDefinition,
  remoteImageDefinition,
} from '@mcp-ui/client';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { radixComponentLibrary } from '../radix';
import '../radix-styles.css';
import {
  remoteElements,
} from '../remoteDomLibrary';

const SERVER_BASE = 'http://localhost:8081';
const remoteDomScript1 = `
      const stack = document.createElement('ui-stack');
      stack.setAttribute('direction', 'vertical');
      stack.setAttribute('spacing', '20');
      stack.setAttribute('align', 'center');

      const text1 = document.createElement('ui-text');
      text1.setAttribute('content', 'Do you want to proceed?');

      const button = document.createElement('ui-button');
      button.setAttribute('label', 'Buy');
      button.setAttribute('variant', 'soft');

      button.addEventListener('press', () => {
        window.parent.postMessage(
          {
            type: 'tool',
            payload: {
              toolName: 'uiInteraction',
              params: {
                action: 'buy-button-click',
                from: 'remote-dom-custom-library',
                clickedAt: new Date().toISOString(),
              }
            }
          },
          '*'
        );
      });

     
      stack.appendChild(text1);
      stack.appendChild(button);
      root.appendChild(stack);
    `;

function CreateDom() {
  const [scriptContent, setScriptContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [saveResponseValue, setSaveResponseValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
        setError(null);
        fetch(`${SERVER_BASE}/remote-dom/script`)
          .then((res) => res.json())
          .then((json) => {
              console.log('server response: ', json);
              if(json && json.script){
                setScriptContent(json.script);
                setInputValue(json.script);
              }else {
                 setError(json.error ?? 'Fetch error');
              }
          })
          .catch((err) => {
            setError(err.message ?? 'Fetch error');
          })
          .finally(() => setLoading(false));
  }, []);

  // Debounce the script content updates
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setScriptContent(inputValue);
        setSaveResponseValue('');
      });
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const mockResourceReact = useMemo(
    () => ({
      mimeType: 'application/vnd.mcp-ui.remote-dom+javascript; framework=react',
      text: scriptContent,
    }),
    [scriptContent],
  );

  const postCall = async () => {
    const json = await apiCall("http://localhost:8081/remote-dom", {script: inputValue});
    setSaveResponseValue(json.success);
  }

  async function apiCall(resourceEndpoint: string, input: any) {
  const res = await fetch(resourceEndpoint, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)}
  );
  const json = await res.json();
  return json;
 }

  return (
    <div
      style={{
        opacity: isPending ? 0.8 : 1,
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Remote DOM Script configurator</h1>
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <button onClick={postCall} style={{marginRight: '1rem' }}>Save</button>
          <p style={{ color: '#043502ff' }}>
            {saveResponseValue}
          </p>
        </div>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '1rem' }}>
          Edit the Server's Resource `script` below to see the changes reflected in the host:
        </p>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            width: '100%',
            height: '300px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '12px',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical',
            backgroundColor: '#f8f9fa',
            color: '#333',
            lineHeight: '1.4',
          }}
          placeholder="Enter your remote DOM script here..."
        />
      </div>
      <div>
        <h3>Preview: </h3>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        <div
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <UIResourceRenderer
            key={`radix-${scriptContent}`}
            resource={mockResourceReact}
            remoteDomProps={{
              library: radixComponentLibrary,
              remoteElements: remoteElements,
            }}
          />
        </div>
      </div>
     
    </div>
  );
}

export default CreateDom;
