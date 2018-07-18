// Reference: https://www.joshmorony.com/integrating-an-ionic-application-with-a-nodejs-backend/
// Reference ws: https://medium.com/factory-mind/725114ad5fe4

import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as methodOverride from 'method-override';
//import * as cors from 'cors';
import * as WebSocket from 'ws';
import {GameServer} from './gameserver';

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(cors());
app.use(express.static(path.join(__dirname, 'public'), {index: 'index.html'}));

const server = http.createServer(app);
const gameServer = new GameServer();

app.get('/api/version', (req, res) => {
  res.json({ 'version': '1.0.0' });
});

/*app.get('/api/newgame', (req, res) => {
  res.json({ id: this.gameServer.newGame() });
});*/

const wss = new WebSocket.Server({
  server,
  path: '/api/socket'
});

wss.on('connection', ws => {

  // connection is up, handling request events
  ws.on('message', (json: string) => {
    const message = JSON.parse(json);
    console.log('Message received.', message);

    const response = gameServer.handleMessage(message, ws);

    if (response != null) {
      console.log('Message sent.', response);
      ws.send(JSON.stringify(response));
    }
  });

  // send immediatly a feedback to the incoming connection with player identifier
  ws.send(JSON.stringify('Hello from server!'));
});

//start our server
server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port}`);
});
