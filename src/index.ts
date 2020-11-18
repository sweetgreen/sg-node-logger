import winston from 'winston';

export const sgLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    service: 'dont-forget-to-update-default-meta',
    otherKeys: 'test',
  },
  transports: [
    // FIXME: confirm this is what we want with the wider engineering team; is this the right name? Is this the right location to output the log files?
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// NOTE: we can configure an already created logger by doing sgLogger.configure({...})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  sgLogger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
