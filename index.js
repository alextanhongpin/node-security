const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const express = require('express')
const helmet = require('helmet')

const app = express()

app.use(helmet())
app.use(helmet.noCache())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
// Mount api before csrf is appended to the app stack.
// app.use("/api", api)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false // This is not set.
  }
}))

app.get('/health', (req, res) => {
  res.status(200).json({
    healthy: true,
    version: '0.0.1',
    buildDate: Date.now(),
    startAt: Date.now()
  })
})

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'hello world'
  })
})

// Limiting the allowed size of request bodies
app.use(bodyParser.urlencoded({ limit: '100kb', extended: false })) // application/x-www-form-urlencoded
app.use(bodyParser.json({
  limit: '100kb',
  type: ['json', 'application/csp-report']
}))

app.post('/report-violation', function (req, res) {
  if (req.body) {
    console.log('CSP Violation: ', req.body)
  } else {
    console.log('CSP Violation: No data received!')
  }

  res.status(204).end()
})

app.use(csrf({ cookie: true })) // req.csrfToken()
// Handle CSRF
app.use(cookieParser())

const port = 3000

const server = app.listen(port, () => {
  console.log(`listening to port*: ${port}. press ctrl + c to cancel.`)
})

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.')
  console.log('closing http server...')
  server.close(() => {
    console.log('http server closed.')
    // Close db, etc
    process.exit(0)
  })
})
