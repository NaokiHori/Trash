function initializeElement<T extends HTMLElement>(
  type: new (...args: unknown[]) => T,
  element: HTMLElement,
  classListItems: ReadonlyArray<string>,
  attributes: ReadonlyArray<{ readonly key: string; readonly value: string }>,
): T {
  for (const classListItem of classListItems) {
    element.classList.add(classListItem);
  }
  for (const attribute of attributes) {
    element.setAttribute(attribute.key, attribute.value);
  }
  if (!(element instanceof type)) {
    throw new Error();
  }
  return element;
}

export function createChildElement<T extends HTMLElement>(
  type: new (...args: unknown[]) => T,
  {
    tagName,
    parentElement,
    classListItems,
    attributes,
  }: {
    tagName: "div" | "button" | "footer" | "a";
    parentElement: HTMLElement;
    classListItems: ReadonlyArray<string>;
    attributes: ReadonlyArray<{ readonly key: string; readonly value: string }>;
  },
): T {
  const childElement: HTMLElement = document.createElement(tagName);
  parentElement.append(childElement);
  return initializeElement(type, childElement, classListItems, attributes);
}
