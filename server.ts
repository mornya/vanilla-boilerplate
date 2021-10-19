import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';
import webpackDevServerConfig from './dev-server.config';

(async () => {
  try {
    const compiler = webpack(webpackConfig as webpack.Configuration);

    compiler.hooks.invalid.tap(
      'invalid',
      () => console.info('Compiling...'),
    );
    compiler.hooks.done.tap(
      'done',
      (stats) => {
        if (!stats.hasErrors()) {
          console.info('\nListening dev-server - http://localhost:3000\n');
        }
      },
    );

    // 로컬 데브 서버 실행시 webpack-dev-server 설정
    const devServer = new WebpackDevServer(webpackDevServerConfig, compiler);

    const closeAndQuit = async () => {
      await devServer.stop();
      console.info('\nTerminated development server.\n');
      process.exit(0);
    };

    await devServer.start();

    ;['beforeExit', 'unhandledRejection', 'SIGINT', 'SIGTERM']
      .forEach((event) => process.on(event, closeAndQuit));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
