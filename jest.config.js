"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/tests/**/*.test.(ts|js)'],
    collectCoverage: true,
    // setupFilesAfterEnv: ['jest-extended'],
    setupFiles: ['<rootDir>/jest.setup.js'],
    setupFilesAfterEnv: ['./jest.setup.js'],
};
