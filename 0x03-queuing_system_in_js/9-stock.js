import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

function getItemById(id) {
  return listProducts.find((product) => product.id === id);
}

function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
  return promisify(client.get).bind(client)(`item.${itemId}`);
}

const app = express();

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const item = getItemById(itemId);
  if (!item) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }
  let currentReservedStock = await getCurrentReservedStockById(itemId);

  if (isNaN(currentReservedStock)) {
    reserveStockById(itemId, 0);
    currentReservedStock = 0;
  }
  res.json({
    itemId: item.id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock,
    currentQuantity: item.stock - currentReservedStock,
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const item = getItemById(itemId);
  if (!item) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }
  const currentReservedStock = await getCurrentReservedStockById(itemId);
  if (currentReservedStock >= item.stock) {
    res.status(403).json({ status: 'Not enough stock available', itemId });
    return;
  }
  reserveStockById(itemId, parseInt(currentReservedStock, 10) + 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

app.listen(1245, () => {
  console.log('Server listening on port 1245');
});
