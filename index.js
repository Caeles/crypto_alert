const axios = require('axios');
const notifier = require('node-notifier');
const Pushover = require('pushover-notifications');

// Configuration
const cryptoId = 'ripple';
const currency = 'usd';    
const targetAmount = 3.71   
const interval = 60000;     

const push = new Pushover({
    user: 'YOUR_USER_KEY',  
    token: 'YOUR_API_TOKEN',
});

function sendPushNotification(price) {
    push.send({
        message: `🎉 ${cryptoId} a atteint ${price} € !`,
        title: 'Alerte Crypto',
        sound: 'magic',
    }, (err, result) => {
        if (err) throw err;
        console.log('Notification mobile envoyée :', result);
    });
}

async function checkCryptoPrice() {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${currency}`
        );
        const price = response.data[cryptoId][currency];
        console.log(`Prix actuel de ${cryptoId}: ${price} ${currency}`);

        if (price >= targetAmount) {
            notifier.notify({
                title: 'Alerte Crypto',
                message: `🎉 ${cryptoId} a atteint ${price} € !`,
                sound: true,
            });

            sendPushNotification(price);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

setInterval(checkCryptoPrice, interval);
console.log('Suivi en cours...');
