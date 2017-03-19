import 'mocha';
import {VError} from '../src/Components/VError';
import * as Chai from 'chai';
const expect = Chai.expect;

describe('VError', () => {
    it('should new VError', () => {
      const sut = new VError();
      expect(sut).not.eq(null);
    });
});