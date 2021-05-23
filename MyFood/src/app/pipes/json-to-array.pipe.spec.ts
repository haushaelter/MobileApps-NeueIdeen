import { JsonToArrayPipe } from './json-to-array.pipe';

describe('JsonToArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new JsonToArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
