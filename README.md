# Auth0 Authorization Extension

## Prefeituras considerações

Deve ser adicionado um arquivo de configurações no seguintes diretórios:
```config/default.json``` e ```production.json```.
Com o seguinte conteúdo: 
```
{
  "MONGODB_URL": "mongodb://",
  "URL": "http://prefeitura:3020",
  "HOST": "prefeitura",
  "PORT": "3020",
  "URL_AUTH": "http://prefeitura:3200/auth"
}
```

## Running in Production

```bash
npm install
npm run client:build
npm run server:prod
```

## Running in Development

Update the configuration file under `./server/config.json`:

```json
{
  "AUTHORIZE_API_KEY": "mysecret",
  "EXTENSION_SECRET": "mysecret",
  "AUTH0_DOMAIN": "me.auth0.com",
  "AUTH0_CLIENT_ID": "myclientid",
  "AUTH0_CLIENT_SECRET": "myclientsecret"
}
```

Then you can run the extension:

```bash
npm install
npm run serve:dev
```
