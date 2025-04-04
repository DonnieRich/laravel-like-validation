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
    it('should validate a value within the range', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'lowNumber', '400,500')).resolves.toBe(true);
        await expect(rule.validate(mockRequestObject, 'lowNumber', '455,455')).resolves.toBe(true);
        await expect(rule.validate(mockRequestObject, 'highNumber', '1000,2000')).resolves.toBe(true);
    });

    it('should fail a value outside the range', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'lowNumber', '500,600')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'highNumber', '100,400')).resolves.toBe(false);
    });

    it('should fail if value is not a number', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'shortString', '5,10')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'nullValue', '5,10')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'undefinedValue', '5,10')).resolves.toBe(false);
    });

    it('should validate using fluent syntax', async () => {
        const rule = new Between().min(400).max(500);
        await expect(rule.validate(mockRequestObject, 'lowNumber')).resolves.toBe(true);

        const rule2 = new Between().min(500).max(600);
        await expect(rule2.validate(mockRequestObject, 'lowNumber')).resolves.toBe(false);
    });


    it('should fail if the range is invalid', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'lowNumber', '500')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'lowNumber', '500,')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'lowNumber', ',500')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'lowNumber', 'abc,def')).resolves.toBe(false);
    });

    it('should handle edge cases for numbers', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'zeroNumber', '0,0')).resolves.toBe(true);
        await expect(rule.validate(mockRequestObject, 'negativeNumber', '-2000,-1000')).resolves.toBe(true);
        await expect(rule.validate(mockRequestObject, 'negativeFloatNumber', '-2000.5,-1000.5')).resolves.toBe(true);
        await expect(rule.validate(mockRequestObject, 'floatNumber', '1500.5,1500.5')).resolves.toBe(true);
    });

    it('should fail for non-numeric values in the range', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'shortString', 'a,b')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'symbol', '1,10')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'functionValue', '1,10')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'emptyObject', '1,10')).resolves.toBe(false);
    });

    it('should validate array lengths within the range', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'shortArray', '2,5')).resolves.toBe(true);
        await expect(rule.validate(mockRequestObject, 'longArray', '5,10')).resolves.toBe(true);
        await expect(rule.validate(mockRequestObject, 'emptyArray', '0,0')).resolves.toBe(true);
    });

    it('should fail for array lengths outside the range', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'shortArray', '3,5')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'longArray', '10,15')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'emptyArray', '1,5')).resolves.toBe(false);
    });

    it('should handle fake arrays correctly', async () => {
        const rule = new Between();
        await expect(rule.validate(mockRequestObject, 'fakeArray', '3,5')).resolves.toBe(false);
        await expect(rule.validate(mockRequestObject, 'fakeArray', '5,10')).resolves.toBe(false);
    });

});
