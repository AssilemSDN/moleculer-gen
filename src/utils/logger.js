/*
  PATH /src/utils/logger.js
*/
import chalk from 'chalk'
import logSymbols from 'log-symbols'

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
    if (LEVELS[level] > LEVELS[this.level]) { return }
    if (level === 'debug') {
      const time = new Date().toISOString()
      console.error(
        chalk.gray(`[${time}] [DEBUG]`),
        ...args
      )
      return
    }
    if (level === 'warn' || level === 'error') {
      console.error(...args)
      return
    }
    console.log(...args)
  },

  newLine () {
    console.log()
  },

  plain: (...args) => {
    console.log(...args)
  },

  /** Log a debug message */
  debug (...args) {
    this.log('debug', ...args)
  },

  /** Log an info message */
  info (...args) {
    this.log('info', logSymbols.info, ...args)
  },

  /** Log a success message */
  success (...args) {
    this.log('info', logSymbols.success, ...args)
  },

  /** Log a warning message */
  warn (...args) {
    this.log('warn', logSymbols.warning, ...args)
  },

  /** Log an error message */
  error (...args) {
    this.log('error', logSymbols.error, ...args)
  }
}
