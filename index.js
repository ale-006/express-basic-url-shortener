import express from "express"
import db from "quick.db"
import bodyParser from "body-parser"
const app = express()

/* CUSTOM APP CONFIG */
app.set("view engine", "ejs")
app.use("/static", express.static("public/static"))
app.set("views", "public/pages")
app.use(bodyParser.urlencoded({extended: false}))

/* LOCAL HOST YOUR APP */
app.listen(8080, () => console.log("Ready!"))


/* MANAGE DEFAULT PAGES REQUESTS */
app.get("/", (req, res) => {
    res.render("index")
})

/* HANDLE NON-DEFAULT PAGES REQUESTS */
app.get("*", (req, res) => {
    let path = req.path
    let linkCode = path.replace("/", "")

    let linkDestination = db.get(linkCode)
    if(linkDestination) {
        res.redirect(linkDestination)
    } else {
        res.send("<h1>404 - URL NOT FOUND</h1>")
    }
})


/* HANDLE POST APP FUNCTIONS */
app.post("/shorturl", (req, res) => {
    let longUrl = req.body.longUrl
    let shortUrl = ""
    let chars = "abcdefghijklmnopqrstuvwxyz1234567890"
    for(let i = 0;i<5;i++) { shortUrl += chars.charAt(Math.floor(Math.random() * chars.length)) } //generate a random short url code

    db.set(shortUrl, longUrl)

    res.send(`
        <h1>Success!</h1>
        <p>URL: <a href="http://localhost:8080/${shortUrl}">http://localhost:8080/${shortUrl}</a></p>
    `)
})