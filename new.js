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

const shortSum = (targetSum ,number,data={})=>{
    if(targetSum in data) return data[targetSum];
    if(targetSum ===0) return [];
    if(targetSum <0) return null;
    let compare = null;
    for(let num of number){
        const remainder = targetSum -num;
        const result = shortSum(remainder,number,data);
        if(result !=null){
            if(compare ===null || compare.length > [...result,num].length){
                compare= [...result,num];
                data[targetSum]=compare;
            }
        }
    }
   data[targetSum] =compare;
    return compare;
    
};

const countConstruct = (target, wordBank,data={})=>{
    if(target in data) return data[target];
    if(target==='') return 1;
    let count=0;
    for(let word of wordBank)
    if(target.indexOf(word)===0){
        const suffix = target.slice(word.length);
        const numberOfWays  = countConstruct(suffix,wordBank,data);
        // console.log("number of ways :"+numberOfWays);
            count+=numberOfWays;
            data[target] = count;
    
    }
    return count;
};

const allConstruct = (target, wordBank,data={}) => {
    if(target in data) return data[target];
    if(target ==='') return [[]];
    const constPath = [];

    for(let word of wordBank){
        if(target.indexOf(word)===0){
            const suffix = target.slice(word.length);
            const result = detailsConstruct(suffix,wordBank,data);
            constPath.push(...result.map(paths=>[word,...paths]));
            data[target] =constPath;
            // constPath.push(...result2);
        }
    }
    return constPath;

};

const bestConstruct = (target, wordBank,data={}) => {
    if(target in data) return data[target];
    if(target ==='') return [[]];
    const constPath = [];

    for(let word of wordBank){
        if(target.indexOf(word)===0){
            const suffix = target.slice(word.length);
            const result = bestConstruct(suffix,wordBank,data);
          // if(constPath ===null || constPath.length > (result.map(paths=>[word,...paths]).length))
            constPath.push(...result.map(paths=>[word,...paths]));
            
            data[target] =constPath;
            // constPath.push(...result2);
        }
    }
    let temp = constPath[0];
    for(let path of constPath){
        if(temp.length > path.length){
            temp = path;
        }
    }
    // console.log(temp);
    return constPath;

};
// console.log(detailsConstruct("abcdef",["ab","abc","cd","def","abcd"]));
// console.log(detailsConstruct("enterapotentpot",["a","p","ent","enter","ot","o","t"]));
// console.log(detailsConstruct("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef",["e","eeee","ee","eeeeeeeeee","eeee"]));

console.log(bestConstruct("abcdef",["ab","abc","cd","def","abcd"]));
console.log(bestConstruct("enterapotentpot",["a","p","ent","enter","ot","o","t"]));
console.log(bestConstruct("abcdef",["ab","abc","cd","def","abcd","ef","c"]));
console.log(bestConstruct("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef",["e","eeee","ee","eeeeeeeeee","eeee"]));