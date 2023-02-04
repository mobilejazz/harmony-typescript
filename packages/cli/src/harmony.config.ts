export interface HarmonyConfig {
    $schema?: string;
    type: 'angular' | 'nest';
    checklist?: {
        prettier: boolean;
        eslint: boolean;
    };
}
