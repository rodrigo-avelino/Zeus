const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }))
app.use(cors())

require('./app/controlers/authController')(app);
require('./app/controlers/projectController')(app);

app.listen(3000,()=>{
    console.log(`server listenting on ${3000}`)
})