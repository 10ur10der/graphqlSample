const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graphql/schema/schema');
const resolvers = require('./graphql/resolvers/resolvers');
const isAuth = require('./middleware/is-auth');


const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql',graphqlHttp({
    schema:schema,
    rootValue:resolvers,
    graphiql :true

}));



const password = process.env.MONGO_PASSWORD;
const user = process.env.MONGO_USER;
const db = process.env.MONGO_DB;
mongoose.connect('mongodb+srv://'+user+':'+password+'@cluster0-lchs0.mongodb.net/'+db+'?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    app.listen(3000);
}).catch(err=>{
    console.log(err);
});





