const path = require('path')
const express = require('express')
const port = (process.env.PORT || 8080);

module.exports = {
    start: () => {
        const app           = express();
        const indexPath     = path.join(__dirname, '/client/index.html')
        const publicPath    = express.static(path.join(__dirname, '/client'))
        const dbPath        = express.static(path.join(__dirname, '/db.json'))

        app.use('/', publicPath);
        app.use('/db.json', dbPath);
        app.get('/', function (_, res) { res.sendFile(indexPath); });

        app.listen(port)
        console.log(`Listening at http://localhost:${port}`)
    }
}
