const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose')
const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use('/graphql',graphqlHttp({
    schema:buildSchema(`

        type Event{
            _id:ID!
            title:String!
            description:String!
            price:Float!
            date:String!
        }

        input EventInput{
            title:String!
            description:String!
            price:Float!
            date:String
        }
        
        type RootQuery{
            events:[Event!]
        }
        type RouteMutation{
            createEvent(eventInput:EventInput):Event
        }
        schema{
            query:RootQuery
            mutation:RouteMutation
        }
    `),
    rootValue:{
        events:()=>{
            return Event.find({})
                .then(ev=>{
                    console.log(ev);
                    // return ev.map(e=>{
                    //     return { ...e._doc};
                    //  //return events;
                    // });
                    return ev;
             }).catch(err=>{
                console.log(err);
             });
            
        },
        createEvent:(args)=>{          
            console.log(args);
            const event = new Event({              
                title: args.eventInput.title,
                description : args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            });
            return event.save().then(result=>{
                console.log(result);
                return result;
            }).catch(err=>{
                console.log(err);
                throw err;
            });
            
        }
    },
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

var dbCon = mongoose.connection;
dbCon.once('open',()=>{

});




