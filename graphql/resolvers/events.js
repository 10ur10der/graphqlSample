const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');
const {user} = require('../resolvers/auth');
const {transformEvent} = require('./merge');



var rootValue ={
    events: async ()=>{
        try {
            const events = await Event.find().populate('creator');
            return events.map(event=>{
                return transformEvent(event);
            });
        } catch (error) {
            throw error;
        }        
    },   
    createEvent: async (args,req) => {          
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        const event = new Event({              
            title: args.eventInput.title,
            description : args.eventInput.description,
            price: +args.eventInput.price,
            date: args.eventInput.date,
            creator : "5d78fd5b1fbc6a139c878616"
        });
        let createdEvent;
        try {          
            const result = await event.save()       
            createdEvent =  transformEvent(result); 
            const creator = await User.findById(req.userId);                  
            if(!creator){
                throw new Error('User not found')
            }
            creator.createdEvents.push(event);
            await creator.save();             
            return createdEvent;
        } 
        catch (err) {
            console.log(err);
            throw err;           
        }
                        
    },
            
}

module.exports = rootValue;