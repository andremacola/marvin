import chalk from 'chalk'

export const logger = {
  dateBR: () => {
    const date = new Date()
      .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .slice(0, 19)
      .replace(',', '')
    return chalk.white.bold(`[${date}] =>`)
  },

  log: (...args: unknown[]) => console.log(logger.dateBR(), chalk.white(...args)),
  info: (...args: unknown[]) => console.log(logger.dateBR(), chalk.blue(...args)),
  gre: (...args: unknown[]) => console.log(logger.dateBR(), chalk.green(...args)),
  cya: (...args: unknown[]) => console.log(logger.dateBR(), chalk.cyan(...args)),
  yel: (...args: unknown[]) => console.log(logger.dateBR(), chalk.yellow(...args)),
  red: (...args: unknown[]) => console.log(logger.dateBR(), chalk.red(...args))
}
