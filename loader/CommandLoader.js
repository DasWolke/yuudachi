const recursive = require('recursive-readdir')
module.exports = async (dirPath, bot) => {
  const commands = {}
  const aliasMap = {}
  const types = {}
  const files = await recursive(dirPath)
  const subCommands = []
  for (const file of files) {
    if (!file.endsWith('.js')) {
      return
    }
    const CommandClass = require('../' + file)
    if (CommandClass.isSubcommand) {
      subCommands.push(CommandClass)
      continue
    }
    const command = new CommandClass(bot)
    commands[command.cmd] = command
    if (Array.isArray(types[command.type])) {
      types[command.type].push(command.cmd)
    } else {
      types[command.type] = [command.cmd]
    }
    for (const alias of command.aliases) {
      aliasMap[alias] = command.cmd
    }
  }
  for (const Subcommand of subCommands) {
    const cmd = new Subcommand(bot)
    if (commands[cmd.parent]) {
      commands[cmd.parent].subCommands[cmd.cmd] = cmd
    }
  }
  return { commands, aliasMap, types }
}
