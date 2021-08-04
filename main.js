const express = require('express');
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/27017';
MongoClient.connect(url, function(err, db) {
    app.locals.db = db.db("coffeshop");
    app.listen(port, () => console.log(`Example app listening on port port!`));
});
const hbs = require("hbs");
const { ObjectID } = require('mongodb');
const app = express();
const port = 80;
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.text({defaultCharset:"utf-8"}))
app.use(multer({dest:__dirname+"/productImages"}).single("file"))
app.set("view engine","hbs");
hbs.registerPartials(__dirname+"/views/partials");
app.use(express.static(__dirname+"/public"))
app.get('/', (req, res) => {
    var db = app.locals.db;
    db.collection("goods").find().toArray((err,result)=>{
        res.render("index.hbs",{
            good:result,
            title:"Главная"
        });
    })
    
})
app.get('/loved', (req, res) => {
  res.render("loved.hbs",{
      title:"Избранное"
  });
})
app.get('/about', (req, res) => {
    res.render("about.hbs",{
        text:fs.readFileSync(__dirname+"/siteInfo/about.txt","utf-8"),
        title:"О нас"
    });
})
app.get('/about/edit', (req, res) => {
    res.render("about-edit.hbs",{
        text:fs.readFileSync(__dirname+"/siteInfo/about.txt","utf-8"),
        title:"О нас - редактирование"
    });
})
app.post("/editAbout",urlencodedParser,(req,res)=>{
    fs.writeFileSync(__dirname+"/siteInfo/about.txt",req.body.text);
    res.send("OK");
})
app.post("/editContacts",urlencodedParser,(req,res)=>{
    
    fs.writeFileSync(__dirname+"/siteInfo/contacts.txt",req.body.text);
    res.send("OK");
})
app.get('/contacts', (req, res) => {
    res.render("contacts.hbs",{
        text:fs.readFileSync(__dirname+"/siteInfo/contacts.txt","utf-8"),
        title:"Контакты"
    });
})
app.get('/contacts/edit', (req, res) => {
    res.render("contacts-edit.hbs",{
        text:fs.readFileSync(__dirname+"/siteInfo/contacts.txt","utf-8"),
        title:"Контакты - редактирование"
    });
})
app.get('/admin', (req, res) => {
    res.render("admin.hbs",{
        title:"Вход в админ-панель"
    });
})
app.post("/checkAdmin",urlencodedParser,(req,res)=>{
    var admin = JSON.parse(fs.readFileSync(__dirname+"/siteInfo/admin.json"));
    var query = JSON.parse(req.body.query);
    if(admin.login == query.login && admin.password == query.password && admin.email == query.email) {
        res.send("OK")
    }
    else {
        res.send("NO")
    }
    
})
app.get('/new', (req, res) => {
    res.render("new.hbs",{
        title:"Новый продукт"
    });
})
app.post('/new',urlencodedParser,(req,res)=>{
    var product = JSON.parse(req.body.product);
    var db = app.locals.db;
    db.collection("goods").insertOne(product,(err,result)=>{res.send("OK")})
})
app.get('/getImg/:imgName',(req,res)=>{
    var filename = req.params["imgName"];
    var db = app.locals.db;
    db.collection("files").findOne({originalname:filename},(err,result)=>{
        res.sendFile(__dirname+"/productImages/"+result.filename)
    })
})
app.post('/imgUpload',(req,res,next)=>{
    var db = app.locals.db;
    db.collection("files").insertOne(req.file,(err,result)=>{
        res.send("<script>document.location='/new'</script>");
    })
    
})
app.get('/orders', (req, res) => {
    var db = app.locals.db;
    db.collection("orders").find().toArray((err,result)=>{
        res.render("orders.hbs",{
            title:"Заказы",
            orders:result.reverse()
        });
    })
    
})
app.post('/filter',urlencodedParser,(req,res)=>{
    var db = app.locals.db;
    db.collection("goods").find(req.body).toArray((err,result)=>{
        res.send(result);
    })
})
app.get('/getGood/:id',(req,res)=>{
    var db = app.locals.db;
    db.collection("goods").findOne({_id:ObjectId(req.params['id'])},(err,result)=>{
        res.send(result);
    })
})
app.get("/getMaxPrice",(req,res)=>{
    var db = app.locals.db;
    var high = 0;
    db.collection("goods").find().toArray((err,result)=>{
        for (let i = 0; i < result.length; i++) {
            if (result[i].price > high) {
                high = result[i].price
            }
        }
        res.send(high.toString())
    })
})
app.post("/addOrder",urlencodedParser,(req,res)=>{
    var db = app.locals.db;
    db.collection("orders").insertOne(JSON.parse(req.body.data),(err,result)=>{
        res.send("OK");
    })
})
app.get("/getOrder/:id",(req,res)=>{
    var db = app.locals.db;
    db.collection("orders").findOne({_id:ObjectID(req.params["id"])},(err,result)=>{
        res.send(result);
    })
})
app.post("/deleteGood/:id",(req,res)=>{
    var db = app.locals.db;
    db.collection("goods").deleteOne({_id:ObjectID(req.params['id'])},(err,result)=>{
        res.send("OK");
    })
})
app.post("/deleteOrder/:id",(req,res)=>{
    var db = app.locals.db;
    db.collection("orders").deleteOne({_id:ObjectID(req.params['id'])},(err,result)=>{
        res.send("OK");
    })
})