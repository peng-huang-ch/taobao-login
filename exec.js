exports.js1 = () => {
  Object.defineProperties(navigator, {
    webdriver: {
      get: () => false
    }
  })
}

exports.js2 = () => {
  alert(window.navigator.webdriver)
}

exports.js3 = () => {
  window.navigator.chrome = {
    runtime: {},
    // etc.
  };
}

exports.js4 = () => {
  Object.defineProperty(navigator, 'languages', {
    get: () => ['en-US', 'en']
  });
}

exports.js5 = () => {
  Object.defineProperty(navigator, 'plugins', {
    get: () => [1, 2, 3, 4, 5, 6],
  });
}