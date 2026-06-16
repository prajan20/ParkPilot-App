const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'execution.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

module.exports = logger;
