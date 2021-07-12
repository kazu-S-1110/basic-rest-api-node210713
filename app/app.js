const express = require("express")
const app = express()
const sqlite3 = require("sqlite3")
const dbPath = "app/db/database.sqlite3"

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

const port = process.env.PORT || 3000
app.listen(port)
console.log("Listen on port : " + port);