const request = require('request');
const { expect } = require('chai');

describe('API integration test', () => {
  const API_URL = 'http://localhost:1245'; // Update the port

  it('GET /list_products returns correct response', (done) => {
    request.get(`${API_URL}/list_products`, (_err, res, body) => {
      expect(res.statusCode).to.be.equal(200);
      const productList = JSON.parse(body);
      //   expect(productList.length).to.deep.equal(listProducts);
      expect(productList.length).to.be.equal(4);
      done();
    });
  });

  it('GET /list_products/:itemId returns correct response', (done) => {
    const itemId = 1;
    request.get(`${API_URL}/list_products/${itemId}`, (_err, res, body) => {
      expect(res.statusCode).to.be.equal(200);
      const response = JSON.parse(body);
      const expectedResponse = {
        itemId: 1,
        itemName: 'Suitcase 250',
        price: 50,
        initialAvailableQuantity: 4,
        currentQuantity: 4,
      };
      expect(response).to.deep.equal(expectedResponse);
      done();
    });
  });

  it('GET /list_products/:itemId with invalid itemId returns 404 response', (done) => {
    const invalidItemId = 100;
    request.get(
      `${API_URL}/list_products/${invalidItemId}`,
      (_err, res, body) => {
        expect(res.statusCode).to.be.equal(404);
        done();
      },
    );
  });

  it('GET /reserve_product/:itemId returns 200 response for valid reservation', (done) => {
    const itemId = 1;
    request.get(`${API_URL}/reserve_product/${itemId}`, (_err, res, body) => {
      expect(res.statusCode).to.be.equal(200);
      const response = JSON.parse(body);
      expect(response).to.deep.equal({
        status: 'Reservation confirmed',
        itemId: 1,
      });
      done();
    });
  });

  it('GET /reserve_product/:itemId returns 404 response for invalid itemId', (done) => {
    const invalidItemId = 100;
    request.get(
      `${API_URL}/reserve_product/${invalidItemId}`,
      (_err, res, body) => {
        expect(res.statusCode).to.be.equal(404);
        done();
      },
    );
  });

  it.skip('GET /reserve_product/:itemId returns 403 response for insufficient stock', (done) => {
    const itemId = 1;
    request.get(`${API_URL}/reserve_product/${itemId}`, (_err, res, body) => {
      expect(res.statusCode).to.be.equal(403);
      done();
    });
  });
});
