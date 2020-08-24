const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/authDB",{ useNewUrlParser: true , useUnifiedTopology: true }).then(() => {
        console.log("connected");
}).catch((e)=> {
    console.log("error" + JSON.stringify(e, undefined, 2));
});


module.export = {mongoose};
