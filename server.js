const express = require('express');
const multer = require('multer');
var data = require('./store');
const app = express();
const upload = multer();
app.use(express.static('./templates'));
app.set('view engine', 'ejs');
app.set('views', './templates');


const { response } = require('express');
const AWS = require('aws-sdk');


const config = new AWS.Config({
    accessKeyId: 'AKIASB7UN5FDSB6LS6I5',
    secretAccessKey: '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',
    region: 'us-east-1'
})

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'SanPham';


app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            res.send('Internal Server Error');
        }
        else {
            return res.render('node', { SanPhams: data.Items });
        }
    });
})

app.post('/', upload.fields([]), (req, res) => {
    const { ma_sp, ten_sp, so_luong, loai } = req.body;

    const params = {
        TableName: tableName,
        Item: {
            "ma_sp": ma_sp,
            "ten_sp": ten_sp,
            "so_luong": so_luong,
            "loai":loai,
        }
    }

    docClient.put(params, (err, data) => {
        if (err)
            return res.send('Internal Server Error');
        else
            return res.redirect("/");
    });

    return res.redirect("/");
});
app.get('/delete', (req, res) => {
    const id = req.query.id;
    console.log(id);
    data = data.filter(text => {
        console.log(text);
        return text.ma_sp !== id;
    });
    return res.render('node', { data: data });
});

app.listen(3000, () => {
    console.log("Server start");
})
