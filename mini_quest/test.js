const obj = {
	name : 'Kim',
	getName(){
		console.log(this); //obj
		return this.name;
	}
}

console.log(obj.getName()); // Kim


const standaloneGetName = obj.getName;