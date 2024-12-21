const INPUTS_FENCE = '@@';
export const INPUTS_FIELD = `${INPUTS_FENCE}inputs${INPUTS_FENCE}`;

function makeGetNewInputRef(inputsFence: string) {
  let inputIndex = 0;

  return function getNewInputRef() {
    return `${inputsFence}${++inputIndex}${inputsFence}`;
  };
}

function makeIsInputRef(inputsFence: string) {
  return function isInputRef(key: string) {
    return key.startsWith(inputsFence) && key.endsWith(inputsFence);
  };
}

const getNewInputRef = makeGetNewInputRef(INPUTS_FENCE);
const isInputRef = makeIsInputRef(INPUTS_FENCE);

export function attachTemplate(shadowRoot: ShadowRoot, template: string) {
  const styleElements = shadowRoot.querySelectorAll('style');
  shadowRoot.innerHTML = template.trim();
  return shadowRoot.append(...styleElements);
}

export function attachStyle(shadowRoot: ShadowRoot, style: string) {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = style.trim();

  return shadowRoot.appendChild(styleElement);
}

export function injectChildrenInputs(shadowRoot: ShadowRoot, inputs: Record<string, unknown>) {
  const keyMap: Record<string, string> = {};
  const valueMap: Record<string, unknown> = {};

  const inputEntries = Object.entries(inputs || {});
  const inputEntriesLength = inputEntries.length;

  for (let i = 0; i < inputEntriesLength; i++) {
    const [key, value] = inputEntries[i];
    const inputRef = getNewInputRef();
    keyMap[key] = inputRef;
    valueMap[inputRef] = value;
  }

  shadowRoot.getRootNode()['host'][INPUTS_FIELD] = valueMap;

  return keyMap;
}

export function fetchInput<T = string>(node: HTMLElement | ShadowRoot, attributeValue: string): T {
  if (isInputRef(attributeValue)) {
    const parentNode = node.getRootNode()['host'];
    return parentNode[INPUTS_FIELD][attributeValue] as T;
  }

  return attributeValue as T;
}
