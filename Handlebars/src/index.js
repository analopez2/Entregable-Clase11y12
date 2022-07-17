import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { MemoryContainer } from './Api/MemoryContainer.js';
import { DATE_UTILS } from './utils/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MessagesApi = new MemoryContainer();
const ProductsApi = new MemoryContainer();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;

app.use(express.static('public'));

io.on('connection', async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.emit('mensajes', MessagesApi.getAll());

  socket.on('mensajeNuevo', ({ email, text }) => {
    const message = { email, text, timestamp: DATE_UTILS.getTimestamp() };
    MessagesApi.save(message);

    io.sockets.emit('mensajes', MessagesApi.getAll());
  });

  socket.emit('products', await ProductsApi.getAll());

  socket.on('add-product', async (data) => {
    const products = await ProductsApi.save(data);

    io.sockets.emit('products', ProductsApi.getAll());
  });
});

const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
server.on('error', (error) => {
  console.error(`Error en el servidor ${error}`);
});
