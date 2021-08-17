require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');


describe('desserts routes', () => {
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

  
    test('GET /desserts returns list of desserts', async() => {
      const expected = [
        {
          name: 'Lemon Meringue',
          icing: false,
          type_id: 2,
          id: 1
        },
        {
          name: 'Carrot Cake',
          icing: true,
          type_id: 1,
          id: 2
        },
        {
          name: 'Devils Food Cake',
          icing: true,
          type_id: 1,
          id: 3
        }
      ];
      const data = await fakeRequest(app)
        .get('/desserts')
        .expect('Content-Type', /json/);
      // .expect(200);
      // const names = data.map(dessert=>dessert.name);

      expect(data.body).toEqual(expected);

      // expect(dessertsData.length).toBe(dessertsData.length);

      // expect(data.body[0].id).toBeGreaterThan(0);
    });
    test('GET /desserts:id returns list of individual desserts', async() => {
      const expected = 
        {
          name: 'Lemon Meringue',
          icing: false,
          type_id: 2,
          id: 1
        };
      const data = await fakeRequest(app)
        .get('/desserts/1')
        .expect('Content-Type', /json/)
        .expect(200);
      // const names = data.map(dessert=>dessert.name);

      expect(data.body).toEqual(expected);

      // expect(dessertsData.length).toBe(dessertsData.length);

      // expect(data.body[0].id).toBeGreaterThan(0);
    });
    test('(types)GET / returns type of desserts', async() => {
      const data = await fakeRequest(app)
        .get('/types')
        .expect('Content-Type', /json/)
        .expect(200);
      const typeData = [
        { name: 'cake', id:1 },
        { name: 'pie', id:2 },
        { name: 'cookie', id:3 }
      ];
      expect(data.body).toEqual(typeData);
    });
    test('POST /desserts creates a new dessert', async () => {
      const newDessert = {
        name: 'Chocolate Chip',
        icing: false,
        type_id: 3
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
        type_id: 3
      };

      const data = await fakeRequest(app)
        .put('/desserts')
        .send(updatedDessert)
        // .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(updatedDessert.name);
      expect(data.body.type_id).toBeGreaterThan(0);
    });
    test('POST /desserts creates an updated dessert', async () => {
      const newDessertInArray = {
        name: 'Chocolate Chip',
        icing: false,
        type_id: 3
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
        type_id: 3
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
      expect(data.body).toEqual({ ...deletedObject, id: 6 });
      // expect(data.body.id).toBeGreaterThan(0);
    });
  });
});