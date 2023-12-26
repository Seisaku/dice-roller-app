// Description: Test cases for index.js

import { roll, rollParse } from './diceRoller.js';

// Test case 5: Rolling 5 dices with 0 faces
test('roll 5 dices with 0 faces', () => {
    expect(roll(5, 0)).toBe(0);
});

// Test case 6: Rolling 0 dices with 0 faces
test('roll 0 dices with 0 faces', () => {
    expect(roll(0, 0)).toBe(0);
});

// Test case for rollParse
test('rollParse "1d6"', () => {
    const result = rollParse("1d6");
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.total).toBeLessThanOrEqual(6);
});

test('rollParse "2d6"', () => {
    const result = rollParse("2d6");
    expect(result.total).toBeGreaterThanOrEqual(2);
    expect(result.total).toBeLessThanOrEqual(12);
});

test('rollParse "3d10"', () => {
    const result = rollParse("3d10");
    expect(result.total).toBeGreaterThanOrEqual(3);
    expect(result.total).toBeLessThanOrEqual(30);
});

test('rollParse "0d20"', () => {
    expect(rollParse("0d20").total).toBe(0);
});

test('rollParse "5d10>5"', () => {
    const result = rollParse("5d10>5");
    expect(result.total).toBeGreaterThanOrEqual(5);
    expect(result.total).toBeLessThanOrEqual(50);
    expect(result.successCounter).toBeGreaterThanOrEqual(0);
    expect(result.successCounter).toBeLessThanOrEqual(5);
    expect(result.successTotal).toBeGreaterThanOrEqual(0);
    expect(result.successTotal).toBeLessThanOrEqual(50);
    expect(result.test).toBe(">");
    expect(result.goal).toBe(5);
});

test('rollParse "10d6R=1>3"', () => {
    const result = rollParse("10d6R=1>3");
    expect(result.total).toBeGreaterThanOrEqual(10);
    expect(result.total).toBeLessThanOrEqual(60);
    expect(result.successCounter).toBeGreaterThanOrEqual(0);
    expect(result.successCounter).toBeLessThanOrEqual(10);
    expect(result.successTotal).toBeGreaterThanOrEqual(0);
    expect(result.successTotal).toBeLessThanOrEqual(60);
    expect(result.test).toBe(">");
    expect(result.goal).toBe(3);
    expect(result.modCommand).toBe("R");
    expect(result.modCondition).toBe("=");
    expect(result.modGoal).toBe(1);
    console.log(result);
});	