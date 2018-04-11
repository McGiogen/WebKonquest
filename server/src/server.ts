// Reference: https://www.joshmorony.com/integrating-an-ionic-application-with-a-nodejs-backend/
// Reference ws: https://medium.com/factory-mind/725114ad5fe4

import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as methodOverride from 'method-override';
import * as cors from 'cors';
import * as WebSocket from 'ws';
import {GameServer, GameConfig, LocalGame, Request} from 'webkonquest-core';

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

app.get('/version', (req, res) => {
  res.json({ 'version': '0.0.1' });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  const playerId = Math.random();
  console.log('New client connected. Id ' + playerId);

  // connection is up, handling request events
  ws.on('message', (json: string) => {
    const message = JSON.parse(json) as Request;
    console.log('Message received.', message);

    const response = GameServer.handleMessage();
    if (response) {
      ws.send(JSON.stringify(response));
    }
  });

  // send immediatly a feedback to the incoming connection with player identifier
  const response = GameServer.getConnectionResponse(playerId);
  ws.send(JSON.stringify(response));
});


//start our server
// app.listen(process.env.PORT || 8080);
server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port}`);
});
