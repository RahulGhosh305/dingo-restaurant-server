//* IMPORTS 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config()

//* FIREBASE INITIALZE APP
const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    })
});


//* DATABASE INSTANCES  
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.ensig.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//* APPLICATION CREATE AND USES MIDDLEWARE
const app = express();
app.use(cors(
    {
        origin: ["https://dingo-restaurant-rg.web.app"],
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
        credentials: true
    }
))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan("dev"))

//* JWT VERIFIED FUNCTION
async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1]
        try {
            const deCodedUser = await admin.auth().verifyIdToken(idToken)
            req.deCodedUserEmail = deCodedUser.email
        }
        catch {

        }
    }
    next()
}

//* DATABASE CONNECTION 
client.connect(err => {
    const allMenuCollections = client.db("dingoRestaurant").collection("allMenus");
    const allBlogsCollections = client.db("dingoRestaurant").collection("allBlogs");
    const restaurantReviewCollections = client.db("dingoRestaurant").collection("restaurantReview");
    const adminCollections = client.db("dingoRestaurant").collection("admin");
    const contactUsMessageCollections = client.db("dingoRestaurant").collection("contactUsMessage");
    const careerMessageCollections = client.db("dingoRestaurant").collection("careerMessage");
    const newsLetterCollections = client.db("dingoRestaurant").collection("newsLetter");
    const reservationCollections = client.db("dingoRestaurant").collection("reservation");
    const foodOrdersCollections = client.db("dingoRestaurant").collection("foodOrders");
    console.log("DataBase connected");

    //* ALL HTTPS REQUEST /////////////////////////////////////////////


    // DASHBOARD PAGE -: ADD NEW ADMIN EMAIL
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
    // DASHBOARD PAGE -: GET ALL ADMIN EMAILS
    app.get('/allAdmin', (req, res) => {
        adminCollections.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    // DASHBOARD PAGE -: GET ALL MENU ITEMS
    app.get('/allFoods', (req, res) => {
        allMenuCollections.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // DASHBOARD PAGE -: DELETE SINGLE MENU
    app.delete('/deleteSingleMenu/:id', (req, res) => {
        const id = req.params.id
        // console.log(id);
        allMenuCollections.deleteOne({ _id: ObjectId(id) })
            .then((result) => {
                res.json("Deleted One Menu Item")
            })

    })
    // DASHBOARD PAGE -: ADD FOOD ITEM MENU
    app.post('/addMenu', (req, res) => {
        const data = req.body;
        console.log(data);
        allMenuCollections.insertOne(data)
            .then(result => {
                res.json("Success To add New Menu")
            })
            .catch(err => {
                console.log(err);
            })
    })
    // DASHBOARD PAGE -: ADD NEW BLOG POST
    app.post('/addBlog', (req, res) => {
        const data = req.body;
        console.log(data);
        allBlogsCollections.insertOne(data)
            .then(result => {
                res.json("Success To Add Blog")
            })
            .catch(err => {
                console.log("Error Message", err);
            })
    })
    // DASHBOARD PAGE -: GET ALL CONTACT US MESSAGE
    app.get('/allContactUsMessage', (req, res) => {
        contactUsMessageCollections.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // DASHBOARD PAGE -: GET ALL TABLE RESERVATION
    app.get('/allReservation', (req, res) => {
        reservationCollections.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // DASHBOARD PAGE -: VIEW SINGLE CONTACT US MESSAGE
    app.get('/singleContactUsMessage/:id', (req, res) => {
        const id = req.params.id
        contactUsMessageCollections.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    // DASHBOARD PAGE -: GET ALL CAREER MESSAGE
    app.get('/allCareerMessage', (req, res) => {
        careerMessageCollections.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // DASHBOARD PAGE -: VIEW SINGLE CAREER MESSAGE
    app.get('/singleCareerMessage/:id', (req, res) => {
        const id = req.params.id
        careerMessageCollections.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    // DASHBOARD PAGE -: GET ALL NEWS LETTER
    app.get('/allNewsLetter', (req, res) => {
        newsLetterCollections.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // DASHBOARD PAGE -: GET ALL ORDERS
    app.get('/allFoodOrders', (req, res) => {
        foodOrdersCollections.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // DASHBOARD PAGE -: GET SINGLE VIEW ORDER
    app.get('/singleFoodOrderView/:id', (req, res) => {
        const id = req.params.id
        foodOrdersCollections.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // DASHBOARD PAGE -: GET INDIVIDUAL CUSTOMER ORDER
    app.get('/customerOrderMenu', verifyToken, (req, res) => {
        const searchEmail = req.query.email
        // console.log(req.deCodedUserEmail)
        // console.log(searchEmail)
        if (req.deCodedUserEmail === searchEmail) {
            foodOrdersCollections.find({ logInEmail: searchEmail })
                .toArray((err, documents) => {
                    res.send(documents)
                })
        }
        else {
            res.status(401).json({ message: "User not authorized" })
        }
    })
    // DASHBOARD PAGE -: UPDATE SINGLE MENU 
    app.get('/updateMenu/:id', (req, res) => {
        const id = req.params.id
        console.log("res", id);
        allMenuCollections.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    // DASHBOARD PAGE -: MODIFY/PATCH MENU AND RESEND TO SERVER
    app.patch('/toModifyServerData/:id', (req, res) => {
        const id = req.params.id;
        const data = req.body;
        console.log(data);
        allMenuCollections.updateOne({ _id: ObjectId(id) }, {
            $set: {
                title: req.body.title,
                foodCategory: req.body.foodCategory,
                shortDescription: req.body.shortDescription,
                type: req.body.type,
                price: req.body.price,
                tags: req.body.tags,
                rating: req.body.rating,
                readyTime: req.body.readyTime,
                prepTime: req.body.prepTime,
                cookTime: req.body.cookTime,
                serving: req.body.serving,
                name: req.body.name,
                ingredient: req.body.ingredient,
                foodInstructions: req.body.foodInstructions,
            }
        })
            .then(result => {
                res.json("Now update menu successfully")
            })
    })


    // HOME PAGE -: ADD NEWS LETTER
    app.post('/addNewsletter', (req, res) => {
        const data = req.body;
        newsLetterCollections.insertOne(data)
            .then(result => {
                res.json("Wow! Now you get to regular update news")
            })
    })


    // HOME PAGE -: GET ALL HOME FOODS MENUS
    app.get('/HomeMenu', (req, res) => {
        allMenuCollections.find({ "type": "HomeMenu" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    // MENU PAGE -: GET ALL BREAKFAST FOOD MENUS
    app.get('/BreakFastFood', (req, res) => {
        allMenuCollections.find({ "type": "BreakFastFood" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // MENU PAGE -: GET ALL BREAKFAST DRINK MENUS
    app.get('/BreakFastDrink', (req, res) => {
        allMenuCollections.find({ "type": "BreakFastDrink" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // MENU PAGE -: GET ALL LUNCH FOOD MENUS
    app.get('/LunchFood', (req, res) => {
        allMenuCollections.find({ "type": "LunchFood" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // MENU PAGE -: GET ALL LUNCH DRINK MENUS 
    app.get('/LunchDrink', (req, res) => {
        allMenuCollections.find({ "type": "LunchDrink" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // MENU PAGE -: GET ALL DINNER FOOD MENUS
    app.get('/DinnerFood', (req, res) => {
        allMenuCollections.find({ "type": "DinnerFood" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // MENU PAGE -: GET ALL DINNER DRINK MENUS
    app.get('/DinnerDrink', (req, res) => {
        allMenuCollections.find({ "type": "DinnerDrink" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    // SINGLE-MENU PAGE -: GET SINGLE MENU ITEM
    app.get('/singleMenu/:id', (req, res) => {
        const id = req.params.id
        // console.log("res",id);
        allMenuCollections.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })


    // HOME PAGE -: GET ALL BLOGS
    app.get('/homePageBlog', (req, res) => {
        allBlogsCollections.find({ "category": "homePage" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // BLOG PAGE -: GET ALL BLOGS
    app.get('/blogPageBlog', (req, res) => {
        allBlogsCollections.find({ "category": "blogPage" })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // SINGLE-BLOG PAGE -: GET SINGLE BLOG ITEM
    app.get('/singleBlog/:id', (req, res) => {
        const id = req.params.id
        // console.log(id);
        allBlogsCollections.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    // ABOUT PAGE -: ADD NEW ABOUT RESTAURANT REVIEW
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
    // ABOUT PAGE -: GET ALL ABOUT RESTAURANT REVIEWS
    app.get('/restaurantReview', (req, res) => {
        restaurantReviewCollections.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    // CONTACT PAGE -: ADD NEW CONTACT-US MESSAGE
    app.post('/contactUsMessage', (req, res) => {
        const messageData = req.body
        contactUsMessageCollections.insertOne(messageData)
            .then(result => {
                res.json("Successfully Sent Your Message")
            })
            .catch(err => {
                console.log(err)
            })
    })


    // CAREER PAGE -: ADD NEW CAREER MESSAGE
    app.post('/addCareerMessage', (req, res) => {
        const data = req.body;
        careerMessageCollections.insertOne(data)
            .then(result => {
                res.json("Successfully submit career message")
            })
            .catch(err => {
                console.log(err);
            })
    })


    // RESERVATION PAGE -: ADD NEW RESERVATION
    app.post('/addReservation', (req, res) => {
        const data = req.body;
        reservationCollections.insertOne(data)
            .then(result => {
                res.json('Congratulation! You Booked a Table Successfully')
            })
    })

    // CART TO CONFIRM PAGE : ADD FOOD ORDER
    app.post('/makeFoodOrder', (req, res) => {
        const data = req.body;
        foodOrdersCollections.insertOne(data)
            .then(result => {
                res.json("Order Save Successfully")
                console.log("Order Save Successfully")
            })
    })

    // HOME/MAIN URL
    app.get('/', (req, res) => {
        res.send("Home....YAY!")
    })


    // client.close();
});

//* PORT AND APP LISTENER 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Is Running Port ${PORT}`);
})

