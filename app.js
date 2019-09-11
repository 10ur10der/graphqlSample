const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose')
const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

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
            creator:User!
        }

        type User{
            _id:ID!
            email:String!
            password:String
            createdEvents :[Event!]
        }

        input EventInput{
            title:String!
            description:String!
            price:Float!
            date:String
        }

        input UserInput{
            email:String!
            password:String
        }
        
        type RootQuery{
            events:[Event!]!
        }
        type RouteMutation{
            createEvent(eventInput:EventInput):Event
            createUser(userInput:UserInput):User
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
                date: args.eventInput.date,
                creator : "5d78fd5b1fbc6a139c878616"
            });

            let createdEvent;
            return event
            .save()
            .then(result=>{
                createdEvent =  result;                
               return User.findById('5d78fd5b1fbc6a139c878616')
              
            })
            .then(user=>{
                if(!user){
                    throw new Error('User not found')
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result=>{
                return createdEvent;
            })
            .catch(err=>{
                console.log(err);
                throw err;
            });           
        },
        createUser:args=>{

           return User.findOne({email:args.userInput.email}).then(user=>{
                if(user){
                    throw new Error('User exists already')
                }
                return bcrypt
                .hash(args.userInput.password,12)
            })
            .then(hashedPassword=>{
                const user = new User({
                email:args.userInput.email,
                password: hashedPassword
            });
            return user.save();
            })
            .then(result=>{
                console.log(result);
                return result;
            })           
            .catch(err=>{
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





