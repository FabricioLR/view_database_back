import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        root: "./src",
        deps: {
            interopDefault: true,
        },
        testTimeout: 50000
    },
})