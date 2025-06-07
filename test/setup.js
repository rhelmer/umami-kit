// Mock browser APIs that aren't available in Jest
global.IntersectionObserver = jest.fn();
global.MutationObserver = jest.fn();