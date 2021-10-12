const query= require('../lib/query');
const {AppError} = require('../utils/appError');
const {body, params, validationResult} =require('express-validator');

exports.validation = (method) => {
    switch (method) {
        case 'addRoom' : {
            return [
                body('roomid','Room number was not provided').notEmpty().exists(),
                body('roomtype','Room type was not provided').notEmpty().exists(),
                body('rate(INR)','Rate in Ruppees was not provided').notEmpty().exists(),
                body('rate(USD)','Rate in Dollars was not provided').notEmpty().exists()
            ];
        }
        case 'removeRoom' :{
            return [
                body('roomid','Room number was not provided').notEmpty().exists(),
            ];
        }
    }
}
/**Add rooms */
exports.addRoom = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty())
        return ( new AppError(400,'Validation Error',errors.errors),req,res,next);

        bindVars = [
            req.params.roomid,
            req.params.roomtype,
            req.params.rate(INR),
            req.params.rate(USD)
        ];
        const queryText = `insert into tbl_room('roomid','vaccancy','roomtype','rate(INR)','rate(USD)') 
        values($1,'yes',$2,$3,$4) returning roomid`;
        const result = await query(queryText,bindVars);
        if(result.rows.length > 0)
        {
            res.status(200).json({
                StatusCode: 200,
                status:'success',
                message : 'added successfuly'
            });

        }else{
            res.status(400).json({
                StatusCode: 400,
                status:'failed',
                message: 'Ran into a problem'
            });
        }

    }catch(err) {next(err);}

};


/**Delete rooms */
exports.deleteRoom = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty())
        return ( new AppError(400,'Validation Error',errors.errors),req,res,next);

        bindVars = [
            req.params.roomid,
        ];
        const queryText = `delete from tbl_room where roomid=$1`;
        const result = await query(queryText,bindVars);
        if(result.rows.length > 0)
        {
            res.status(200).json({
                StatusCode: 200,
                status:'success',
                message : 'deleted successfuly'
            });

        }else{
            res.status(400).json({
                StatusCode: 400,
                status:'failed',
                message: 'Ran into a problem'
            });
        }

    }catch(err) {next(err);}

};


/**get a room detail */
exports.getRoom = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty())
        return ( new AppError(400,'Validation Error',errors.errors),req,res,next);

        bindVars = [
            req.params.roomid,
        ];
        const queryText = `select * from tbl_room where roomid=$1`;
        const result = await query(queryText,bindVars);
  
        if(result.rowCount > 0)
        {
            res.status(200).json({
                StatusCode: 200,
                status:'success',
                data : result.rows[0]
            });

        }else{
            res.status(400).json({
                StatusCode: 400,
                status:'failed',
                message: 'Ran into a problem'
            });
        }

    }catch(err) {next(err);}

};

exports.listRoom = async (req,res,next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return (new AppError(400, 'Validation Error', errors.errors),req,res,next);
        }
        const bindVars = [

        ];
        let queryText=``;
        if(req.query.PageIndex && req.query.PageSize)
        queryText =`select * from tbl_room
        order by roomid
        limit ${req.query.PageSize} offset ${req.query.PageSize}*${req.query.PageIndex-1}
        `;
        else
        queryText =`select * from tbl_room
        order by roomid
        `;
        const result = await query(queryText,bindVars);
        const rows = result.rows;
        if(rows.length >0)
        {
            res.status(200).json({
                status:true,
                message:`success!!`,
                data:result.rows,
                totalcount : rows[0].fullcount?rows[0].fullcount:rows.length
            });
        }else{
            res.status(201).json({
                status:false,
                message: `no data found on this page!`
            });
        }
    }catch(err){
        next(err);
    }
}
