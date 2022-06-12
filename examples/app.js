const express = require('express')
const app = express()
const typoRedirect = require('route-typo-redirect')

function availableRoutes() {
    return app._router.stack
        .filter((r) => r.route && r.route.path !== "/")
        .map((r) => {
            return r.route.path
        });
}

app.get('/', (req, res) => {
    res.send('Hello!')
})

app.get('/about', (req, res) => {
    res.send('about page')
})

app.get('/chat/:id', (req, res) => {
    res.send("chat page")
})

app.use("*", typoRedirect({
    routes: availableRoutes()
}))

app.listen(3000)

