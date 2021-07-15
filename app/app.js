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
    if (!row) {
      res.status(404).send({error:"Not Found!inaiyo~"})
    } else {
      res.status(200).json(row)
      
    }
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


const run = async (sql,db) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        return reject(err)
      } else {
        return resolve()
      }
    })
  })
}


// Create a new user
app.post("/api/v1/users", async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({error:"ユーザ名を入れんかい、ボケ〜( ✌︎'ω')✌︎"})
  } else {
    
    const db = new sqlite3.Database(dbPath)
  
    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : ""
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""
    
    try {
      await run(`INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`, db)
      res.status(201).send({message:"ユーザを作れたぜ、ヒャッホ〜！"})
      
    } catch (err) {
      res.status(500).send({error:err})
    }
    db.close()
  }
})

// update user date
app.put("/api/v1/users/:id", async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({ error: "ユーザ名を入れんかい、ボケ〜( ✌︎'ω')✌︎" })
  } else {
    
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    //現在のユーザ情報を取得する
    db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
      if (!row) {
        res.status(404).send({ error: "ユーザが見つからんわ、ボォケ" })
      } else {
      
        const name = req.body.name ? req.body.name : row.name
        const profile = req.body.profile ? req.body.profile : row.profile
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth
    
        try {
          await run(
            `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`, db
          )
          res.status(200).send({ message: "変更ができたんだぜ〜？" })
        
        } catch (err) {
          res.status(500).send({ error: e })
        }
      }
      })
      db.close()
    }
})

// delete user date
app.delete("/api/v1/users/:id", async (req, res) => {
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
    if (!row) {
      res.status(404).send({ error: "ユーザが見つからんわ、ボォケ" })
    } else {
      try {
        await run(`DELETE FROM users WHERE id=${id}`, db)
        res.status(200).send({ message: "ユーザを消しちった！" })
      } catch (err) {
        res.status(500).send({ error: err })
      }
    }
    db.close()
  })
})


const port = process.env.PORT || 3000
app.listen(port)
console.log("Listen on port : " + port)