const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);

sequelize.sync()
    .then(function() { 
        console.log("Database connected"); 
    })
    .catch(function(error) { 
        console.log("Database connection error:", error); 
    });

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});

