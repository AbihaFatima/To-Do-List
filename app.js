const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-abiha:<password>@cluster0.osxal.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}).then(connection => { console.log('Connected successfully to MongoDB.');});

const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your Todo list!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item"
});
const item3 = new Item({
    name: "<--- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];


app.get("/",function(req, res){
    const day = date.getDate();
    Item.find({}, function(err, foundItems){
        if( foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully inserted to db")
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list", {listTitle: day, newListItems: foundItems});
        }
    });
});



app.post("/", function(req,res){
    const itemName = req.body.newItem;
    const item = new Item({
        name : itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    console.log(checkedItemId);
    Item.deleteOne({_id: checkedItemId}, function(err){
        if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/");
        }
    });
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("Server has started on successfully.");
});

