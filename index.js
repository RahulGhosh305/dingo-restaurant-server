const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Thank you call me....YAY!")
})

const PORT = 5000;
app.listen(PORT, ()=> {
    console.log(`Server Is Running Port ${PORT}`);
})