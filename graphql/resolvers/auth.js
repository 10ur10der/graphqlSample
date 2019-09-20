const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



module.exports ={
      
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
            createdEvent =  transformEvent(result); 

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
    login: async ({email,password})=>{
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error('User does not exist!');          
        }
        const isEqual = await bcrypt.compare(password,user.password);
        if(!isEqual){
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({userId:user.id,email:user.email},'somesupersecretkey',{
            expiresIn:'1h'
        });
        return {userId:user.id,token:token,tokenExpiration:10}
    }
}
