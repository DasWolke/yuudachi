const Command = require('../../structure/Command');

class Choose extends Command {
    constructor(bot) {
        super();
        this.cmd = 'choose';
        this.type = 'fun';
        this.bot = bot;
        this.help = {description: 'Let the bot choose something for you, seperate choices with `;`'};
        this.choiceTemplates = ['You should go with **{{item}}**.',
            'I think you should try **{{item}}** ?',
            'How about **{{item}}** ?',
            '**{{item}}** sounds like a good idea'];
    }

    async run(msg, args) {
        let chooseString = args.join(' ').trim();
        if (chooseString === '' && args.length === 0) {
            return this.bot.rest.channel.createMessage(msg.channel_id, 'I can\'t choose something for you, if you give me no choices');
        }
        if (chooseString.endsWith(';')) {
            chooseString = chooseString.substring(0, chooseString.length - 1);
        }
        let choices = chooseString.split(';');
        for (let i = 0; i < choices.length; i++) {
            choices[i] = choices[i].trim();
        }
        let result = choices[Math.floor(Math.random() * choices.length)];
        let template = this.choiceTemplates[Math.floor(Math.random() * this.choiceTemplates.length)];
        return this.bot.rest.channel.createMessage(msg.channel_id, `${template.replace('{{item}}', result)}`);
    }
}

module.exports = Choose;
