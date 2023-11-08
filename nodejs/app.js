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
     },
   })
   const Evaluation = sequelize.define('evaluation', {
    id: {
       type: DataTypes.INTEGER,
       autoIncrement: true, //고유값
       primaryKey: true
     },
     reliability: {
        type: DataTypes.INTEGER
     },
     solving: {
       type: DataTypes.INTEGER
     },
     communication: {
       type: DataTypes.INTEGER
     },
     attitude: {
        type: DataTypes.INTEGER
     },
     user_id: {
      type: DataTypes.INTEGER
     }
   })

   app.get('/home', async(req,res) => {
    const users = await User.findAll();
    const usersAndEvalutaions = [];
    // 평가 정보 조회
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const evaluation = await Evaluation.findOne({
        where: {
          user_id: user.id
        }
      })
      console.log(evaluation);
      let score = 0;
      if (evaluation) {
        if (evaluation.dataValues.reliability) {
          score += evaluation.dataValues.reliability;
        }
        if (evaluation.dataValues.solving) {
          score += evaluation.dataValues.solving;
        }
      }
      usersAndEvalutaions.push({
        user: user.dataValues,
        score: score
      })      
    }
    // 점수가 높은 순으로 정렬
    let sorted = usersAndEvalutaions.sort((a,b) => {
      if(a.score > b.score) return -1;
      if(a.score < b.score) return 1;
      return 0;
    });
    console.log(sorted);

    // 평가 정보를 조회해와서, 평가 정보를 기준으로 정렬을 한다. 
    // 각 평가 항목 당 1점 -> 점수 많은 순으로 정렬
    
    // 
    res.render('home', {users: sorted})
  });
  
   app.get('/login', (req,res) => {res.render('login')});
   app.post('/login', async(req,res,) => {
    
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;

    const user = await User.findOne({
      where: {
        email: inputEmail
      }
    });
    if (user === null) {
      res.send('가입되지 않은 계정입니다.');
      return;
    }
    
    if (user.password !== inputPassword) {
      res.send('비밀번호가 틀립니다.')
      return;
    }
    res.send("로그인 성공");
   })

  app.get('/new', (req, res) => {res.render('new')});
  app.post('/new',async(req, res,) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const jane = await User.create
    ({ username: req.body.username, email: req.body.email, password: req.body.password }); 
    res.send("회원 가입 완료");
  })

  app.get('/user', async(req,res) => {
    const users = await User.findAll();
    const evaluations = await Evaluation.findAll();
    console.log()
    console.log(evaluations)
    res.render('user', { users: users, evaluations: evaluations })
});

app.get('/eva', async(req,res) => {
  const users = await User.findAll();
  console.log(users)
  res.render('eva', {users: users})
});

app.post('/eva',async(req, res,) => {
  console.log(req.body)
  const reliability = req.body.reliability;
  const solving = req.body.solving;
  const communication = req.body.communication;
  const attitude = req.body.attitude;
  const score = await User.create
  ({reliability: req.body.reliability, solving: req.body.solving, communication: req.body.communication,attitude: req.body.attitude});

  res.send("제출 완료");
})

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
