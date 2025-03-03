const errorMiddleware=(err,req,res,next)=>{
    err.message = err.message || "Internal Server Error"
    err.statusCode=err.statusCode || 500

    console.log(err)
    // console.log(err.code,Object.keys(err.keyValue))
    if (err.name == "ValidationError") {
        return res.status(err.statusCode).json({
            success: false,
            message: "Invalid Field"
        })
    }

    if (err.name == "CastError") {
        err.message = "Invalid field"
    }

    if (err.code == 11000) {
        err.message = `${Object.keys(err.keyValue)} Already Present`
    }

    return res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}

class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
    }
}

export {errorMiddleware,ErrorHandler}