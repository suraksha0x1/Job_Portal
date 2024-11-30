class ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode = statuscode;
    }
}

 const errorMiddleware = (err, req, res, next)=>{
    err.message = err.message || "Server error";
    err.statuscode = err.statuscode || 500;  // code for internal sefver
    if(err.code === 1062){
        const message = `Duplicate ${object.keys(err.keyValue)}Entered`;
        err = new ErrorHandler(message,400);
    }
    return res.status(statuscode).json({
        success:false,
        message:err.message,
    });

};
module.exports = ErrorHandler;
module.exports = errorMiddleware;
// module.exports = 