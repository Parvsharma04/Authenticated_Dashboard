const bodyParser = require('body-parser')
const express = require('express')
const {MongoClient} = require('mongodb')
const session = require('express-session');

const app = express()
const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



const url = 'mongodb+srv://parv:12341234@task-manager.kwcw1do.mongodb.net/'
const client = new MongoClient(url)
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    }
}))


app.get('/', async (req, res)=>{
    if(!req.session.visited){
        req.session.visited = true
        res.sendfile('home.html', {root: './public'})
    }
})


app.get('/register', (req, res)=>{
    res.sendFile('/signup.html',{root:'./public'})
})


app.post('/register', async(req, res)=>{
    await client.connect()
    const db = client.db('DB_CLASS')
    const collection = db.collection('one')
    const response = await collection.insertOne(req.body);
    req.session.username = req.body.username
    res.redirect('/dashboard')
})

app.get('/dashboard', (req, res)=>{
    res.render('dashboard.ejs', {user: req.session.username,  id : req.session.id})
})

app.get('/login', (req, res)=>{
    res.sendFile('/login.html', {root: './public'})
})

app.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        console.log(err)
    })
    res.send('Logged out Successfully')
})

app.post('/login', async(req, res)=>{
    await client.connect()
        const db = client.db('DB_CLASS')
        const collection = db.collection('one')
    if(collection.find( {$and : [{username: req.body.username}, {password: req.body.password}]})){
        req.session.username = req.body.username;
        res.redirect('/dashboard')
    }
    else{
        res.send('user not found')
    }
})