const query =require('../lib/query');

exports.authorize = async (req, res, next)=> {
    const is_admin = req.decoded.is_admin;
    const user_type = req.decoded.user_type;
    if(is_admin && req.originalUrl.split('/').find(element => element ==='admin')){
        return res.json({
            status : 'Access Denied',
            success : false,
            message : 'You are not authorized to access this page'
        });
    }else{
        const queryText = `select * from tbl_user_type where id=$1 `;
        const result = await query(queryText,[user_type]);
                
      
    }

}