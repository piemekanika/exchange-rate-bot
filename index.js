import { config } from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import { getMoexRates } from './moex.js'
import { getTinkoffRate } from './tinkoff.js'

config()

const bot = new TelegramBot(process.env.token, { polling: true })

bot.on('message', async (message) => {

    await bot.sendMessage(message.chat.id, 'Загрузка...')

    try {
        const tinkoff = await getTinkoffRate()
        const tinkoffRate = `Курс *тенге* в Тинькофф: \t\t\t*${String(tinkoff).replace('.', '\\.')}*`

        const moex = await getMoexRates()
        const moexRates = moex.map(e => `Курс *${e.name}* мос биржа: \t\t\t*${String(e.rate).replace('.', '\\.')}*`)

        const rates = [
            tinkoffRate,
            ...moexRates.reverse(),
        ].join('\n\n')

        await bot.sendMessage(message.chat.id, rates, {parse_mode: 'MarkdownV2'})
    } catch (e) {
        await bot.sendMessage(message.chat.id, 'Что-то пошло не так')
        console.log(e)
    }
})
