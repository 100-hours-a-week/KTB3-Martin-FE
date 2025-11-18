
const myPet = {
    name : "Momo",
    type : "Cat",

    introduce(){
        console.log(`name is ${this.name} and type is ${this.type}`)
    }

}

myPet.introduce()



function Person(name, age){
    this.name = name,
    this.age = age,

    this.greet= function(){
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old`);
    };
}

const person = new Person("Jane Doe", 25);
person.greet();


let arr = [1, 2, 3, 4, 5];

const ans = arr.reduce((acc, num) => acc+ num);

console.log(ans);

const arr2 = arr.map((num) =>num*2);

console.log(arr2);


const add = (num1, num2) => num1 + num2;
const num = add(2,3);
console.log(num);

arr  = [1, 2, 3, 4];
const sumArray = (array) =>
        {
            let total = 0
            for(let i=0; i<array.length; i++){
                total += array[i];
            }
            return total;
        }

let total = sumArray(arr);

console.log(total);

function async(){
    console.log("Async Operation Complete");
}

console.log("Start");
setTimeout(async, 1);


const myFirstPromise = new Promise((resolve, reject) =>{
    
})

myFirstPromise.then(message =>{
    console.log(message);
})
