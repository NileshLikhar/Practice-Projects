const enteredValue = ('Enter how many rows you want to dialpay')
let anyValue = parseInt(enteredValue);
for (let i=1 ; i<=anyValue ; i++){
    for (let j=1 ; j<=i ; j++){
        console.log(j+" ");
    }
    console.log(" ");
}