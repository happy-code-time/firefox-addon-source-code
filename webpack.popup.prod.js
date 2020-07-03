const path = require('path');

const ENTRY_DASHBOARD = {
    in: path.resolve(__dirname, './Source/Popup/index.jsx'),
    out: path.resolve(__dirname, './Distribution/Popup/')
};

const version = 'v4.0.0';

const config = {
    mode: 'production',
    resolve: {
        extensions: [ '.jsx', '.js' ],
    },
    entry: ['babel-polyfill', ENTRY_DASHBOARD.in ],
    output: {
        path: ENTRY_DASHBOARD.out,
        filename: '[name].code.prod.'+version+'.js',
    },
    cache: false,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
            },
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff',
			},
			{
				test: /\.(ttf|eot|svg|png|jpg|jpeg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader',
			}
        ]
    }
};

module.exports = config;

