const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true , useUnifiedTopology: true }).then(() => {
        console.log("connected");
}).catch((e)=> {
    console.log("error" + JSON.stringify(e, undefined, 2));
});

module.exports = {mongoose};
