
const Event = require('../models/event');
const User = require('../models/user');
const Booking = require('../models/booking');
const bcrypt = require('bcryptjs');



const events = async eventIds => {
    try {
      const events = await Event.find({ _id: { $in: eventIds } });
      events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        };
      });
      return events;
    } catch (err) {
      throw err;
    }
  };

const singleEvent = async eventId =>{
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id:event.id,
            creator:user.bind(this,event.creator)
        }
    } catch (err) {
        throw err;
    }
};
const user = async userId => {
    try {
      const user = await User.findById(userId);
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    } catch (err) {
      throw err;
    }
  };

var rootValue ={
    events: async ()=>{
        try {
            const events = await Event.find({}).populate('creator');
            return events;
        } catch (error) {
            throw error;
        }        
    },
  
    bookings : async () =>{
        try {
            const bookings = await Booking.find();

            return bookings.map(booking=>{
                return {
                    ...bookings._doc,
                    _id:booking.id,
                    user:user.bind(this,booking._doc.user),
                    event:singleEvent.bind(this,booking._doc.event),
                    createdAt:new Date(booking._doc.createdAt).toISOString(),
                    updatedAt:new Date(booking._doc.updatedAt).toISOString()
                }
            });
            
        } catch (err) {
            throw err;
        }
    },
    users:()=>{
        return User.find({}).populate('createdEvents')//entity framework teki Include işlemine benziyor
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
    getuser : async userId=>{        
        try {
            const user = await User.findById(userId);          
            return user;
        } catch (error) {
            throw error;
            
        }
    },

    

    createEvent: async args => {          
        console.log(args);
        const event = new Event({              
            title: args.eventInput.title,
            description : args.eventInput.description,
            price: +args.eventInput.price,
            date: args.eventInput.date,
            creator : "5d78fd5b1fbc6a139c878616"
        });
        let createdEvent;
        try {          
            const result = await event
            .save()       
            createdEvent =  result;                
            const creator = await User.findById('5d78fd5b1fbc6a139c878616');                  
            if(!creator){
                throw new Error('User not found')
            }
            creator.createdEvents.push(event);
            await user.save();             
            return createdEvent;
        } 
        catch (err) {
            throw err;           
        }
                        
    },
    createUser: async args=>{
        try {          
            const existingUser = await User.findOne({email:args.userInput.email})
            if(existingUser){
                throw new Error('User exists already')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password,12)              
            const user = new User({
                email:args.userInput.email,
                password: hashedPassword    
            });
            const result = await user.save();
            
            return result;
        } 
            catch (err) {
                throw err;
            }                         
    },
    bookEvent: async args=>{
        const fetchedEvent = await Event.findOne({_id:args.eventId});
        const booking = new Booking({
            user:"5d78fd5b1fbc6a139c878616",
            event :fetchedEvent
        });
        const result = await booking.save();
        return result;
    }
   

    
}

module.exports = rootValue;