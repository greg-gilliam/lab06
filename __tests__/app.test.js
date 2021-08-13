require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
// const dessertsData = require('../data/desserts.js');

describe('app routes', () => {
  describe('routes', () => {
    // let token;

    beforeAll(async () => {
      execSync('npm run setup-db');

      await client.connect();
      // const signInData = await fakeRequest(app)
      //   .post('/auth/signup')
      //   .send({
      //     email: 'jon@user.com',
      //     password: '1234'
      //   });

      // token = signInData.body.token; // eslint-disable-line
    }, 10000);

    afterAll(done => {
      return client.end(done);
    });

    test.skip('returns animals', async () => {

      const expectation = [
        {
          'id': 1,
          'name': 'bessie',
          'cool_factor': 3,
          'owner_id': 1
        },
        {
          'id': 2,
          'name': 'jumpy',
          'cool_factor': 4,
          'owner_id': 1
        },
        {
          'id': 3,
          'name': 'spot',
          'cool_factor': 10,
          'owner_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/desserts')
        .expect('Content-Type', /json/);
      // .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('POST /desserts creates a new dessert', async () => {
      const newDessert = {
        name: 'Chocolate Chip',
        icing: false,
        type: 'cookie'
      };

      const data = await fakeRequest(app)
        .post('/desserts')
        .send(newDessert)
        // .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(newDessert.name);
      expect(data.body.id).toBeGreaterThan(0);

    });
    test('PUT /desserts creates an updated dessert', async () => {
      const updatedDessert = {
        name: 'Chocolate Chip and walnut',
        icing: false,
        type: 'cookie'
      };

      const data = await fakeRequest(app)
        .put('/desserts')
        .send(updatedDessert)
        // .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(updatedDessert.name);
      expect(data.body.id).toBeGreaterThan(0);
    });
    test('POST /desserts creates an updated dessert', async () => {
      const newDessertInArray = {
        name: 'Chocolate Chip',
        icing: false,
        type: 'cookie'
      };

      const data = await fakeRequest(app)
        .put('/desserts')
        .send(newDessertInArray)
        // .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(newDessertInArray.name);
      expect(data.body.id).toBeGreaterThan(0);
    });
    test('DELETE /deletes one object in the array by query id', async () => {
      const deletedObject = {
        name: 'Chocolate Chip',
        icing: false,
        type: 'cookie'
      };
      await fakeRequest(app)
        .post('/desserts')
        .send(deletedObject)
        // .expect(200)
        .expect('Content-Type', /json/);
      const data = await fakeRequest(app)
        .delete('/desserts/6')
        .expect(200)
        .expect('Content-Type', /json/);
      console.log(data.body);
      expect(data.body).toEqual({ ...deletedObject, id: 6 });
      // expect(data.body.id).toBeGreaterThan(0);
    });
  });
});