const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://atonu:atonumongo@cluster0.9xqxy.mongodb.net/MEAN?retryWrites=true&w=majority',{ useNewUrlParser: true , useUnifiedTopology: true }).then(() => {
        console.log("connected");
}).catch((e)=> {
    console.log("error" + JSON.stringify(e, undefined, 2));
});


module.exports = {mongoose};


1
