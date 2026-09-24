require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const sequelize = require("./config/database");
const cors = require("cors");
const { logError } = require("./logger");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const orderRoutes = require("./routes/orderRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgotPasswordRequest = require("./models/forgotPasswordRequest");

const app = express();

const accessLogStream = fs.createWriteStream(
    "./logs/access.log",
    { flags: "a" }
);

app.use(morgan("combined", {
    stream: accessLogStream
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", userRoutes);
app.use("/", expenseRoutes);
app.use("/", orderRoutes);
app.use("/", premiumRoutes);
app.use("/", passwordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest, {
    foreignKey: "userId"
});

ForgotPasswordRequest.belongsTo(User, {
    foreignKey: "userId"
});

sequelize.sync()
    .then(function() { 
        console.log("Database connected"); 
    })
    .catch(function(error) {  
        logError(error);
    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});

