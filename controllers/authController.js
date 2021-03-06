const query = require('../lib/query');
const jwt = require('../utils/jwtToken');
const bcryptjs = require('bcrypt');
const {body,params,validationResult} = require('express-validator');
const AppError = require('../utils/appError');

exports.validate = (method)=>{
    switch(method){
        case 'adminLogin' : {
            return [
                body('user_email','Email must be provided').notEmpty(),
                body('user_email','Invalid mail , it must be in email format').isEmail(),
                body('password','Password must be provided').notEmpty(),
            ];
        }
    }
};

exports.adminLogin = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return ( new AppError(400, 'Validation Error', errors.errors),req,res,next);
        }
        const bindVars = [
            req.body.user_email,
            req.body.password,
        ];
        const queryText = `select * from tbl_admin_login where user_email=$1`;
        const result = await query(queryText, [req.body.user_email]);
        if(result.rows.length > 0){
            const match  = await bcryptjs.compare(bindVars[1],result.rows[0].password);
            if(!match){
                res.status(200).json({
                    statusCode: 204,
                    message: "Password not match!!"
                });
            }else{
                const user = {
                    user_id: result.rows[0].id,
                    user_email: result.rows[0].user_email,
                    user_name: result.rows[0].username,
                    user_type: result.rows[0].user_type,
                    is_admin:1
                    
                };
                const token = await jwt.jwtToken(user);
                result.rows[0].password="";
                res.status(200).json({
                    statusCode: 200,
                    response: {
                        accessToken : token,
                        userData : result.rows[0],
                        Admin_status : user.is_admin?true:false   
                    },
                    
                });
            }
        }

    }catch(err){
        next(err);
    }
};