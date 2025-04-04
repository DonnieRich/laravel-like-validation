import { describe, it, expect } from 'vitest';
import Between from '../rules/Between.js';

const mockRequestObject = {
    shortString: "ab",
    longString: "abcdefghijklmno",
    shortArray: [1, 2],
    longArray: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    emptyArray: [],
    lowNumber: 455,
    highNumber: 1500,
    floatNumber: 1500.5,
    negativeNumber: -1500,
    negativeFloatNumber: -1500.5,
    zeroNumber: 0,
    emptyObject: {},
    symbol: Symbol("test"),
    nullValue: null,
    functionValue: () => { },
    fakeArray: { length: 4 },
};

describe('Between Rule', () => {
    it('should validate a value within the range', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'lowNumber', '400,500')).toBe(true);
        expect(rule.validate(mockRequestObject, 'lowNumber', '455,455')).toBe(true);
        expect(rule.validate(mockRequestObject, 'highNumber', '1000,2000')).toBe(true);
    });

    it('should fail a value outside the range', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'lowNumber', '500,600')).toBe(false);
        expect(rule.validate(mockRequestObject, 'highNumber', '100,400')).toBe(false);
    });

    it('should fail if value is not a number', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'shortString', '5,10')).toBe(false);
        expect(rule.validate(mockRequestObject, 'nullValue', '5,10')).toBe(false);
        expect(rule.validate(mockRequestObject, 'undefinedValue', '5,10')).toBe(false);
    });

    it('should validate using fluent syntax', () => {
        const rule = new Between().min(400).max(500);
        expect(rule.validate(mockRequestObject, 'lowNumber')).toBe(true);

        const rule2 = new Between().min(500).max(600);
        expect(rule2.validate(mockRequestObject, 'lowNumber')).toBe(false);
    });


    it('should fail if the range is invalid', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'lowNumber', '500')).toBe(false);
        expect(rule.validate(mockRequestObject, 'lowNumber', '500,')).toBe(false);
        expect(rule.validate(mockRequestObject, 'lowNumber', ',500')).toBe(false);
        expect(rule.validate(mockRequestObject, 'lowNumber', 'abc,def')).toBe(false);
    });

    it('should handle edge cases for numbers', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'zeroNumber', '0,0')).toBe(true);
        expect(rule.validate(mockRequestObject, 'negativeNumber', '-2000,-1000')).toBe(true);
        expect(rule.validate(mockRequestObject, 'negativeFloatNumber', '-2000.5,-1000.5')).toBe(true);
        expect(rule.validate(mockRequestObject, 'floatNumber', '1500.5,1500.5')).toBe(true);
    });

    it('should fail for non-numeric values in the range', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'shortString', 'a,b')).toBe(false);
        expect(rule.validate(mockRequestObject, 'symbol', '1,10')).toBe(false);
        expect(rule.validate(mockRequestObject, 'functionValue', '1,10')).toBe(false);
        expect(rule.validate(mockRequestObject, 'emptyObject', '1,10')).toBe(false);
    });

    it('should validate array lengths within the range', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'shortArray', '2,5')).toBe(true);
        expect(rule.validate(mockRequestObject, 'longArray', '5,10')).toBe(true);
        expect(rule.validate(mockRequestObject, 'emptyArray', '0,0')).toBe(true);
    });

    it('should fail for array lengths outside the range', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'shortArray', '3,5')).toBe(false);
        expect(rule.validate(mockRequestObject, 'longArray', '10,15')).toBe(false);
        expect(rule.validate(mockRequestObject, 'emptyArray', '1,5')).toBe(false);
    });

    it('should handle fake arrays correctly', () => {
        const rule = new Between();
        expect(rule.validate(mockRequestObject, 'fakeArray', '3,5')).toBe(false);
        expect(rule.validate(mockRequestObject, 'fakeArray', '5,10')).toBe(false);
    });

});
