const {getUser} = require("../service/auth")

async function restrictToLoggedinUserOnly(req,res,next) {
    // const userUid = req.cookies?.uid;
    const userUid = req.header("Authorization");

    if(!userUid) return res.redirect("/login");
    const token = userUid.split('Bearer ')[1];
    // const user = getUser(userUid);
    const user = getUser(token);

    if(!user) return res.redirect("/login");

    req.user = user;
    next();
}

async function checkAuth(req,res,next) {
    // const userUid = req.cookies?.uid;
    const userUid = req.get("Authorization");

    if (!userUid || !userUid.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = userUid.split('Bearer ')[1];
    // const user = getUser(userUid);
    const user = getUser(token);
    
    req.user = user || null;
    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
}