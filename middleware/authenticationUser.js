const authenticate=(req,res,next)=>{
     if((req.headers['x-access-token'] && req.headers['x-access-token'].includes('admin'))|| req.headers['authorization'] && req.headers['authorization']=='admin'){
        return next();
    }
    else{
        return res.status(401).json({"status":"failed", "message":"Unauthorized Please login to access"});

    }
   
}

module.exports ={
    authenticate:authenticate,
}