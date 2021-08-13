/* eslint-disable indent */
const client = require('../lib/client');
// import our seed data:

const { getEmoji } = require('../lib/emoji.js');
const desserts = require('./desserts.js');
run();

async function run() {

  try {
    await client.connect();



    await Promise.all(
      desserts.map(dessert => {
        return client.query(`
                    INSERT INTO desserts (name, icing, type)
                    VALUES ($1, $2, $3);
                `,

          [dessert.name, dessert.icing, dessert.type]);
      })
    );


    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
