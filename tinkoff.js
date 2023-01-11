export const getTinkoffRate = () => fetch('https://api.tinkoff.ru/v1/currency_rates?from=RUB&to=KZT')
    .then(r => r.json())
    .then(r => r.payload.rates.find(rate => rate.category === 'CUTransfersPrivate'))
    .then(r => r.buy)
