export function getElementById(id: string): HTMLElement {
  const element: HTMLElement | null = document.getElementById(id);
  if (null === element) {
    throw new Error(`Failed to get element by ID: ${id}`);
  }
  return element;
}
