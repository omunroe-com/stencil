import * as d from '../../declarations';
import { normalizePath } from '../../compiler/util';
import * as cp from 'child_process';
import * as path from 'path';


export async function runJest(config: d.Config, jestConfigPath: string) {
  const jestPkgJsonPath = config.sys.resolveModule(config.rootDir, 'jest');
  const jestPkgJson: d.PackageJsonData = require(jestPkgJsonPath);
  const jestBinModule = path.join(normalizePath(path.dirname(jestPkgJsonPath)), jestPkgJson.bin.jest);

  const args = process.argv.slice(2);

  args.push('--config', jestConfigPath);

  config.logger.debug(`jest module: ${jestBinModule}`);
  config.logger.debug(`jest args: ${args.join(' ')}`);

  return new Promise((resolve, reject) => {
    const p = cp.fork(jestBinModule, args, {
      cwd: config.rootDir
    });

    p.once('exit', () => resolve());
    p.once('error', reject);
  });
}


export async function setupJestConfig(config: d.Config) {
  const jestConfigPath = path.join(config.rootDir, STENCIL_JEST_CONFIG);

  config.logger.debug(`jest config: ${jestConfigPath}`);

  const jestConfig = Object.assign({}, config.testing);
  delete jestConfig.screenshotAdapters;

  await config.sys.fs.writeFile(
    jestConfigPath,
    JSON.stringify(jestConfig, null, 2)
  );

  return jestConfigPath;
}


const STENCIL_JEST_CONFIG = '.stencil.jest.config.json';