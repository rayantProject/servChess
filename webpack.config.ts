import * as webpack from 'webpack';
import { output } from './config/config.json';
import * as path from 'path';
import webpackShellPlugin from 'webpack-shell-plugin-next';
import dotenv from 'dotenv-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import eslintwebpackplugin from 'eslint-webpack-plugin';


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
                }
            ]
        },


        output: {
            path: path.resolve(__dirname, output.path),
            filename: output.filename,
        },
        plugins : [
            new dotenv() as unknown as webpack.WebpackPluginInstance,
            new ForkTsCheckerWebpackPlugin(),
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
                        `echo 'Build process complete, ${isProduction ? 'you can make yarn monit for monitor' : "[CTRL+C to close]"} '`,
                        // `pm2 start ${isProduction ? 'config/pm2/pm2.prod.config.js' : 'config/pm2/pm2.dev.config.js'}`
                        isProduction ? 'pm2 start config/pm2/pm2.prod.config.js' :`nodemon ${output.path}/${output.filename}`,

                    ],
                    blocking: false,
                    parallel: true
                }

            }),


            new eslintwebpackplugin({
                extensions: ['ts'],
                exclude: ['node_modules', 'dist', 'build']
            })

        ]
    };
};