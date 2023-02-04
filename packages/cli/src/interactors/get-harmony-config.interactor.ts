import type { readFileSync } from 'fs';
import { Validator } from 'jsonschema';

import { HarmonyConfig } from '../harmony.config.js';
import harmonyConfigSchema from '../../harmony.schema.json' assert { type: 'json' };

export class GetHarmonyConfigInteractor {
    constructor(
        private readonly readFile: typeof readFileSync,
    ) {}

    public execute(path: string): HarmonyConfig {
        const validator = new Validator();

        try {
            const config = JSON.parse(this.readFile(path, 'utf-8'));
            const res = validator.validate(config, harmonyConfigSchema);

            if (res.valid) {
                return config as HarmonyConfig;
            } else {
                const list = res.errors
                    .map(err => `  - "${err.path.join('.')}": ${err.message}`)
                    .join('\n');

                throw new Error(`Invalid "harmony.json" config:\n${list}`);
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new Error(`JSON parse error: "harmony.json" is not a valid JSON file.`);
            }

            throw e;
        }
    }
}
