import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
	width: 300,
	height: 40,
	top: 0,
	left: 0,
	bottom: 40,
	right: 300,
	x: 0,
	y: 0,
	toJSON: () => {},
}));

// Mock window methods
Object.defineProperty(window, 'pageYOffset', {
	value: 0,
	writable: true,
});

Object.defineProperty(window, 'pageXOffset', {
	value: 0,
	writable: true,
});

Object.defineProperty(window, 'innerHeight', {
	value: 800,
	writable: true,
});

Object.defineProperty(window, 'innerWidth', {
	value: 1024,
	writable: true,
});
