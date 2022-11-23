import { Command } from 'commander';

export const check = new Command('check');

check.action(async () => {
    console.log('check!');
});
