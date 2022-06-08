const express = require('express')
const app = express()
const typoRedirect = require('route-typo-redirect')

app.get('/', (req, res) => {
    res.send('Hello!')
})

app.get('/about', (req, res) => {
    res.send('about page')
})

app.get('/chat/:id', (req, res) => {
    res.send("chat page")
})

app.use(typoRedirect({
    routes: ["/chat/:id", "/about"]
}))

app.listen(3000)

