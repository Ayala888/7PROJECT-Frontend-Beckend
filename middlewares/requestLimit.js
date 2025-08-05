const rateLimit = require('express-rate-limit')

const requestLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: 'Сұраныс тым көп. Кейінірек қайталап көріңіз.',
    statusCode: 429
})

module.exports = requestLimit