# WebKonquest
KDE Konquest porting as a progressive web app.

## Install dependencies
First install nodejs >= 8.x and yarn from the official website, then install ionic globally.

```
yarn global add ionic
```

Then install all the dependencies.
```
(cd ./core && yarn install)
(cd ./client && yarn install)
(cd ./server && yarn install)
```

To keep the client and server always with the last version of core you can use the yarn link command.
This will set up your local dependency so that, whenever you make a change on it,
it's immediately updated in your main project.

1) Run yarn link (with no additional flags) from within webkonquest core:
```
(cd ./core && yarn link)
```
2) Run yarn link <name of dependency package> from within the main projects:
```
(cd ./client && yarn link "webkonquest-core")
(cd ./server && yarn link "webkonquest-core")
```

Source: https://stackoverflow.com/a/41879331

## Production build
To build the production package...

### Core
Build the core.
```
(cd ./core && yarn build)
```

### Server
Build the server
```
(cd ./server && yarn build)
```
and install every non-dev dependency in the dist folder.

```
(cd ./server && yarn install --production --modules-folder ./dist/node_modules)
```

### Client
Build the client
```
(cd ./client && yarn build --prod)
```
and copy the client package in the server package.
```
(cp -R ./client/www ./server/dist/public)
```

The package is ready, in the folder `./server/dist`!

### To deploy on Azure
Copy also the following files from `./server` to `./server/dist`:
- azuredeploy.json
- iisnode.yml
- package.json
- process.json
- web.config

## Development environment
To start client and server in a development environment...

### Core
Build the core.
```
(cd ./core && yarn build)
```

### Server
Start the server.
```
(cd ./server && yarn start:dev)
```
It will be available on localhost:4200.

### Client
Start the client.
```
(cd ./server && yarn start)
```
It will be available on localhost:8080.

## Other links
- Konquest (https://games.kde.org/game.php?game=konquest) and its original source (https://cgit.kde.org/konquest.git/tree)
- Galactic Conquest (https://archive.org/details/GalacticConquestV2.1SW1987RickRaddatzStrategy), the original game by Rick Raddatz
