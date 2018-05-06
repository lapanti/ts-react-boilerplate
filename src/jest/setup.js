// Enzyme adaptations
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() });

// Log all jsDomErrors when using jsdom testEnvironment
window._virtualConsole && window._virtualConsole.on('jsdomError', function (error) {
  console.error('jsDomError', error.stack, error.detail);
});
