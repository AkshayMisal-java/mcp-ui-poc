export const USER_SAVED_DOM = {
  remoteDomScript: ``
};

export const feedbackFormScript = `
    const rootStack = document.createElement('ui-stack');
    rootStack.setAttribute('direction', 'vertical');
    rootStack.setAttribute('spacing', '16');

    const feedbackForm = document.createElement('ui-feedback-form');
    feedbackForm.setAttribute('title', 'How was your experience?');
    feedbackForm.setAttribute(
      'description',
      'Your feedback helps us improve this tool for you and others.'
    );
    feedbackForm.setAttribute('submitLabel', 'Send feedback');

    // Listen for submit from the React component
    feedbackForm.addEventListener('submit', (event) => {
      const detail = event.detail || {};
      window.parent.postMessage(
        {
          type: 'tool',
          payload: {
            toolName: 'submitFeedback',
            params: {
              name: detail.name || '',
              email: detail.email || '',
              feedback: detail.feedback || '',
              allowContact: !!detail.allowContact,
              submittedAt: new Date().toISOString(),
            },
          },
        },
        '*',
      );
    });

    rootStack.appendChild(feedbackForm);
    root.appendChild(rootStack);`;

export const remoteDomScript = `
      const stack = document.createElement('ui-stack');
      stack.setAttribute('direction', 'vertical');
      stack.setAttribute('spacing', '20');
      stack.setAttribute('align', 'center');

      const text1 = document.createElement('ui-text');
      text1.setAttribute('content', 'Do you want to proceed?');
      
      const button = document.createElement('ui-button');
      button.setAttribute('label', 'Yes');
      button.setAttribute('variant', 'soft');

      button.addEventListener('press', () => {
        window.parent.postMessage(
          {
            type: 'tool',
            payload: {
              toolName: 'uiInteraction',
              params: {
                action: 'yes-button-click',
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


export const buyProductRemoteDomScript =
  `const stack = document.createElement('ui-stack');
   stack.setAttribute('direction', 'vertical');
   stack.setAttribute('spacing', '20');
   stack.setAttribute('align', 'center');

   const text1 = document.createElement('ui-text');
   text1.setAttribute('content', 'Do you want to proceed to buy a following item?');

   // Create a centered container for the image
	 const imageContainer = document.createElement('ui-stack');
	 imageContainer.setAttribute('direction', 'vertical');
	 imageContainer.setAttribute('spacing', '0');
	 imageContainer.setAttribute('align', 'center');

	 // Create the image
	 const image = document.createElement('ui-image');
	 image.setAttribute('src', 'https://i.pinimg.com/736x/f8/d5/e1/f8d5e17a7aba214596a3a28422c468a5.jpg');
	 image.setAttribute('alt', 'Image Not Found');
	 image.setAttribute('width', '200');

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
                    action: 'buy-item',
                    productId: '40001',
                    from: 'remote-dom-custom-library',
                    clickedAt: new Date().toISOString(),
                  }
                }
              },
              '*'
            );
      });

  imageContainer.appendChild(image);
  stack.appendChild(text1);
	stack.appendChild(imageContainer);
  stack.appendChild(button);
  root.appendChild(stack);
  `;


  export const checklistRemoteDomScript = `
    const checklistItems = [
      'The explanation was clear',
      'The UI was easy to use',
      'I found what I was looking for',
      'I would use this tool again',
    ];

    const rootStack = document.createElement('ui-stack');
    rootStack.setAttribute('direction', 'vertical');
    rootStack.setAttribute('spacing', '16');

    const checklistForm = document.createElement('ui-checklist-form');
    checklistForm.setAttribute('title', 'Quick checklist');
    checklistForm.setAttribute(
      'description',
      'Select all options that apply to your experience.'
    );
    // Pass items as JSON string
    checklistForm.setAttribute('items', JSON.stringify(checklistItems));
    checklistForm.setAttribute('submitLabel', 'Save checklist');

    checklistForm.addEventListener('submit', (event) => {
      const detail = event.detail || {};
      // detail.items will be an array like: [{ label, checked }, ...]

      window.parent.postMessage(
        {
          type: 'tool',
          payload: {
            toolName: 'submitChecklist',
            params: {
              items: detail.items || [],
              submittedAt: new Date().toISOString(),
            },
          },
        },
        '*',
      );
    });

    rootStack.appendChild(checklistForm);
    root.appendChild(rootStack);`;