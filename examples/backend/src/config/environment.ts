export enum EnvironmentType {
  Development,
  Backend,
  Local,
  Staging,
  Production,
}

function getEnvValue(key: string, defaultValue?: string): string {
  return process.env[key] ?? defaultValue;
}

export class Environment {
  static current(): EnvironmentType {
    const env = (process.env.NODE_ENV ?? 'development').trim().toLowerCase();
    const envMap: Record<string, EnvironmentType> = {
      development: EnvironmentType.Development,
      backend: EnvironmentType.Backend,
      local: EnvironmentType.Local,
      staging: EnvironmentType.Staging,
      production: EnvironmentType.Production,
    };

    // Unknown environment
    if (!(env in envMap)) {
      console.warn('[WARNING] Invalid environment found: ', env);
    }

    return envMap[env] ?? EnvironmentType.Development;
  }

  static description(): string {
    const descMap: Record<EnvironmentType, string> = {
      [EnvironmentType.Development]: 'Development',
      [EnvironmentType.Backend]: 'Backend',
      [EnvironmentType.Local]: 'Local',
      [EnvironmentType.Staging]: 'Staging',
      [EnvironmentType.Production]: 'Production',
    };

    return descMap[this.current()];
  }

  static serverURL(): string {
    const protocol = getEnvValue('BACKEND_PROTOCOL', 'http');
    const domain = getEnvValue('BACKEND_DOMAIN', 'localhost');
    const isLocalhost = domain === 'localhost';
    const port = getEnvValue('BACKEND_PORT', isLocalhost ? '3000' : '');
    const path = Environment.serverBasePath();
    return `${protocol}://${domain}${port ? ':' : ''}${port}${path}`;
  }

  static serverBasePath(): string {
    return getEnvValue('BACKEND_PATH', '');
  }
}
