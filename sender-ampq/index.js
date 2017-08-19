const EventHubClient = require('azure-event-hubs').Client;
const key = process.env.PLAY_AZURE_EVENTHUBS_KEY;

const client = EventHubClient.fromConnectionString('Endpoint=sb://chaliy-play-azure-eventhubs.servicebus.windows.net/;SharedAccessKeyName=Send;SharedAccessKey=' + key + ';EntityPath=locations');

client.open()
  .then(() => client.createSender())
  .then(tx => {
    console.log('Created!');
    tx.on('errorReceived', console.error);
    return tx.send({ contents: 'Here is some text sent to partition 10.' });
  })
  .then(() => console.log('Sent'));
