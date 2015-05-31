var io = require('socket.io').listen(3000);

io.sockets.on("connection", arranque);

function arranque(socket){
    socket.on("datos_cliente", regresar_datos);
}

function regresar_datos(data){
    io.sockets.emit("datos_servidor", data);
}