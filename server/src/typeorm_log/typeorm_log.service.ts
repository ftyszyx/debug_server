import { AbstractLogger, LogLevel, LogMessage, QueryRunner } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
@Injectable()
export class TypeormLogService extends AbstractLogger {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly myLogger: Logger) {
    super(true);
  }
  /**
   * Write log to specific output.
   */
  protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[], _queryRunner?: QueryRunner) {
    // this.myLogger.error('writelog sql');
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: false,
    });

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          this.myLogger.info(message.message.toString(), 'sql');
          break;

        case 'info':
        case 'query':
          this.myLogger.info(message.message.toString(), message.prefix ? 'sql-' + message.prefix : 'sql');
          break;

        case 'warn':
        case 'query-slow':
          this.myLogger.warn(message.message.toString(), message.prefix ? 'sql-' + message.prefix : 'sql');
          break;

        case 'error':
        case 'query-error':
          this.myLogger.error(message.message.toString(), message.prefix ? 'sql-' + message.prefix : 'sql');
          break;
      }
    }
  }
}
