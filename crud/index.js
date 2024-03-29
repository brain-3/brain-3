import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose';

const __dirname = path.resolve();

const app = express();

//file path
//my_app/data/wriiting.json
const filePath = path.join(__dirname, 'data', 'writing.json');

// body parser set
app.use(bodyParser.urlencoded({ extended: false })); // express 기본 모듈 사용
app.use(bodyParser.json());

// view engine set
app.set('view engine', 'html'); // main.html -> main(.html)

// nunjucks
nunjucks.configure('views', {
    watch: true, // html 파일이 수정될 경우, 다시 반영 후 렌더링
    express: app
})

//mongoose connect
mongoose
    .connect('mongodb://127.0.0.1:27017')
    .then(()=> console.log('DB연결성공'))
    .catch(e=>console.error(e));

//mongoose set
const { Schema } = mongoose;

const WritingSchema = new Schema({
    title: String,
    contents: String,
    date: {
        type: Date,
        default: Date.now,
    }
})

const Writing = mongoose.model('Writing,', WritingSchema);


// middleware
// main page GET
app.get('/', async (req, res) => {
    //const fileData = fs.readFileSync(filePath);
   //const writings = JSON.parse(fileData);

    let writings = await Writing.find({})

    res.render('main', {list: writings});
});

app.get('/write', async (req, res) => {
    res.render('write');
});
app.post('/write', async (req, res) => {
    // request 안에 있는 내용을 처리
    // request.body
    const title = req.body.title;
    const contents = req.body.contents;

    //mongodb에 저장
    const writing = new Writing({
        title: title,
        contents: contents
    })
    const result = await writing.save().then(() => {
        console.log('Success')
        res.render('detail',{ 'detail': {title: title, contents: contents }});
    }).catch((err)=> {
        console.error(err)
        res.render('write')
    }) 



});

app.get('/detail/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const detail = await Writing.findOne({ _id: id });
        console.log('update success');
        res.render('detail', { 'detail': detail });
    } catch (err) {
        console.error(err);
    }
});

app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;

    const edit = await Writing.findOne({ _id: id }).then((result) => {
        res.render('detail', { 'edit': result })
    }).catch((err) => {
        console.error(err)
    })
})

app.post('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const contents = req.body.contents;

    const edit = await Writing.replaceOne({ _id: id }, { title: title, contents: contents }).then((result) => {
        console.log('update success')
        res.render('detail', { 'detail': { 'id': id, 'title': title, 'contents': contents } });
    }).catch((err) => {
        console.error(err)
    })
})

app.post('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedContent = await Writing.findOneAndDelete({ _id: id });

        if (deletedContent) {
            console.log('Delete success');
        } else {
            console.log('Content not found');
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting content');
    }
});

app.listen(3000, () => {
    console.log('Server is running');
});
