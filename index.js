import { config } from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import { getMoexRates } from './moex.js'
import { getTinkoffRate } from './tinkoff.js'

config()

const bot = new TelegramBot(process.env.token, { polling: true })

const stringifyRate = (name, origin, rate) => {
    return `Курс *${name}* в ${origin}: \t\t\t*${rate}*`
}

const reply_markup = {
    keyboard: [['Показать курсы']],
    resize_keyboard: true,
}

bot.on('message', async (message) => {
    const { message_id } = await bot.sendMessage(message.chat.id, 'Загрузка...')

    try {

        const tinkoff = await getTinkoffRate()
        const tinkoffRate = stringifyRate('тенге', 'Тинькофф', tinkoff)

        const moex = await getMoexRates()
        const moexRates = moex
            .reverse()
            .map(e => stringifyRate(e.name, 'мос. биржа', e.rate))

        const rates = [
            tinkoffRate,
            ...moexRates,
        ]
            .join('\n\n')
            .replaceAll('.', '\\.')

        await bot.sendMessage(message.chat.id, rates, {
            parse_mode: 'MarkdownV2',
            reply_markup,
        })

    } catch (e) {
        await bot.sendMessage(message.chat.id, 'Что-то пошло не так' , {
            reply_markup,
        })
        console.log(e)
    } finally {
        await bot.deleteMessage(message.chat.id, message_id)
    }
})
