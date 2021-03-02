
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
            //generar el id
            const idServicio = document.createElement('P');
            idServicio.textContent = id; 

            //generar el nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre; 
            nombreServicio.classList.add('nombre-servicio');

            //generar el precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`; 
            precioServicio.classList.add('precio-servicio');

            //generar el div
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');

            //selecciona un servicio
            servicioDiv.onclick = seleccionarServicio;

            //inyectar al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            
            document.querySelector('#servicios').appendChild(servicioDiv);
        });

    } catch (error) {
        console.log(error);
    }
    
}


function seleccionarServicio(e){

    let elemento;

    //forzar que el elemento clickeado sea el DIV

    if(e.target.tagName === 'P' ){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
    }
    else{
        elemento.classList.add('seleccionado');
    }
    
}