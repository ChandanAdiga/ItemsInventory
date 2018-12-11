
const http = require('http')
const app = require('./app');
const appDbConfig = require('./config/database.config');
const mongoose = require('mongoose');

const PORT_ADD = 3332;
const port = normalizePort(process.env.PORT || PORT_ADD);

console.log("\nSetting up database..");
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(appDbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
    const server = http.createServer(app);
    server.listen(port);
    // server.on('error',onError);
    // server.on('listening',onListening);
    console.log('\appRESTSample Server is running successfully @ http://localhost:'+PORT_ADD);
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

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
