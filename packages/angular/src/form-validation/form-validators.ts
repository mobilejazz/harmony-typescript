import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators {
    private static readonly ERROR_BODY = { valid: false };

    /**
     * Substitution of the native `Validations.pattern` that allows
     * an id as an input so multiple patterns can be used and identified.
     * It also allows a string pattern or a RegExp.
     */
    private static pattern(pattern: RegExp | string, id = 'pattern'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return FormValidators.isPatternFound(control, pattern)
                ? null
                : {
                      [id]: FormValidators.ERROR_BODY,
                  };
        };
    }

    /**
     * Unlike "pattern" validator, "errorPattern" uses the pattern
     * to identify the errors in the FormControl value.
     */
    private static errorPattern(pattern: RegExp | string, id = 'errorPattern'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return FormValidators.isPatternFound(control, pattern)
                ? {
                      [id]: FormValidators.ERROR_BODY,
                  }
                : null;
        };
    }

    private static isPatternFound(control: AbstractControl, pattern: RegExp | string): boolean {
        const value = control.value;
        if (!value) {
            return false;
        }

        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

        return regex.test(value);
    }
}
