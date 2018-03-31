// Reference: https://www.joshmorony.com/integrating-an-ionic-application-with-a-nodejs-backend/
// Reference ws: https://medium.com/factory-mind/725114ad5fe4

import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as methodOverride from 'method-override';
import * as cors from 'cors';
import * as WebSocket from 'ws';

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

  //connection is up, let's add a simple simple event
  ws.on('message', message => {

    //log the received message and send it back to the client
    console.log('received: %s', message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send('Hi there, I am a WebSocket server');
});


//start our server
// app.listen(process.env.PORT || 8080);
server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port}`);
});
