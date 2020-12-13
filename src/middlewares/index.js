const accessControl = (...allowedRoles) => {
    return(req, res, next) => {
        if(!allowedRoles.includes(req.user.role)){
            return res
            .status(400)
            .json({
                status: "fail",
                error: "You are not permitted to perform this action"
            })
        }
        next()
    }
};

export {
    accessControl
};