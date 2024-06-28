const mongoose = require('mongoose')

const url = 'mongodb+srv://cfscfs0001:akshat123@cluster0.uhjqgvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('connected to DB')).catch((e) => console.log('Error',e)) 