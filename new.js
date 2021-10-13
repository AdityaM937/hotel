const fibo = (n, data={}) =>{
    if(n in data) return data[n];
    if(n<=2) return 1;
    data[n] = fibo(n-1,data)+fibo(n-2,data);
    return data[n]; 
    
};

const howSum = (targetSum , number , data={})=>{
    if(targetSum in data) return data[targetSum];
    if(targetSum ===0) return [];
    if(targetSum <0) return null;
    for(let num of number){
        const remainder = targetSum - num;
        const result = howSum(remainder,number,data);
        if(result != null)
        {
            data[targetSum] = [...result,num];
            return data[targetSum];
        }
        
    }
    data[targetSum] = null;
    return null;
};

const shortSum = (targetSum ,number)=>{
    if(targetSum ===0) return [];
    if(targetSum <0) return null;
    let compare = null;
    for(let num of number){
        const remainder = targetSum -num;
        const result = shortSum(remainder,number);
        if(result !=null){
            if(compare ===null || compare.length > [...result,num].length)
            compare= [...result,num];
            
        }
    }
   
    return compare;
    
};

console.log(shortSum(8,[5,2,3]));