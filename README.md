
# route-typo-redirect

Make your users happy with catch typos with middleware and redirect to right one. 

Works with Express

## Install 

```bash 
  npm i route-typo-redirect
```
    
## Usage
Middleware needs your routes with array of strings. It gets the request path and analyzes it with rules and redirects.

```js
const typoRedirect = require('route-typo-redirect')

app.use("*",typoRedirect({
    routes: ["/chat", "/about/:id", "/home"]
}))

app.use("*",typoRedirect({
    routes: ["/chat", "/about/:id", "/home"],
    blacklist: ["/user"],
}))

app.use("*",typoRedirect({
    routes: ["/chat", "/about/:id", "/home"],
    blacklist: ["/user"],
    levenThreshold: 2,
    fuzzyThreshold: 4,
}))
```

Also there is a cool snippet to get all routes from Express

```js
  function availableRoutes() {
      return app._router.stack
          .filter((r) => r.route && r.route.path !== "/")
          .map((r) => {
              return r.route.path
          });
  }

  app.use("*",typoRedirect({
    routes: availableRoutes(),
    blacklist: ["/user"],
    levenThreshold: 2,
    fuzzyThreshold: 4,
}))
```

## Demo

[Example](https://github.com/snowron/route-typo-redirect/blob/master/example/app.js)

[Tests](https://github.com/snowron/route-typo-redirect/blob/master/index.test.js)


```bash
➜ curl "http://localhost:3000/abouc/"           
Found. Redirecting to /about/%                                                                                                                                                                             

➜ curl "http://localhost:3000/abouct/"
Found. Redirecting to /about/%    

➜ curl "http://localhost:3000/chay/123"
Found. Redirecting to /chat/123%     
```

## Tests

```bash
  npm run test
```

## Options

| Parameter        | Type            | Desc                                          |
| :--------------- | :-------------- | :-------------------------------------------- |
| `blacklist`      | `array<string>` | these routes not redirect                     |
| `routes`         | `array<string>` | whitelist routes                              |
| `levenThreshold` | `number`        | the levenstein algorithm's threshold value    |
| `fuzzyThreshold` | `number`        | fuzzy comparasion algorithm's threshold value |

  
## Lisans

[MIT](https://choosealicense.com/licenses/mit/)

  