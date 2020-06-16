/**
 *          .::USER CONTROLLER::.
 * All related operations to User belong here. 
 * 
 */
import User from '../models/User';
import tokenize from '../middlewares/Token'
import ErrorHandler from '../middlewares/ErrorHandler';


/*          POST /api/users/register            */
export let register = async (req, res, next) => {
    //REQUEST VALIDATION
    if (!req.validate(["email", "password"])) return;

    var {
        email,
        password
    } = req.body;
    try {
        //CHECK IF USER ALREADY EXISTS
        if (await User.findOne({ email })) throw { message: "email already exists.", code: 409 };
        //CREATING NEW USER OBJECT
        var newUser = new User({
            email,
            password
        });
        //SAVING USER
        var savedUser = await newUser.save();
        //GENERATING TOKEN
        var token = await tokenize(savedUser._id);

        //OK RESPONSE
        res.validSend(200, {
            registered: true,
            message: "User has been registered successfully.",
            token: token
        });
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }

}
/*          POST /api/users/login            */
export let login = async (req, res, next) => {
    //REQUEST VALIDATION    
    if (!req.validate(["email", "password"])) return;

    var {
        email,
        password
    } = req.body;
    try {
        //FINDING USER
        var user = await User.findOne({
            email
        }).lean();
        if (!user) throw { code: 401, message: "Email or password is incorrect." }
        //AUTHENTICATING USER
        var authenticated = await User.authorize({
            _id: user._id,
            password
        });

        //GENERATING TOKEN
        if (!authenticated) throw { code: 401, message: "Email or password is incorrect." }
        var token = await tokenize(user._id);

        //OK RESPONSE
        res.validSend(200, {
            authenticated,
            token,
            user
        })
    } catch (e) {
        return ErrorHandler(e, req.originalUrl, res)
    }
}
/*          POST /api/users/me            */
export let me = async (req, res) => {
    //OK RESPONSE
    res.validSend(200, req.user);
}