"use strict";
// Reference: https://www.joshmorony.com/integrating-an-ionic-application-with-a-nodejs-backend/
// Reference ws: https://medium.com/factory-mind/725114ad5fe4
var _this = this;
exports.__esModule = true;
var path = require("path");
var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var logger = require("morgan");
var methodOverride = require("method-override");
var WebSocket = require("ws");
var gameserver_1 = require("./gameserver");
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(cors());
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));
var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });
var gameServer = new gameserver_1.GameServer();
app.get('/api/version', function (req, res) {
    res.json({ 'version': '1.0.0' });
});
app.get('/api/newgame', function (req, res) {
    res.json({ id: _this.gameServer.newGame() });
});
//start our server
server.listen(process.env.PORT || 8080, function () {
    console.log("Server started on port " + server.address().port);
});
