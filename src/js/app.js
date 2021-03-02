
document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});


function iniciarApp(){
    mostrarServicios();
}

async function mostrarServicios(){ //funcion asincrona
    
    try {
        const resultado = await fetch('./servicios.json');  //obtene de esta carpeta
        const db = await resultado.json();      //el resultado es un jotason
        
        const { servicios } = db; //destructuring, de DB sacale los "servicios" y guardalos

        //generar html

        servicios.forEach( servicio => {
            const { id,nombre,precio } = servicio;

            //DOM scripting

        });

    } catch (error) {
        console.log(error);
    }
    
}
