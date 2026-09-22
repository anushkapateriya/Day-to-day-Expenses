require("dotenv").config();

const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");

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
        console.log("Database connection error:", error); 
    });

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});

