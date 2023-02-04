import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Command } from 'commander';
import { join } from 'path';
import { readFileSync } from 'fs';
import { GetHarmonyConfigInteractor } from '../interactors/get-harmony-config.interactor.js';
import { HarmonyConfig } from '../harmony.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generate = new Command('generate');

generate.aliases(['g', 'gen']).action(async () => {
    // HACK: Modify `argv` so that plop thinks it's being called by its own CLI
    process.argv.shift();

    // Load `harmony.json`
    let config: HarmonyConfig;
    const getHarmonyConfig = new GetHarmonyConfigInteractor(readFileSync);

    try {
        config = await getHarmonyConfig.execute(join(process.cwd(), 'harmony.json'));
    } catch (e) {
        if (e instanceof Error) {
            return console.error(`${e.message}\n`);
        }

        return console.error('Unknown error while loading "harmony.json".');
    }

    console.log(config);

    // Import Plop
    const { Plop, run } = await import('plop');

    Plop.prepare(
        {
            // cwd: argv.cwd,
            configPath: join(__dirname, '../plopfile.js'),
            // preload: argv.preload || [],
            // completion: argv.completion
        },
        (env) =>
            Plop.execute(env, (env) => {
                const options = {
                    ...env,
                    dest: process.cwd(), // this will make the destination path to be based on the cwd when calling the wrapper
                };

                return run(options, undefined, true);
            }),
    );
});
