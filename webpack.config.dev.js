const path = require('path'); // Para trabajar con archivos y rutas de directorios
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './src/index.js', // el punto de entrada de mi aplicación
    output: { // Esta es la salida de mi bundle
        path: path.resolve(__dirname, 'dist'),
        // resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo
        // para no tener conflictos entre Linux, Windows, etc
        filename: '[name].[contenthash].js'
        // EL NOMBRE DEL ARCHIVO FINAL
    },
    mode: 'development',
    //watch: true,//sirve para estar viendo los cambios en tiempo real, sin tener que compilar de nuevo.
    devtool: 'source-map',
    resolve: {
        extensions: ['.js'], // LOS ARCHIVOS QUE WEBPACK VA A LEER
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@templates': path.resolve(__dirname, 'src/templates'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@images': path.resolve(__dirname, 'src/assets/images')
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css|.styl$/i,
                use: [MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'stylus-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,//regla para aceptar imagenes png,sv, etc.
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/hash/[hash][ext][query]' //para guardar los HASH de las imagenes en otra carpeta, por ejemplo 'hash/images', tambien puede ser en la misma de los assets
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,//la nueva forma de importar las fonts, desde webpack 5
                type: "asset/resource",
                generator: {
                    filename: 'assets/fonts/[hash][ext][query]',
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(),
        new BundleAnalyzerPlugin(),
    ],
  devServer: {
    static: path.join(__dirname, 'dist'),//'static' es la nueva forma ahora en webpack 5 en adelante
    compress: true,
    historyApiFallback: true,
    port: 3006,
    open: true,
  },
}