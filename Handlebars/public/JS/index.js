const socket = io.connect();

//#region Mensajes
function sendMessage() {
  const user = document.getElementById('user');
  const message = document.getElementById('msg');

  if (!user.value || !message.value) {
    alert('Debe completar los campos');
    return false;
  }

  socket.emit('nuevoMensaje', { author: user.value, text: message.value });
  mensaje.value = '';
  return false;
}

socket.on('mensajes', (messages) => {
  let html = messages
    .map(
      (msg) =>
        `<div>
        <b style="color:blue;">${msg.author}</b>
        [<span style="color:brown;">${msg.fyh}</span>] :
        <i style="color:green;">${msg.text}</i>
        </div>`
    )
    .join(' ');

  document.getElementById('').innerHTML = html;
});
//#endregion

//#region Productos
const tableProductos = async (products) => {
  const table = await (await fetch('views/products.hbs')).text();
  const templateCompiled = Handlebars.compile(table);
  return templateCompiled({ products });
};

const postProduct = () => {
  const title = document.getElementById('title');
  const price = document.getElementById('price');
  const thumbnail = document.getElementById('thumbnail');

  if (!title.value || !price.value || !thumbnail.value) {
    alert('Los campos son requeridos');
  }

  socket.emit('postProducts', {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value,
  });
  title.value = '';
  price.value = '';
  thumbnail.value = '';
};

document.getElementById('postProducts').addEventListener('click', postProduct);

socket.on('products', async (products) => {
  const table = await tableProductos(products);
  document.getElementById('products').innerHTML = table;
});

//#endregion
