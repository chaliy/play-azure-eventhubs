// Based on http://hypernephelist.com/2014/09/16/sending-data-to-azure-event-hubs-from-nodejs.html

const moment = require('moment');
const crypto = require('crypto');
const fetch = require('node-fetch');

function createSasToken (uri, keyName, key) {
  // Token expires in one hour
  const expiry = moment().add(1, 'hours').unix();

  const hmac = crypto.createHmac('sha256', key);
  hmac.update(encodeURIComponent(uri) + '\n' + expiry);
  const signature = hmac.digest('base64');

  return 'SharedAccessSignature sr=' + encodeURIComponent(uri) + '&sig=' + encodeURIComponent(signature) + '&se=' + expiry + '&skn=' + keyName;
}

const keyName = process.env.PLAY_AZURE_EVENTHUBS_KEY_NAME || 'Send';
const key = process.env.PLAY_AZURE_EVENTHUBS_KEY;

const namespace = 'chaliy-play-azure-eventhubs';
const hubname = 'locations';

const uri = 'https://' + namespace + '.servicebus.windows.net' + '/' + hubname + '/messages';
const token = createSasToken(uri, keyName, key);

const payload = JSON.stringify({
  coord: {
    x: Math.random(),
    y: Math.random()
  }
});

fetch(uri, {
  method: 'POST',
  body: payload,
  headers: {
    'Authorization': token,
    'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
  }
})
  .then(console.log)
  .catch(console.error);
