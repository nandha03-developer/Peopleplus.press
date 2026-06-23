export function extractHeadContent(html: string): string {
    // Create a DOM parser instance
    const parser = new DOMParser();
    // Parse the HTML string into a document
    const doc = parser.parseFromString(html, 'text/html');
    // Extract the inner HTML of the <head> tag
    const head = doc.querySelector('head');
    return head ? head.innerHTML : '';
  }
  