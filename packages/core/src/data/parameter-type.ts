export type HttpParameters = Record<string, ParameterType>;
export type HttpBody = Record<string, ParameterType | unknown | unknown[]> | undefined;
export type ParameterType = string | string[] | number | number[] | boolean | boolean[];
