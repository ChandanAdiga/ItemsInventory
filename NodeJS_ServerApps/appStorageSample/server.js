const http = require('http')
const app = require('./app');

const PORT_ADD = 3333;
const port = normalizePort(process.env.PORT || PORT_ADD);

const server = http.createServer(app);
server.listen(port);
// server.on('error',onError);
// server.on('listening',onListening);
console.log('\nStorage Server is running successfully @ http://localhost:'+PORT_ADD);

function normalizePort(val) {
    var port = parseInt(val,10);

    if(isNaN(port)) {
        return val;
    }

    if(port >= 0) {
        return port;
    }

    return false;
}
