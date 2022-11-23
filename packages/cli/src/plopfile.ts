import { NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI) {
    plop.setWelcomeMessage('Generate');

    plop.setGenerator('interactor', {
        description: 'Create an interactor',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Interactor name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/{{ kebabCase name }}.interactor.ts',
                templateFile: 'templates/interactor.ts.hbs',
            },
        ],
    });

    plop.setGenerator('feature', {
        description: 'Create a feature',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Feature name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/features/{{ kebabCase name }}/{{ kebabCase name }}.provider.ts',
                templateFile: 'templates/provider.ts.hbs',
            },
            {
                type: 'add',
                path: 'src/features/{{ kebabCase name }}/{{ kebabCase name }}.provider.module.ts',
                templateFile: 'templates/provider.module.ts.hbs',
            },
        ],
    });
}
