require('dotenv').config();

function checkRole(req,res,next){
    if(res.locals.role!=process.env.ADMIN)
    res.sendStatus(401)
    else 
    next()
    
}

function checkRoleUser(req,res,next){
    if(res.locals.role==process.env.USER)
    res.sendStatus(401)
    else 
    next()
    
}
function checkRoleStaff(req,res,next){
    if(res.locals.role==process.env.STAFF)
    res.sendStatus(401)
    else 
    next()
    
}

module.exports = {checkRole: checkRole,checkRoleUser,checkRoleStaff}