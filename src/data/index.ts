import {exit} from 'node:process'; 
import db from '../config/db';
import colors from 'colors'; 

const clearDB = async () => {
    try{
        await db.sync({force: true}); // Borrar los registros de las pruebas;
        console.log(colors.yellow("Registros borrados correctamente")); 
        exit(); // Termina sin errores; 
    }catch(error){
        console.log(error); 
        exit(1); // Termina con errores; 
    }
}

if(process.argv[2] === '--clear')
    clearDB() 