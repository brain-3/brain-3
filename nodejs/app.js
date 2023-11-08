const express = require('express')
const app = express()
const port = 3000
const { Sequelize, DataTypes} = require('sequelize');
app.set("view engine", "ejs");
app.set('views','./views');
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


const sequelize = new Sequelize('db1', 'root', 'root0000', {
    host: 'localhost',
    dialect: 'mysql'
  });

  const User = sequelize.define('users', {
    id: {
       type: DataTypes.INTEGER,
       autoIncrement: true, //고유값
       primaryKey: true
     },
     username: {
        type:DataTypes.STRING
     },
     email: {
       type: DataTypes.STRING
     },
     password: {
       type: DataTypes.STRING
     }
   })

  app.get('/new', (req, res) => {res.render('new')});
  app.post('/signup',async(req, res,) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const jane = await User.create({ username: req.body.username, email: req.body.email, password: req.body.password }); 
    res.send("회원 가입 완료");
  })

  app.get('/user', async(req,res) => {
    const users = await User.findAll();
    console.log(users)
    res.render('user', {users: users})
});


  app.listen(port, async () => {
    try {
      await sequelize.authenticate(); //체크 코드
      //await sequelize.sync({ force: true }); //express랑 db 공유
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
    console.log(`서버가 실행됩니다. http://localhost:${port}`);
  })
