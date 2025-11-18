//cjs 형식 사용을 위한 모듈
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

//type:module 사용중 cjs형식을 가져오기 위해 확장자 변환
//math.js -> math.cjs
const math = require("./math.cjs");
import {add, subtract} from "./operations.js";
import user from"./userProfile.js";

const person = new user("name", 4);

console.log(math.add(2, 3));

console.log(add(2, 2));
console.log(subtract(3, 1));

console.log(person.name);
