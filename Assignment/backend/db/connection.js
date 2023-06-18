const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin-harsh:"+process.env.MONGO_KEY+"@cluster0.pqd8uax.mongodb.net/assignDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Connected to database");