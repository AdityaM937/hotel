const info = require('request-info');
const query = require('../lib/query');

exports.logger = (req,res,next) => {

    const reqData = info(req);
    console.log(reqData);
    // console.log(req.connection.remoteAddress +" "+req.headers['x-forwarded-for']);
    // console.log(res.__morgan_body_response);
    // res.on("finish",async () => {
    //     const uid = res.req.decoded?res.req.decoded.user_id:JSON.parse(res.__morgan_body_response).uid;
    //     const name=res.req.decoded?res.req.decoded.user_name:0;
    //     const ipaddress = req.connection.remoteAddress || req.headers['x-forwarded-for'];
    //     const log_type = JSON.parse(res.__morgan_body_response).log_type;
    //     const log_description = JSON.parse(res.__morgan_body_body_response).log_description;
    //     const log_name = JSON.parse(res.__morgan_body_response).log_name;
    //     var bindvars=[
    //         1,
    //         log_type,
    //         log_name,
    //         log_description,
    //         ipaddress ];

    //     const queryText = `insert into tbl_activity_logs(uid,log_type,log_name,log_description,
    //         ipaddress,createdby,createdon,modifiedby,modifiedon)
    //         values($1,$2,$3,$4,$5,$1,LOCALTIMESTAMP,$1,LOCALTIMESTAMP) RETURNING id`;
    //         console.log("queryText",queryText);
    //         if(log_type)
    //         {
    //             const result= await query(queryText,bindvars);
    //         }

    // });
    next();
};