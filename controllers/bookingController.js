const query=  require('../lib/query');
const {body,params,validationResult} = require('express-validator');
const AppError = require('../utils/appError');

exports.validate = (method) => {
    switch (method) {
        case 'bookRoom' : {
           return [
               body('roomid', 'ID must be provided cannot be empty').exists().notEmpty(),
            ];
        }
        case 'getFreeRoom' :{
           return [ body('roomtype', 'Room type must be provided cannot be empty').exists().notEmpty(),
        ];
        }
    }
}

exports.bookRoom = async (req, res, next)=> {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next( new AppError(400,'Validation Error', errors.errors),req,res,next);
        }
        const bindVars = [req.body.roomid];
        const queryText=  `insert into tbl_room(vaccancy) values('no') where roomid=$1`;
        const result = await query(queryText,bindVars);
        if(result.rowCount > 0){
            res.status(200).json({
                status: true,
                message : `successfully booked`,
                id : roomid
            });
        }else{
            res.status(400).json({
                status: false,
                message: `failed to book the room`
            })
        }
    }catch(err){
        next(err);
    }
};

exports.getFreeRoom = async (req, res, next)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next( new AppError(400,'Validation Error', errors.errors),req,res,next);
        }
        const bindVars = [req.body.roomtype];
        let queryText=``;
        if(req.query.PageSize && req.query.PageIndex)
        queryText = `select * from tbl_room where vaccancy='yes' AND roomtype=$1
        order by roomid
        limit ${req.query.PageSize} offset ${req.query.PageIndex-1}*${req.query.PageSize}`;
        else
        queryText = `select * from tbl_room where vaccancy='yes' AND roomtype=$1 
        order by roomid`;
        const result = await query(queryText,bindVars);
        if(result.rowCount > 0){
            res.status(200).json({
                status: true,
                message : `success`,
                data : result.rows
            });
        }else{
            res.status(400).json({
                status: false,
                message: `No empty rooms available of ${req.query.roomtype} category`
            })
        }


    }catch(err){
        next(err);
    }
};