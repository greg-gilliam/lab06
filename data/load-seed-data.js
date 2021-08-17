/* eslint-disable indent */
// const { types } = require('pg');
const client = require('../lib/client');
// import our seed data:

const { getEmoji } = require('../lib/emoji.js');
const desserts = require('./desserts.js');
const types = require('./type.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      types.map(type => {
        return client.query(`
        INSERT INTO types (name)
        VALUES ($1)
        RETURNING *;
        `,
        [type.name]);
      })
    );

    await Promise.all(
      desserts.map(dessert => {
        return client.query(`
                    INSERT INTO desserts (
                      name, 
                      icing, 
                      type_id)
                    VALUES ($1, $2, $3)
                    RETURNING *;
                `,

          [dessert.name, dessert.icing, dessert.type_id]);
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
