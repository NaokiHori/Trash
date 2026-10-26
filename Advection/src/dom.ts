export function getElementById(id: string): HTMLElement {
  const element: HTMLElement | null = document.querySelector(`#${id}`);
  if (null === element) {
    throw new Error(`Failed to get element by ID: ${id}`);
  }
  return element;
}
