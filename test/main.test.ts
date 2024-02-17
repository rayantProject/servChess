import { helloWorld } from './../src/main';

describe('Hello world', () => {
    test('should return hello world', () => {
        expect(helloWorld()).toBe('Hello World');
    });
});
