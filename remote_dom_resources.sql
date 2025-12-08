--
-- PostgreSQL database Insert Query
--
--
-- TOC entry 5015 (class 0 OID 16386)
-- Dependencies: 220
-- Data for Name: remote_dom_resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.remote_dom_resources (id, uri, script, framework, description, created_at, updated_at) VALUES (53, 'ui://demo/payment-success', 'const rootStack = document.createElement(''ui-stack'');
rootStack.setAttribute(''direction'', ''vertical'');
rootStack.setAttribute(''spacing'', ''8'');
rootStack.setAttribute(''align'', ''center'');
rootStack.setAttribute(''minheight'', ''300'');

const hero = document.createElement(''ui-stack'');
hero.setAttribute(''direction'', ''vertical'');
hero.setAttribute(''spacing'', ''64'');
hero.setAttribute(''align'', ''center'');

// Big check mark
const iconText = document.createElement(''ui-text'');
iconText.setAttribute(''content'', ''✅ Payment successful'');
iconText.setAttribute(''align'', ''center'');

const sub = document.createElement(''ui-text-small'');
sub.setAttribute(''content'', ''Your order has been placed. Thank you for shopping with us! Your feedback will be valuable!'');
sub.setAttribute(''align'', ''center'');

// Buttons
const buttonRow = document.createElement(''ui-stack'');
buttonRow.setAttribute(''direction'', ''horizontal'');
buttonRow.setAttribute(''spacing'', ''12'');
buttonRow.setAttribute(''align'', ''center'');
buttonRow.setAttribute(''justify'', ''center'');

const feedbackButton = document.createElement(''ui-button'');
feedbackButton.setAttribute(''label'', ''Give feedback'');
feedbackButton.setAttribute(''variant'', ''solid'');

feedbackButton.addEventListener(''press'', () => {
  window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''uiInteraction'',
        params: {
          uri: ''ui://demo/feedback'',
          action: ''open-feedback'',
        },
      },
    },
    ''*'',
  );
});

const backButton = document.createElement(''ui-button'');
backButton.setAttribute(''label'', ''Back to products'');
backButton.setAttribute(''variant'', ''soft'');

backButton.addEventListener(''press'', () => {
  window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''uiInteraction'',
        params: {
          uri: ''ui://demo/product-1'',
          action: ''back-to-products'',
        },
      },
    },
    ''*'',
  );
});

buttonRow.appendChild(feedbackButton);
buttonRow.appendChild(backButton);

hero.appendChild(iconText);
hero.appendChild(sub);
hero.appendChild(buttonRow);

rootStack.appendChild(hero);
root.appendChild(rootStack);', 'react', 'Remote DOM script', '2025-12-04 22:12:24.115601+05:30', '2025-12-05 14:42:08.514217+05:30');
INSERT INTO public.remote_dom_resources (id, uri, script, framework, description, created_at, updated_at) VALUES (51, 'ui://demo/product-2', 'const rootStack = document.createElement(''ui-stack'');
rootStack.setAttribute(''direction'', ''vertical'');
rootStack.setAttribute(''spacing'', ''8'');
rootStack.setAttribute(''align'', ''center'');

const heroStack = document.createElement(''ui-stack'');
heroStack.setAttribute(''direction'', ''vertical'');
heroStack.setAttribute(''spacing'', ''12'');
heroStack.setAttribute(''align'', ''center'');

const heroImage = document.createElement(''ui-image'');
heroImage.setAttribute(
  ''src'',
  ''https://i.pinimg.com/736x/2b/c5/a6/2bc5a6a8634fbb69ba0e066aa5676c39.jpg'',
);
heroImage.setAttribute(''alt'', ''Smartwatch'');
heroImage.setAttribute(''width'', ''260'');

// Badge
const badge = document.createElement(''ui-badge'');
badge.setAttribute(''label'', ''New'');
badge.setAttribute(''tone'', ''info'');

const title = document.createElement(''ui-text'');
title.setAttribute(''content'', ''Nebula Smartwatch Pro'');

const subtitle = document.createElement(''ui-text-small'');
subtitle.setAttribute(''content'', ''Fitness tracking, notifications, and 7-day battery.'');
subtitle.setAttribute(''align'', ''center'');

const price = document.createElement(''ui-text'');
price.setAttribute(''content'', ''₹5,299.00'');
price.setAttribute(''align'', ''center'');

const buttonRow = document.createElement(''ui-stack'');
buttonRow.setAttribute(''direction'', ''horizontal'');
buttonRow.setAttribute(''spacing'', ''12'');
buttonRow.setAttribute(''align'', ''center'');
buttonRow.setAttribute(''justify'', ''center'');

const backButton = document.createElement(''ui-button'');
backButton.setAttribute(''label'', ''Previous'');
backButton.setAttribute(''variant'', ''outline'');

backButton.addEventListener(''press'', () => {
  window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''uiInteraction'',
        params: {
          uri: ''ui://demo/product-1'',
          action: ''view-prev-product'',
          from: ''product-2'',
        },
      },
    },
    ''*'',
  );
});

const addButton = document.createElement(''ui-button'');
addButton.setAttribute(''label'', ''Add to cart'');
addButton.setAttribute(''variant'', ''solid'');

addButton.addEventListener(''press'', () => {
    window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''addToCart'',
        params: {
          productId: ''prod-1002'',
          name: ''Nebula Smartwatch Pro'',
          price: 5299,
          addedAt: new Date().toISOString(),
        },
      },
    },
    ''*'',
  );
});

buttonRow.appendChild(backButton);
buttonRow.appendChild(addButton);

heroStack.appendChild(heroImage);
heroStack.appendChild(badge);
heroStack.appendChild(title);
heroStack.appendChild(subtitle);
heroStack.appendChild(price);
heroStack.appendChild(buttonRow);

rootStack.appendChild(heroStack);
root.appendChild(rootStack);
', 'react', 'Remote DOM script', '2025-12-04 22:12:24.115601+05:30', '2025-12-08 11:46:54.414791+05:30');
INSERT INTO public.remote_dom_resources (id, uri, script, framework, description, created_at, updated_at) VALUES (60, 'ui://demo/feedback', 'const rootStack = document.createElement(''ui-stack'');
rootStack.setAttribute(''direction'', ''vertical'');
rootStack.setAttribute(''spacing'', ''4'');

const feedbackForm = document.createElement(''ui-feedback-form'');
feedbackForm.setAttribute(''title'', ''Share your shopping experience'');
feedbackForm.setAttribute(
  ''description'',
  ''Tell us what went well and what we can improve.'',
);
feedbackForm.setAttribute(''submitlabel'', ''Submit feedback'');

feedbackForm.addEventListener(''submit'', (event) => {
  const detail = event.detail || {};

  window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''submitFeedback'',
        params: {
          uri: ''ui://demo/reviews'',
          name: detail.name || '''',
          email: detail.email || '''',
          feedback: detail.feedback || '''',
          allowContact: !!detail.allowContact,
          submittedAt: new Date().toISOString(),
        },
      },
    },
    ''*'',
  );
});

rootStack.appendChild(feedbackForm);

root.appendChild(rootStack);', 'react', 'Remote DOM script', '2025-12-04 22:12:24.115601+05:30', '2025-12-07 14:29:30.031768+05:30');
INSERT INTO public.remote_dom_resources (id, uri, script, framework, description, created_at, updated_at) VALUES (61, 'ui://demo/reviews', '// REVIEWS CHART
const rootStack = document.createElement(''ui-stack'');
rootStack.setAttribute(''direction'', ''vertical'');
rootStack.setAttribute(''spacing'', ''16'');

const header = document.createElement(''ui-stack'');
header.setAttribute(''direction'', ''vertical'');
header.setAttribute(''spacing'', ''4'');

const title = document.createElement(''ui-text'');
title.setAttribute(''content'', ''Customer reviews overview'');
title.setAttribute(''align'', ''left'');

const subtitle = document.createElement(''ui-text-small'');
subtitle.setAttribute(
  ''content'',
  ''Aggregated ratings based on recent feedback submitted by customers.''
);
subtitle.setAttribute(''align'', ''left'');

header.appendChild(title);
header.appendChild(subtitle);

// Chart
const chart = document.createElement(''ui-chart'');
chart.setAttribute(''title'', ''Rating distribution (1-5 stars)'');

// Example data: counts for 5,4,3,2,1 star ratings
const labels = [''5 stars'', ''4 stars'', ''3 stars'', ''2 stars'', ''1 star''];
const values = [56, 28, 10, 4, 2];

chart.setAttribute(''labels'', JSON.stringify(labels));
chart.setAttribute(''values'', JSON.stringify(values));

// Important: use the exact attribute names your chart component expects.
// If your mapping uses "showLegend" and "charttype" on the DOM side:
chart.setAttribute(''showlegend'', ''true''); // or ''showLegend'' if that is what you wired
chart.setAttribute(''charttype'', ''bar'');   // must match your propMapping / remoteAttributes

rootStack.appendChild(header);
rootStack.appendChild(chart);

root.appendChild(rootStack);
', 'react', 'Remote DOM script', '2025-12-04 22:12:24.115601+05:30', '2025-12-05 14:42:08.514217+05:30');
INSERT INTO public.remote_dom_resources (id, uri, script, framework, description, created_at, updated_at) VALUES (27, 'ui://demo/product-1', 'const rootStack = document.createElement(''ui-stack'');
rootStack.setAttribute(''direction'', ''vertical'');
rootStack.setAttribute(''spacing'', ''8'');
rootStack.setAttribute(''align'', ''center'');

const heroStack = document.createElement(''ui-stack'');
heroStack.setAttribute(''direction'', ''vertical'');
heroStack.setAttribute(''spacing'', ''12'');
heroStack.setAttribute(''align'', ''center'');

// Product image
const heroImage = document.createElement(''ui-image'');
heroImage.setAttribute(
  ''src'',
  ''https://i.pinimg.com/1200x/b0/ac/0d/b0ac0d7a5a06e65f088e2c8e938220c6.jpg'',
);
heroImage.setAttribute(''alt'', ''Wireless headphones'');
heroImage.setAttribute(''width'', ''260'');

// Badge
const badge = document.createElement(''ui-badge'');
badge.setAttribute(''label'', ''Bestseller'');
badge.setAttribute(''tone'', ''success'');

// Title + price
const title = document.createElement(''ui-text'');
title.setAttribute(''content'', ''Aurora Wireless Headphones'');

const subtitle = document.createElement(''ui-text-small'');
subtitle.setAttribute(''content'', ''Crystal-clear sound with 32 hours of battery.'');
subtitle.setAttribute(''align'', ''center'');

const price = document.createElement(''ui-text'');
price.setAttribute(''content'', ''₹2,499.00'');
price.setAttribute(''align'', ''center'');

// Buttons row
const buttonRow = document.createElement(''ui-stack'');
buttonRow.setAttribute(''direction'', ''horizontal'');
buttonRow.setAttribute(''spacing'', ''12'');
buttonRow.setAttribute(''align'', ''center'');
buttonRow.setAttribute(''justify'', ''center'');

const addButton = document.createElement(''ui-button'');
addButton.setAttribute(''label'', ''Add to cart'');
addButton.setAttribute(''variant'', ''solid'');

addButton .addEventListener(''press'', () => {
  window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''addToCart'',
        params: {
          productId: ''prod-1001'',
          name: ''Wireless Headphones Pro'',
          price: 2499,
          addedAt: new Date().toISOString(),
        },
      },
    },
    ''*'',
  );
});

const nextButton = document.createElement(''ui-button'');
nextButton.setAttribute(''label'', ''See next'');
nextButton.setAttribute(''variant'', ''soft'');

nextButton.addEventListener(''press'', () => {
  window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''uiInteraction'',
        params: {
          uri: ''ui://demo/product-2'',
          action: ''view-next-product'',
          from: ''product-1'',
        },
      },
    },
    ''*'',
  );
});

buttonRow.appendChild(addButton);
buttonRow.appendChild(nextButton);

heroStack.appendChild(heroImage);
heroStack.appendChild(badge);
heroStack.appendChild(title);
heroStack.appendChild(subtitle);
heroStack.appendChild(price);
heroStack.appendChild(buttonRow);

rootStack.appendChild(heroStack);
root.appendChild(rootStack);
', 'react', 'Remote DOM script', '2025-12-04 22:12:24.115601+05:30', '2025-12-08 11:46:45.2616+05:30');
INSERT INTO public.remote_dom_resources (id, uri, script, framework, description, created_at, updated_at) VALUES (52, 'ui://demo/payment', 'const rootStack = document.createElement(''ui-stack'');
rootStack.setAttribute(''direction'', ''vertical'');
rootStack.setAttribute(''spacing'', ''16'');

// Header
const headerStack = document.createElement(''ui-stack'');
headerStack.setAttribute(''direction'', ''vertical'');
headerStack.setAttribute(''spacing'', ''4'');

const title = document.createElement(''ui-text'');
title.setAttribute(''content'', ''Payment details'');
title.setAttribute(''align'', ''left'');

const subtitle = document.createElement(''ui-text-small'');
subtitle.setAttribute(''content'', ''Securely complete your purchase using your card.'');
subtitle.setAttribute(''align'', ''left'');

headerStack.appendChild(title);
headerStack.appendChild(subtitle);

// Fields container
const fieldsStack = document.createElement(''ui-stack'');
fieldsStack.setAttribute(''direction'', ''vertical'');
fieldsStack.setAttribute(''spacing'', ''12'');

// ------------- local state mirrored from change events -------------
let nameOnCard = '''';
let cardNumber = '''';
let expiry = '''';
let cvv = '''';
let amount = '''';
let saveCard = false;

// Name on card
const nameGroup = document.createElement(''ui-stack'');
nameGroup.setAttribute(''direction'', ''vertical'');
nameGroup.setAttribute(''spacing'', ''4'');

const nameLabel = document.createElement(''ui-text'');
nameLabel.setAttribute(''content'', ''Name on card'');

const nameInput = document.createElement(''ui-text-input'');
nameInput.setAttribute(''placeholder'', ''Enter name as on card'');

nameInput.addEventListener(''change'', (event) => {
  const d = event.detail;
  nameOnCard = typeof d === ''string'' ? d : '''';
});

nameGroup.appendChild(nameLabel);
nameGroup.appendChild(nameInput);

// Card number
const cardGroup = document.createElement(''ui-stack'');
cardGroup.setAttribute(''direction'', ''vertical'');
cardGroup.setAttribute(''spacing'', ''4'');

const cardLabel = document.createElement(''ui-text'');
cardLabel.setAttribute(''content'', ''Card number'');

const cardInput = document.createElement(''ui-number-input'');
cardInput.setAttribute(''placeholder'', ''XXXX XXXX XXXX XXXX'');
cardInput.setAttribute(''maxlength'', ''16'');
cardInput.setAttribute(''format'', ''card'');

cardInput.addEventListener(''change'', (event) => {
  const d = event.detail;
  cardNumber = typeof d === ''string'' ? d : '''';
});

cardGroup.appendChild(cardLabel);
cardGroup.appendChild(cardInput);

// Expiry + CVV row
const row = document.createElement(''ui-stack'');
row.setAttribute(''direction'', ''horizontal'');
row.setAttribute(''spacing'', ''12'');
row.setAttribute(''align'', ''center'');
row.setAttribute(''justify'', ''space-between'');

// Expiry
const expiryGroup = document.createElement(''ui-stack'');
expiryGroup.setAttribute(''direction'', ''vertical'');
expiryGroup.setAttribute(''spacing'', ''4'');

const expiryLabel = document.createElement(''ui-text'');
expiryLabel.setAttribute(''content'', ''Expiry'');

const expiryInput = document.createElement(''ui-text-input'');
expiryInput.setAttribute(''placeholder'', ''MM / YY'');

expiryInput.addEventListener(''change'', (event) => {
  const d = event.detail;
  expiry = typeof d === ''string'' ? d : '''';
});

expiryGroup.appendChild(expiryLabel);
expiryGroup.appendChild(expiryInput);

// CVV
const cvvGroup = document.createElement(''ui-stack'');
cvvGroup.setAttribute(''direction'', ''vertical'');
cvvGroup.setAttribute(''spacing'', ''4'');

const cvvLabel = document.createElement(''ui-text'');
cvvLabel.setAttribute(''content'', ''CVV'');

const cvvInput = document.createElement(''ui-number-input'');
cvvInput.setAttribute(''placeholder'', ''123'');
cvvInput.setAttribute(''type'', ''password'');
cvvInput.setAttribute(''maxlength'', ''3'');

cvvInput.addEventListener(''change'', (event) => {
  const d = event.detail;
  cvv = typeof d === ''string'' ? d : '''';
});

cvvGroup.appendChild(cvvLabel);
cvvGroup.appendChild(cvvInput);

row.appendChild(expiryGroup);
row.appendChild(cvvGroup);

// Amount
const amountGroup = document.createElement(''ui-stack'');
amountGroup.setAttribute(''direction'', ''vertical'');
amountGroup.setAttribute(''spacing'', ''4'');

const amountLabel = document.createElement(''ui-text'');
amountLabel.setAttribute(''content'', ''Amount'');

const amountInput = document.createElement(''ui-number-input'');
amountInput.setAttribute(''placeholder'', ''₹'');
amountInput.setAttribute(''maxlength'', ''12'');
amountInput.setAttribute(''allowdecimal'', ''true'');
amountInput.setAttribute(''format'', ''currency''); 
amountInput.setAttribute(''currencySymbol'', ''₹''); 

amountInput.addEventListener(''change'', (event) => {
  const d = event.detail;
  amount = typeof d === ''string'' ? d : '''';
});

amountGroup.appendChild(amountLabel);
amountGroup.appendChild(amountInput);


// Buttons
const buttonRow = document.createElement(''ui-stack'');
buttonRow.setAttribute(''direction'', ''horizontal'');
buttonRow.setAttribute(''spacing'', ''12'');
buttonRow.setAttribute(''align'', ''center'');
buttonRow.setAttribute(''justify'', ''space-between'');

const payButton = document.createElement(''ui-button'');
payButton.setAttribute(''label'', ''Pay now'');
payButton.setAttribute(''variant'', ''solid'');

const backButton = document.createElement(''ui-button'');
backButton.setAttribute(''label'', ''Cancel'');
backButton.setAttribute(''variant'', ''soft'');

backButton.addEventListener(''press'', () => {
window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''cancelPayment'',
        params: {
          uri: ''ui://demo/product-1'',
          message: ''Payment Canceled'',
          action: ''payment-cancel''
        },
      },
    },
    ''*'',
  );
});
payButton.addEventListener(''press'', () => {
  // simple validation: require some basic fields
  if (!nameOnCard || !cardNumber || !expiry || !cvv || !amount) {
    console.warn(''Please fill all payment fields before submitting.'');
    return;
  }

  const payload = {
    uri: ''ui://demo/payment-success'',
    nameOnCard,
    cardNumber,
    expiry,
    cvv,
    amount,
    submittedAt: new Date().toISOString(),
  };

  window.parent.postMessage(
    {
      type: ''tool'',
      payload: {
        toolName: ''submitPayment'',
        params: payload,
      },
    },
    ''*'',
  );
});

buttonRow.appendChild(backButton);
buttonRow.appendChild(payButton);


// Assemble
fieldsStack.appendChild(nameGroup);
fieldsStack.appendChild(cardGroup);
fieldsStack.appendChild(row);
fieldsStack.appendChild(amountGroup);

rootStack.appendChild(headerStack);
rootStack.appendChild(fieldsStack);
rootStack.appendChild(buttonRow);

root.appendChild(rootStack);', 'react', 'Remote DOM script', '2025-12-04 22:12:24.115601+05:30', '2025-12-08 14:35:54.382317+05:30');


