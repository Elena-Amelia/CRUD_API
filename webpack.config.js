
export default {
    entry: "./src/index.ts",
    target: "node",
    output: {
            filename: 'bundle.js'
        },
    mode: "production",
    resolve: {
            extensions: ['.ts', '.js'],
        },
    module: {
        rules: [
            {
                 test: /\.ts$/i, use: 'ts-loader', exclude: /node_modules/,
            }
        ],
    }
}