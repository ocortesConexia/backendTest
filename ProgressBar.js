const { bgWhite } = require("chalk");
const { createWriteStream } = require('fs');
const log = createWriteStream('./result.log');
module.exports = class ProgressBar {
	constructor() {
		this.total;
		this.current;
        this.bar_length = process.stdout.columns - 30;
        this.errors=0;
        this.users=0;
        this.petitionsPerUser=0;
        this.endPoints=[];
        this.startDate;
        this.finishDate;
	}

	init(users,petitionsPerUser,endPoints) {
        this.users=users;
        this.endPoints=endPoints;
        this.petitionsPerUser=petitionsPerUser;
        this.total = this.users.length*petitionsPerUser*endPoints.length;
        this.endPoints = endPoints;
		this.current = 0;
        this.update(this.current,0);
        this.startDate=new Date();
	}

	update(current,errors) {
        this.current = current;
        this.errors=errors;
		const current_progress = this.current / this.total;
		this.draw(current_progress);
	}

	draw(current_progress) {
		const filled_bar_length = (current_progress * this.bar_length).toFixed(
			0
		);
		const empty_bar_length = this.bar_length - filled_bar_length;

		const filled_bar = this.get_bar(filled_bar_length, " ", bgWhite);
		const empty_bar = this.get_bar(empty_bar_length, "-");
		const percentage_progress = (current_progress * 100).toFixed(2);

		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(
            `Procesando: [${filled_bar}${empty_bar}] | ${percentage_progress}%`
        );
        if(percentage_progress==100){
            let endDate=new Date();
            let milliseconds= endDate-this.startDate;
            let seconds = Math.floor( (milliseconds / 1000) % 60);
            let minutes = Math.floor(  ((milliseconds / (1000*60)) % 60));
            let hours   = Math.round(  ((milliseconds / (1000*60*60)) % 24));
            console.log(
                `\n           Total of petitions: ${this.total} \n 
            Fecha Inicio: ${this.startDate}\n
            Fecha Fin: ${endDate}\n
            Total tiempo: ${hours} hora(s), ${minutes} minuto(s), ${seconds} segundo(s)\n
            Number of users: ${this.users.length} \n
            Petitions per User: ${this.petitionsPerUser} \n
            Total end points: ${this.endPoints.length}\n
            End points test:`
            
        );
        log.write(`Total of petitions: ${this.total}\nFecha Inicio: ${this.startDate}\nFecha Fin: ${endDate}\nTotal tiempo: ${hours} hora(s), ${minutes} minuto(s), ${seconds} segundo(s)\nNumber of users: ${this.users.length} \nPetitions per User: ${this.petitionsPerUser} \nTotal end points: ${this.endPoints.length}\nEnd points test:`)
        
        for (const endpoint of this.endPoints) {
            const path = endpoint.path || endpoint
            console.log("            "+path);
            log.write("\n"+path);
        }
        console.log("            Usuarios de la prueba:")
        log.write("\nUsuarios de la prueba:");
        for (const user of this.users) {
            
            console.log("           - "+user);
            
            log.write("\n-"+user);
        }
            if(this.errors==0){
                console.log("            Process finish with none Errors :)");
                log.write("\nProcess finish with none Errors :)");
            }else{
                console.log(`            Process finish with ${this.errors} Errors :´(`);
                log.write(`\nProcess finish with ${this.errors} Errors :´(`);
            }
            
        }
	}

	get_bar(length, char, color = a => a) {
		let str = "";
		for (let i = 0; i < length; i++) {
			str += char;
		}
		return color(str);
	}
};