var path = require('path');

module.exports = {
    entry: {
        coala: [
            path.resolve('./core/coala.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, '/'),
        filename: 'coala.js'
    }
};
