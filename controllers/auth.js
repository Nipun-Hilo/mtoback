const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Initialising router


// Hard coded Varibales
const FixedEmail = "admin@hilo.com"
const UserID = 1;


//==================================== Login User Route =========================//
// @route       POST api/auth
// @desc        Login User And get token
// @access      Public
exports.login =  async (req, res) => {
    // Pulling things out of req.body
    const salt = await bcrypt.genSalt(10);
    const FixedPassword = await bcrypt.hash("admin@hilo", salt); 
    const { email, password } = req.body;
    try {
        // See if user exist
        // Checking hardcoded email and password
        if(email != FixedEmail){
            return res
            .status(400)
            .json({ errors: [{ msg: "Email Not in Database" }] });
        }


        const isMatch = await bcrypt.compare(password, FixedPassword);

        if (!isMatch) {
            return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        // return jsonwebtoken

        const payload = {
            user: {
            id: UserID,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
            if (err) {
                throw err;
            }
            res
                .status(200)
                .json({
                    success:true,
                    token
                });
            }
        );
        } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
        }
    }


//     // Get token from model and create cookie and send response
// const sendTokenResponse = (user, statusCode, res) =>{

//     // Create Token
//     const token = jwt.sign({ id : this._id}, process.env.JWT_SECRET, {
//         expiresIn : process.env.JWT_EXPIRE
//     });

//     const options = {
//         expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60*60 *1000),
//         httpOnly : true
//     };

//     // https in production
//     if(process.env.NODE_ENV === 'productions'){
//         options.secure = true;
//     }

//     res
//         .status(statusCode)
//         .cookie('token', token, options)
//         .json({
//             success:true,
//             token
//         });
// }