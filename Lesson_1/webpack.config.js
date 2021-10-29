module.exports = {
    entry: './script',
    watchOptions: {
        aggregateTimeout: 600,
        poll: true
    },
    output: {
        filename: './build.js'
    }
}

