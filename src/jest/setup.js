// Log all jsDomErrors when using jsdom testEnvironment
window._virtualConsole && window._virtualConsole.on('jsdomError', function (error) {
  console.error('jsDomError', error.stack, error.detail);
});
