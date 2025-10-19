/*
  PATH  /src/core/utils/logger.js
*/
import chalk from 'chalk'

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 }
const DEFAULT = process.env.LOG_LEVEL || 'info'

/**
 * Simple color-coded logger with levels.
 * Levels: error < warn < info < debug
 * Only logs messages with level <= current logger.level.
 */
export const logger = {
  /** Current log level: 'error' | 'warn' | 'info' | 'debug' */
  level: DEFAULT,

  /**
   * Log a message if level is enabled.
   * @param {'error'|'warn'|'info'|'debug'} level - Log level
   * @param  {...any} args - Arguments to log
   */
  log (level, ...args) {
    if (LEVELS[level] <= LEVELS[this.level]) {
      const time = new Date().toISOString()
      let prefix = `[${time}] [${level.toUpperCase()}]`
      switch (level) {
        case 'error': prefix = chalk.red(prefix); break
        case 'warn': prefix = chalk.yellow(prefix); break
        case 'info': prefix = chalk.cyan(prefix); break
        case 'debug': prefix = chalk.gray(prefix); break
      }
      console.log(prefix, ...args)
    }
  },

  /** Log a debug message */
  debug (...args) { this.log('debug', ...args) },

  /** Log an info message */
  info (...args) { this.log('info', ...args) },

  /** Log a warning message */
  warn (...args) { this.log('warn', ...args) },

  /** Log an error message */
  error (...args) { this.log('error', ...args) }
}
