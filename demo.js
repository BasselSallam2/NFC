const { DemoEventTicket } = require('./demo-eventticket.js');
const { DemoFlight } = require('./demo-flight.js');
const { DemoGeneric } = require('./demo-generic.js');
const { DemoGiftCard } = require('./demo-giftcard.js');
const { DemoLoyalty } = require('./demo-loyalty.js');
const { DemoOffer } = require('./demo-offer.js');
const { DemoTransit } = require('./demo-transit.js');
const {BusinessCard} = require ('./card.js');

async function main() {

  // Create a demo class instance
  // Creates the authenticated HTTP client
  let demo = new BusinessCard();

  const issuer_id = process.env.WALLET_ISSUER_ID || 'your-issuer-id';
  const class_suffix = (process.env.WALLET_CLASS_SUFFIX || 'your-class-suffix') + demo.constructor.name;
  const object_suffix = (process.env.WALLET_OBJECT_SUFFIX || 'your-object-suffix') + demo.constructor.name;

demo.createJwtNewObjects(issuer_id, class_suffix, object_suffix);




}

main().catch(console.error);