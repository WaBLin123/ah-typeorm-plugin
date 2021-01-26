// Logger
export type AhLoggingLevel =
  | "emerg"
  | "alert"
  | "crit"
  | "error"
  | "warning"
  | "notice"
  | "info"
  | "debug";
export interface PluginOption {
  autoCreateDB?: boolean;
  loggingLevels?: {
    logQuery: AhLoggingLevel;
    logQueryError: AhLoggingLevel;
    logQuerySlow: AhLoggingLevel;
    logSchemaBuild: AhLoggingLevel;
    logMigration: AhLoggingLevel;
  };
}

export interface LoggingLevels {
  logQuery: AhLoggingLevel;
  logQueryError: AhLoggingLevel;
  logQuerySlow: AhLoggingLevel;
  logSchemaBuild: AhLoggingLevel;
  logMigration: AhLoggingLevel;
  log: {
    logLevel: AhLoggingLevel;
    infoLevel: AhLoggingLevel;
    warnLevel: AhLoggingLevel;
  };
}
