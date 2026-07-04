export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/_tests_'],
    testMatch: ['**/_tests_/**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/index.ts',
        '!src/app.ts',
        '!src/_tests_/**',
    ],
    setupFilesAfterEnv: ['<rootDir>/_tests_/setup.ts'],
    maxWorkers: 1,  // Run tests serially to avoid race conditions
    forceExit: true,  // Force exit after tests complete
    testTimeout: 30000,  // Increase timeout for integration tests
};
