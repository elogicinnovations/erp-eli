
function findAuthorization(authorization, target){
    var a = authorization?.find((item) => authorization === target);

    if(a){
        return true;
    }
    else
    {
        return false;
    }
}

export default findAuthorization;
