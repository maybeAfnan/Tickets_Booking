const express = require("express");
const app = express();
const port = 3000;

//DB
const mysql = require("mysql2");
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "tickets_booking",
    port: 3306,
});


app.use("/", express.static("./website"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//validator
const { check, validationResult } = require("express-validator");

//Register
function getRegisterValidation() {
    return [
        check("email")
            .isLength({ min: 1 })
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email must be a valid format (x@y.z)")
            .isLength({ min: 1, max: 200 })
            .withMessage("Email must be between 1 and 200 characters")
            .trim()
            .escape(),

        check("password")
            .isLength({ min: 1 })
            .withMessage("Password is required")
            .isString()
            .withMessage("Password must be a string")
            .isLength({ min: 6, max: 100 })
            .withMessage("Password must be between 6 and 100 characters")
            .matches(/[A-Z]/)
            .withMessage("Password must contain at least one uppercase letter")
            .matches(/[0-9]/)
            .withMessage("Password must contain at least one number")
            .matches(/[!@#$%^&*]/)
            .withMessage("Password must contain at least one special character (!@#$%^&*)")
            .trim()
            .escape()
    ];
}

let registerValidate = getRegisterValidation();

app.post("/register", registerValidate, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(e => e.msg).join(", ");
        res.json({ status: false, err: "Issues found [" + errors.array().length + "]: " + errorMessages + "." });
        return;
    }

    const email = req.body.email.trim();
    const password = req.body.password.trim();

    //check if email already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    pool.query(checkQuery, [email], (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json({ status: false, err: "Email already registered, please login" });
            return;
        }

        //insert new user
        const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
        pool.query(insertQuery, [email, password], (error, result) => {
            if (error) throw error;
            res.json({ status: true, err: "" });
        });
    });
});

//login
function getLoginValidation() {
    return [
        check("email")
            .isLength({ min: 1 })
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email must be a valid format (x@y.z)")
            .isLength({ max: 200 })
            .withMessage("Email must be under 200 characters")
            .trim()
            .escape(),

        check("password")
            .isLength({ min: 1 })
            .withMessage("Password is required")
            .isString()
            .withMessage("Password must be a string")
            .isLength({ min: 6, max: 100 })
            .withMessage("Password must be between 6 and 100 characters")
            .matches(/[A-Z]/)
            .withMessage("Password must contain at least one uppercase letter")
            .matches(/[0-9]/)
            .withMessage("Password must contain at least one number")
            .matches(/[!@#$%^&*]/)
            .withMessage("Password must contain at least one special character (!@#$%^&*)")
            .trim()
            .escape()
    ];
}

let loginValidate = getLoginValidation();

app.post("/login", loginValidate, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(e => e.msg).join(", ");
        res.json({ status: false, err: "Issues found [" + errors.array().length + "]: " + errorMessages + "." });
        return;
    }

    const email = req.body.email.trim();
    const password = req.body.password.trim();

    //check email and password
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    pool.query(query, [email, password], (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json({ status: true, err: "", email: email });
        } else {
            res.json({ status: false, err: "Incorrect email or password." });
        }
    });
});

//Booking
function getBookingValidation() {
    return [
        check("name")
            .isLength({ min: 1 })
            .withMessage("Name is required")
            .isString()
            .withMessage("Name must be a string")
            .isLength({ min: 2, max: 100 })
            .withMessage("Name must be between 2 and 100 characters")
            .matches(/^[A-Za-z ]+$/)
            .withMessage("Name must contain letters and spaces only")
            .trim()
            .escape(),

        check("numTickets")
            .notEmpty()
            .withMessage("Number of tickets is required")
            .isInt({ min: 1, max: 10 })
            .withMessage("Number of tickets must be between 1 and 10")
            .trim()
            .escape(),

        check("meal")
            .isLength({ min: 1 })
            .withMessage("Meal selection is required")
            .isString()
            .withMessage("Meal must be a string")
            .custom((val) => {
                const whitelist = ["Yes", "No"];
                if (whitelist.includes(val)) return true;
                return false;})
            .withMessage("Meal must be Yes or No")
            .trim()
            .escape(),

        check("category")
            .isLength({ min: 1 })
            .withMessage("Category is required")
            .isString()
            .withMessage("Category must be a string")
            .custom((val) => {
                const whitelist = ["VIP", "Category 1", "Category 2", "Category 3", "Category 4"];
                if (whitelist.includes(val)) return true;
                return false;
            })
            .withMessage("Invalid ticket category")
            .trim()
            .escape(),

        check("row")
            .isLength({ min: 1 })
            .withMessage("Row is required")
            .isString()
            .withMessage("Row must be a string")
            .isLength({ max: 50 })
            .withMessage("Row must be under 50 characters")
            .trim()
            .escape(),

        check("matchName")
            .isLength({ min: 1 })
            .withMessage("Match name is required")
            .isString()
            .withMessage("Match name must be a string")
            .isLength({ max: 100 })
            .withMessage("Match name must be under 100 characters")
            .trim()
            .escape(),

        check("matchDate")
            .isLength({ min: 1 })
            .withMessage("Match date is required")
            .isString()
            .withMessage("Match date must be a string")
            .isLength({ max: 20 })
            .withMessage("Match date must be under 20 characters")
            .trim()
            .escape(),

        check("matchTime")
            .isLength({ min: 1 })
            .withMessage("Match time is required")
            .isString()
            .withMessage("Match time must be a string")
            .isLength({ max: 20 })
            .withMessage("Match time must be under 20 characters")
            .trim()
            .escape()
    ];
}

let bookingValidate = getBookingValidation();

app.post("/booking", bookingValidate, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(e => e.msg).join(", ");
        res.json({ status: false, err: "Issues found [" + errors.array().length + "]: " + errorMessages  + "." });
        return;
    }

    const data = {
        email: req.body.email ? req.body.email.trim() : "",
        name: req.body.name.trim(),
        num_tickets: parseInt(req.body.numTickets),
        meal: req.body.meal.trim(),
        category: req.body.category.trim(),
        row: req.body.row.trim(),
        match_name: req.body.matchName.trim(),
        match_date: req.body.matchDate.trim(),
        match_time: req.body.matchTime.trim()
    };

    const query = "INSERT INTO bookings SET ?";
    pool.query(query, data, (error, result) => {
        if (error) throw error;
        res.json({ status: true, err: "" });
    });
});

//My Tickets
app.get("/mytickets", (req, res) => {
    const email = req.query.email ? req.query.email.trim() : "";

    if (email.length < 1) {
        res.json({ status: false, err: "Email is required to view tickets." });
        return;
    }

    const query = "SELECT * FROM bookings WHERE email = ?";
    pool.query(query, [email], (error, result) => {
        if (error) throw error;
        res.json({ status: true, err: "", bookings: result });
    });
});

//Contact
function getContactValidation() {
    return [
        check("firstName")
            .isLength({ min: 1 })
            .withMessage("First name is required")
            .isString()
            .withMessage("First name must be a string")
            .isLength({ min: 2, max: 30 })
            .withMessage("First name must be between 2 and 30 characters")
            .matches(/^[A-Za-z ]+$/)
            .withMessage("First name must contain letters only")
            .trim()
            .escape(),

        check("lastName")
            .isLength({ min: 1 })
            .withMessage("Last name is required")
            .isString()
            .withMessage("Last name must be a string")
            .isLength({ min: 2, max: 30 })
            .withMessage("Last name must be between 2 and 30 characters")
            .matches(/^[A-Za-z ]+$/)
            .withMessage("Last name must contain letters only")
            .trim()
            .escape(),

        check("gender")
            .isLength({ min: 1 })
            .withMessage("Gender is required")
            .isString()
            .withMessage("Gender must be a string")
            .custom((val) => {
                const whitelist = ["Male", "Female"];
                if (whitelist.includes(val)) return true;
                return false;
            })
            .withMessage("Gender must be Male or Female")
            .trim()
            .escape(),

        check("dob")
            .isLength({ min: 1 })
            .withMessage("Date of birth is required")
            .isString()
            .withMessage("Date of birth must be a string")
            .isDate()
            .withMessage("Date of birth must be a valid date")
            .trim()
            .escape(),

        check("email")
            .isLength({ min: 1 })
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email must be a valid format (x@y.z)")
            .isLength({ max: 200 })
            .withMessage("Email must be under 200 characters")
            .trim()
            .escape(),

        check("mobile")
            .isLength({ min: 1 })
            .withMessage("Mobile is required")
            .isNumeric()
            .withMessage("Mobile must contain numbers only")
            .matches(/^[0-9]{10}$/)
            .withMessage("Mobile must be exactly 10 digits")
            .trim()
            .escape(),

        check("language")
            .isLength({ min: 1 })
            .withMessage("Language is required")
            .isString()
            .withMessage("Language must be a string")
            .custom((val) => {
                const whitelist = ["Arabic", "English", "French"];
                if (whitelist.includes(val)) return true;
                return false;})
            .withMessage("Language must be Arabic, English, or French")
            .trim()
            .escape(),

        check("message")
            .isLength({ min: 1 })
            .withMessage("Message is required")
            .isString()
            .withMessage("Message must be a string")
            .isLength({ min: 10, max: 300 })
            .withMessage("Message must be more than 10 characters and under 300 characters")
            .trim()
            .escape()
    ];
}

let contactValidate = getContactValidation();

app.post("/contact", contactValidate, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(e => e.msg).join(", ");
        res.json({ status: false, err: "Issues found [" + errors.array().length + "]: " + errorMessages + "." });
        return;
    }

    const data = {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        gender: req.body.gender.trim(),
        dob: req.body.dob.trim(),
        email: req.body.email.trim(),
        mobile: req.body.mobile.trim(),
        language: req.body.language.trim(),
        message: req.body.message.trim()
    };

    const query = "INSERT INTO contacts SET ?";
    pool.query(query, data, (error, result) => {
        if (error) throw error;
        res.json({ status: true, err: "" });
    });
});

//starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});