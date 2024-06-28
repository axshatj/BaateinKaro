const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express();

require('./db/connection')
const Users = require('./modules/Users')
const Conversations = require('./modules/Conversations')
const Messages = require('./modules/Messages')


const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cors());

app.get('/', (req,res) => {
    res.send('welcome');
})

app.get('/api/test', async(req,res) => {
    console.log(8000)
})

app.post('/api/register', async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if (fullName && email && password) {
            const isAlreadyExist = await Users.findOne({ email });
            if (isAlreadyExist) {
                return res.status(400).send('User already exists'); 
            } else {
                const hashedPassword = await bcryptjs.hash(password, 10);
                const newUser = new Users({ fullName, email, password: hashedPassword });
                await newUser.save();
                // console.log(newUser);
                return res.status(200).send('User registered successfully');
            }
        } else {
            return res.status(400).send("Please fill all the required fields");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});

app.post('/api/login', async (req,res,next) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            res.status(400).send("Please fill all required fields");
        }
        else{
            const user = await Users.findOne({ email });
            if(!user){
                res.status(400).send('User email or password is incorrect');
            }
            else{
                const validateUser = await bcryptjs.compare(password, user.password);
                if(!validateUser){
                    res.status(400).send('User email or password is incorrect');
                }
                else{
                    const payload = {
                        userID: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_JWT_KEY';
                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async(err, token) => {
                        await Users.updateOne({_id: user._id}, {
                            $set: { token }
                        })
                        user.save();
                        return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName }, token: token})
                        // console.log('token sent successfully')
                        // next()
                    })
                }
            }
        }
    }
    catch(error){
        console.log(error,'Error')
    }
})

app.post('/api/conversation', async(req,res) => {
    try{
        const {senderID, receiverID} = req.body;
        // console.log(senderID)
        const newConversation = new Conversations( {members: [senderID, receiverID]} );
        await newConversation.save();
        res.status(200).send('Conversation created successfully')
    }
    catch(error){
        console.log(error,'Error')
    }
})

app.get('/api/conversation/:userID', async(req,res) => {
    try{
        const userID = req.params.userID;
        const conversations = await Conversations.find({members: { $in: [userID] }});
        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverID = conversation.members.find((member) => member!= userID);
            const user = await Users.findById(receiverID);
            return { user: {email: user.email, fullName: user.fullName}, conversationID: conversation._id}
        }))
        res.status(200).json(await conversationUserData);
    }
    catch(error){
        console.log(error,"Error");
    }
})

app.post('/api/message/', async(req,res) => {
    try{
        const { conversationID, senderID, message, receiverID = '' } = req.body;
        if(!senderID || !message)return res.status(400).send('Please fill all the required fields')
        if(!(conversationID) && receiverID){
            const newConversation = new Conversations({ members: [senderID,receiverID] });
            await newConversation.save();
            const newMessage = new Messages({ conversationID: newConversation._id, senderID, message });
            await newMessage.save();
            return res.status(200).send('Message sent successfully');
        }
        else if(!conversationID && !receiverID){
            return res.status(400).send('Please fill all the required fields');
        }
        const newMessage = new Messages({ conversationID, senderID, message });
        await newMessage.save();
        res.status(200).send('Message sent successfully');
    }
    catch(error){
        console.log(error,'Error');
    }
})

app.get('/api/message/:conversationID', async(req,res) => {
    try{
        const conversationID = req.params.conversationID;
        if((conversationID) === 'new') return  res.status(200).json([]);
        const messages = await Messages.find( {conversationID } );
        const messageUserData = Promise.all(messages.map(async(message)=>{
            const user = await Users.findById(message.senderID);
            return { user: {email:user.email, fullName: user.fullName }, message: message.message }
        }));
        res.status(200).json(await messageUserData);
    }
    catch(error){
        console.log('Error',error);
    }
})

app.get('/api/users',async(req,res) => {
    try{
        const users =await Users.find();
        const usersData = Promise.all(users.map(async (user) => {
            return { user: {email: user.email, fullName: user.fullName }, userID: user._id }
        }))
        res.status(200).json(await usersData);
    }
    catch(err){
        console.log("error",err);
    }
})

app.listen(port,() => {
    console.log('listening on port' + port);
})