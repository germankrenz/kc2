var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = [];

io.on('connection', function(socket){
    //io.set('heartbeat interval', 20);
    //socket.id = "q";
    //console.log('conectado ' + socket.id);
    
    socket.on('chat message', function(msg, from, idDuelo){
        socket.broadcast.to(idDuelo).emit('chat message', msg); //ANDA, manda solo al oponente
        //io.to(idDuelo).emit('chat message', msg); //ANDA, manda a todos
        //io.sockets.in(idDuelo).emit('chat message', msg); //ANDA, manda a todos
        //io.emit('chat message', socket.id + ' dice: ' + msg); //Manda a todos todos
        
    });
    
    socket.on('loguin', function(idUsuario, nombre){

        //socket.id = idUsuario;
        console.log('Conectado: ' + idUsuario + '-' + nombre);
        //users.push(socket.id);
        socket.user = idUsuario;
        
        //io.emit('persona logued', 'id usuario ' + idUsuario); //Manda a todos todos
        
        var singleUser = {};
        singleUser['id'] = socket.id;
        singleUser['idUsuario'] = idUsuario;
        singleUser['enDuelo'] = "false";
        singleUser['nombre'] = nombre;
        users.push(singleUser);
        
        //io.emit('all online users', users); //Manda a todos todos
  
    });
    
    socket.on('BuscarOponente', function(idUsuario){
        
        console.log('Buscando oponente: ' + idUsuario);
        var nombreUsuario;
        for (i in users){
            if (users[i].idUsuario == idUsuario){
                nombreUsuario = users[i].nombre //cambiar por el nombre del usuario
                break;
            }
        }
        
        for (i in users){
            if (users[i].idUsuario != idUsuario && users[i].enDuelo == "false"){
                users[i].enDuelo = "true";
                var nombreOponente = users[i].nombre;
                var idOponente = users[i].idUsuario;
                var json = '{"nombre": "' + nombreUsuario + '", "idUsuario": "' + idUsuario + '"}';
                io.sockets.connected[users[i].id].emit('preguntaOponente', json);
                console.log(nombreUsuario + ' encontro oponente: ' + users[i].idUsuario + '-' + users[i].nombre);
                break;
            }
        }
  
    });
    
    socket.on('AceptoDuelo', function(idUsuario, idOponente, idDuelo){
        
        console.log(idUsuario + ' acepto duelo a: ' + idOponente + '- id duelo: ' + idDuelo);
        
        for (i in users){
            if (users[i].idUsuario == idOponente){
                io.sockets.connected[users[i].id].emit('dueloAceptado', idDuelo);
                break;
            }
        }
        
        
  
    });
    
    socket.on('iniciar', function(idUsuario, idDuelo){
        socket.join(idDuelo);
        //socket.id = idUsuario;
        console.log(idUsuario + idDuelo);
        //users.push(socket.id);
        socket.user = idUsuario;
        
        //io.emit('persona logued', 'id usuario ' + idUsuario); //Manda a todos todos
        
        var singleUser = {};
        singleUser['id'] = socket.id;
        singleUser['idUsuario'] = idUsuario;
        singleUser['enDuelo'] = "false";
        singleUser['nombre'] = "pepe";
        users.push(singleUser);
        
        io.emit('all online users', users); //Manda a todos todos
        
        //socket.broadcast.to("q").emit('my message', msg);
        //io.emit('chat message', from + msg + ' ' + to);
        
        
        
        
        //EJEMPLO
        //var listOfObjects = [];
        //var a = ["car", "bike", "scooter"];
        //a.forEach(function(entry) {
        //    var singleObj = {}
        //    singleObj['type'] = 'vehicle';
        //    singleObj['value'] = entry;
        //    listOfObjects.push(singleObj);
        //});

        //console.log(listOfObjects);

        //$('#e').html(listOfObjects[2].value);
        
        
        
    });
    
    socket.on('disconnect', function(){
        
        //users.splice(users.indexOf(socket.user), 1);
        
        for (i in users){
            if (users[i].id == socket.id){
                console.log('user disconnected ' + users[i].nombre);
                users.splice(i, 1);
                break;
            }
        }
        //io.emit('remove user', socket.user);

    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});