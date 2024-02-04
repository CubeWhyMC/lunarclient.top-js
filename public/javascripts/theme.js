function setFavicon() {
  var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var favicon = document.getElementById('favicon');

  function updateFavicon() {
      if (darkModeQuery.matches) {
          favicon.href = 'https://cdn.jsdelivr.net/gh/CubeWhyMC/celestial/src/main/resources/images/icons/icon-light.png';
      } else {
          favicon.href = 'https://cdn.jsdelivr.net/gh/CubeWhyMC/celestial/src/main/resources/images/icons/icon-dark.png';
      }
  }

  darkModeQuery.addEventListener('change', updateFavicon);
  updateFavicon();
}

setFavicon();