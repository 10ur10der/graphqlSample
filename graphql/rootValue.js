
const Event = require('../models/event');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


var rootValue ={
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
}

module.exports = rootValue;