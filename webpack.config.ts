import * as webpack from 'webpack';
import { output } from './config/config.json';
import * as path from 'path';
import webpackShellPlugin from 'webpack-shell-plugin-next';
import dotenv from 'dotenv-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import eslintwebpackplugin from 'eslint-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';



export default (
    env: { [key: string]: string | undefined},
    argv: { [key: string]: string | undefined}
): webpack.Configuration => {
    const isProduction: boolean = argv.mode !== 'production' ? false : true;
    return {
        entry: './src/main.ts',
        target: 'node',
        mode:  isProduction ? 'production' : 'development',
        externals: [nodeExternals()],
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                src: path.resolve(__dirname, 'src'),
                "@config": path.resolve(__dirname, 'config'),
            }
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                configFile: 'tsconfig.json'
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                    type: 'asset/resource'
                }
            ]
        },


        output: {
            path: path.resolve(__dirname, output.path),
            filename: output.jsBundle,
        },
        plugins : [
            new dotenv() as unknown as webpack.WebpackPluginInstance,
            new ForkTsCheckerWebpackPlugin(),
            new HTMLWebpackPlugin({
                template: './public/template.html',
            }),
            new webpackShellPlugin({
                onBuildStart : {
                    scripts: [
                        isProduction ? "echo 'Production Build'" : "echo 'Development Build'",
                        "echo 'Starting build process'",
                        'rimraf dist',
                        'rimraf build',
                    ],
                    blocking: true,
                    parallel: false
                },
                onBuildEnd: {
                    scripts: [
                        `echo 'Build process complete, [CTRL+C to close]'`,
                        // `pm2 start ${isProduction ? 'config/pm2/pm2.prod.config.js' : 'config/pm2/pm2.dev.config.js'}`
                        isProduction ? `echo your file is ready to be deployed in ${output.path}` :`http-server ./${output.path} -o -c-1 -p 3000`,
                    ],
                    blocking: false,
                    parallel: true
                }

            }),
            new eslintwebpackplugin({
                extensions: ['ts'],
                exclude: ['node_modules', 'dist', 'build']
            }),
            new FaviconsWebpackPlugin({
                logo: './public/favicon/favicon.ico',
                prefix: 'icons/',
                favicons: {
                    appName: 'My App',
                    appShortName: 'App',
                    appDescription: 'This is my application',
                    developerName: 'Me',
                    background: '#ddd',
                    theme_color: '#333',
                }
            })

        ]
    };
};