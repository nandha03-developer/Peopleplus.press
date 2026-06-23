import { useEffect } from 'react';

export function UseBackgroundImageLoader(): void {
  useEffect(() => {
    const elements = document.querySelectorAll('.bg-img');
    elements.forEach((element) => {
      const imageUrl = element.getAttribute('data-image-src');
      if (imageUrl) {
        // Type cast element to HTMLElement to access style property
        (element as HTMLElement).style.backgroundImage = `url(${imageUrl})`;
      }
    });
  }, []);
}
