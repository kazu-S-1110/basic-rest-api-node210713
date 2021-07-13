const express = require("express")
const app = express()
const sqlite3 = require("sqlite3")
const path = require('path');
const dbPath = "app/db/database.sqlite3"
const bodyParser = require('body-parser');

//リクエストのbodyをパースするよう定義
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//publicディレクトリを静的ファイルのルートディレクトリとして定義。
app.use(express.static(path.join(__dirname, "public")))
// app.get("/api/v1/hello", (req, res) => {
//   res.json({"message": "Hello, World!"})
// })

//Get all users
app.get("/api/v1/users", (req, res) => {
  const db = new sqlite3.Database(dbPath) //DBへ接続。
  db.all("SELECT * FROM users", (err, rows) => { //クエリ結果受け取る。エラーならerr,正常なら全てがrowsに入る。
    res.json(rows)
  })
  db.close() 
})

//Get a user
app.get("/api/v1/users/:id", (req, res) => {  //:idとすることでexpressでは動的に扱える。
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id //こうすることで投げたクエリの文のidを取得できる。

  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    res.json(row)
  })
  db.close() 
})

//Search users matching keyword
app.get("/api/v1/search", (req, res) => {  //:idとすることでexpressでは動的に扱える。
  const db = new sqlite3.Database(dbPath)
  const keyword = req.query.q
  
  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows)
  })
  db.close() 
})

// Create a new user
app.post("/api/v1/users", async (req, res) => {
  const db = new sqlite3.Database(dbPath)

  const name = req.body.name
  const profile = req.body.profile ? req.body.profile : ""
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

  const run = async (sql) => {
    return new Promise((resolve, reject) => {
      db.run(sql, (err) => {
        if (err) {
          res.status(500).send(err)
          return reject()
        } else {
          res.json({ "message": "Success create user!" })
          return resolve()
        }
      })
    })
  }
  await run(`INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`)
  db.close()
})




const port = process.env.PORT || 3000
app.listen(port)
console.log("Listen on port : " + port);