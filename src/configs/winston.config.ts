import {
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: process.env.LOGGER_LEVEL,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      level: process.env.LOGGER_LEVEL,
      filename: process.env.LOGGER_FILENAME,
      dirname: process.env.LOGGER_DIR,
    }),
  ],
};
