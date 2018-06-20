# WebKonquest
KDE Konquest porting as a web app

# Install dependencies
First install yarn and ionic

```
npm install -g yarn ionic
```

Then install all dependencies
```
cd ./core && yarn install
cd ../client && yarn install
cd ../server && yarn install
```

To keep always update you can use the yarn link command.
This will set up your local dependency so that whenever you make a change on the dependency,
it immediately shows up in your main project without you having to do anything else to update it.

1) Run yarn link (with no additional flags) from within webkonquest core:
```
cd ./core
yarn link
```
2) Run yarn link <name of dependency package> from within the main projects:
```
cd ../client
yarn link "webkonquest-core"
cd ../server
yarn link "webkonquest-core"
```
And you're done!

Source: https://stackoverflow.com/a/41879331
