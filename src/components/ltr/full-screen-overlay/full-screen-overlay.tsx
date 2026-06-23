function fullScreenSearch(): void {
  const alignSearchBar = (): void => {
    const wHeight: number = window.innerHeight;
    const fullscreenSearchForm: HTMLElement | null = document.getElementById('fullscreen-searchform');
    if (fullscreenSearchForm) {
      fullscreenSearchForm.style.top = `${wHeight / 2}px`;
    }
  };

  window.addEventListener('resize', alignSearchBar);
  alignSearchBar();

  const searchButton: HTMLElement | null = document.querySelector('.btn-search_two');
  if (searchButton) {
    searchButton.addEventListener('click', function (): void {
      const fullscreenSearchOverlay: HTMLElement | null = document.getElementById('search-overlay');
      if (fullscreenSearchOverlay) {
        fullscreenSearchOverlay.classList.add('fullscreen-search-overlay-show');
      }
    });
  }

  const closeButton: HTMLElement | null = document.querySelector('#fullscreen-close-button');
  if (closeButton) {
    closeButton.addEventListener('click', function (e): void {
      e.preventDefault();
      const fullscreenSearchOverlay: HTMLElement | null = document.getElementById('search-overlay');
      if (fullscreenSearchOverlay) {
        fullscreenSearchOverlay.classList.remove('fullscreen-search-overlay-show');
      }
    });
  }
}

export default fullScreenSearch;
