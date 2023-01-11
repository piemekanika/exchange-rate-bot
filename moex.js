import Jsonp from 'node-jsonp'

export const getMoexRates = () => {
    const url = 'https://iss.moex.com/iss/engines/currency/markets/selt/boardgroups/13/securities.jsonp?iss.meta=off&iss.json=extended&callback=JSON_CALLBACK&lang=ru&security_collection=177&sort_column=VALTODAY&sort_order=desc'

    return new Promise((resolve, reject) => {
        try {
            Jsonp(url, data => {

                const marketDataRaw = data[1].marketdata

                const dict = {
                    'CNYRUB_TOM': 'юань',
                    'USD000UTSTOM': 'доллар',
                    'USDKZT_TOM': 'тенге \\(usd\\)',
                    'KZTRUB_TOM': 'тенге',
                }

                const neededSecIds = Object.keys(dict)

                const marketData = marketDataRaw
                    .filter(e => neededSecIds.includes(e.SECID))
                    .map(e => ({
                        rate: e.LAST,
                        code: e.SECID,
                        name: dict[e.SECID],
                    }))

                const kztRub = marketData.find(e => e.code === 'KZTRUB_TOM')

                kztRub.rate = +(100 / kztRub.rate).toFixed(4)

                resolve(marketData)
            })
        } catch (e) {
            reject(e)
        }
    })
}