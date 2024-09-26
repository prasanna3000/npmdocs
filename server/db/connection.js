const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/npmdocs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`DB Connection established successfully!`);
}).catch((err) => {
    console.log(`Error occurred in DB connection, ${err}`);
});