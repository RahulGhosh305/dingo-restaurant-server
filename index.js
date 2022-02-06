//* IMPORTS 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//* DATABASE INSTANCES  
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://dingoRestaurantUser:T6iIjrGHlUNfFw3F@cluster0.ensig.mongodb.net/dingoRestaurant?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//* APPLICATION CREATE AND USES
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan("dev"))

//* DATABASE CONNECTION 
client.connect(err => {
    const allMenuCollections = client.db("dingoRestaurant").collection("allMenus");
    const allBlogsCollections = client.db("dingoRestaurant").collection("allBlogs");
    const restaurantReviewCollections = client.db("dingoRestaurant").collection("restaurantReview");
    const adminCollections = client.db("dingoRestaurant").collection("admin");
    console.log("DataBase connected");
    
    //* ALL HTTPS REQUEST 
    // HOME URL
    app.get('/', (req, res) => {
        res.send("Home....YAY!")
    })
    // DASHBOARD ADMIN : ADD NEW EMAIL
    app.post('/admin', (req, res) => {
        const data = req.body;
        console.log(data);
        adminCollections.insertOne(data)
        .then(result => {
            res.json("Successfully Added New Admin")
            console.log("Server : Successfully Added New Admin");
        })
        .catch(err => {
            console.log("Error Are :", err);
        })
    })
    // DASHBOARD ADMIN : FIND ALL EMAIL
    app.get('/admin', (req, res) => {
        adminCollections.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    // MENU : ADD FOOD ITEM
    app.post('/addMenu', (req, res) => {
        const data = req.body;
        console.log(data);
        allMenuCollections.insertOne(data)
        .then(result => {
            res.send("Success To add Menu")
        })
        .catch(err => {
            console.log(err);
        })
    })

    // DASHBOARD MENU : ALL MENUS
    app.get('/allFoods', (req, res) => {
        allMenuCollections.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    // DASHBOARD MENU DELETE : DELETE SINGLE MENU
    app.delete('/deleteSingleMenu/:id', (req, res) => {
        const id = req.params.id
        // console.log(id);
        allMenuCollections.deleteOne({_id: ObjectId(id)})
        .then((result) => {
            res.json("Deleted One Menu Item")
        })

    })

    // MENUS : ALL HOME FOOD
    app.get('/homeMenus', (req, res) => {
        allMenuCollections.find({"type" : "HomeMenu"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    // MENUS : ALL BREAKFAST FOOD 
    app.get('/breakfastFood', (req, res) => {
        allMenuCollections.find({"type" : "BreakFastFood"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    //  MENUS : ALL BREAKFAST DRINK 
    app.get('/breakfastDrink', (req, res) => {
        allMenuCollections.find({"type" : "BreakFastDrink"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
     //  MENUS : ALL LUNCH FOOD 
     app.get('/lunchFood', (req, res) => {
        allMenuCollections.find({"type" : "LunchFood"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
     //  MENUS : ALL LUNCH DRINK 
     app.get('/lunchDrink', (req, res) => {
        allMenuCollections.find({"type" : "LunchDrink"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
     //  MENUS : ALL DINNER FOOD 
     app.get('/dinnerFood', (req, res) => {
        allMenuCollections.find({"type" : "DinnerFood"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
     //  MENUS : ALL DINNER DRINK 
     app.get('/dinnerDrink', (req, res) => {
        allMenuCollections.find({"type" : "DinnerDrink"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    // MENUS : FIND SINGLE ITEM
    app.get('/singleMenu/:id', (req, res) => {
        const id = req.params.id
        // console.log("res",id);
        allMenuCollections.find({_id: ObjectId(id)})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })


    // BLOG : ADD NEW BLOG
     app.post('/addBlog', (req, res) => {
         const data = req.body;
         console.log(data);
         allBlogsCollections.insertOne(data)
        .then(result => {
            res.send("Success To Add Blog")
        })
        .catch(err => {
            console.log("Error Message", err);
        })
     })

    // BLOG : HOME PAGE 
    app.get('/homePageBlog', (req, res) => {
        allBlogsCollections.find({"category" : "homePage"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    // BLOG : BLOG PAGE
    app.get('/blogPageBlog', (req, res) => {
        allBlogsCollections.find({"category" : "blogPage"})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    // BLOG : FIND SINGLE ITEM
    app.get('/singleBlog/:id', (req, res) => {
        const id = req.params.id
        // console.log(id);
        allBlogsCollections.find({_id: ObjectId(id)})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })


    // REVIEW : ABOUT RESTAURANT
    app.post('/addRestaurantReview', (req, res) => {
        const data = req.body;
        console.log(data)
        restaurantReviewCollections.insertOne(data)
        .then(result => {
            res.json("Success To Add New Restaurant Review")
        })
        .catch((err) => {
            console.log("Error Message :", err);
        })
    }) 
    // REVIEW : ABOUT RESTAURANT
    app.get('/restaurantReview', (req, res) => {
        restaurantReviewCollections.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    // client.close();
});

//* PORT AND APP LISTENER 
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server Is Running Port ${PORT}`);
})

// PASS = T6iIjrGHlUNfFw3F