
let pagina = 1;

const cita = {
    nombre : '',
    fecha : '',
    horario: '',
    servicios: [] 
}


document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //resalta el div actual segun que se presione

    mostrarSeccion();

    //oculta o muestra secciones
    cambiarSeccion();

    //paginacion siguiente y anterior

    paginaSiguiente();
    paginaAnterior();

    //comprobar pagina para mostrar o ocultar paginacion
    botonespaginador();

    //mostrar el resumen de la cita si no pasa la validacion
    mostrarResumen();

    //almacenar el nombre de la cita en el objeto
    nombreCita();

    //almacenar la fecha de la cita
    fechaCita();

    //deshabilitar fecha anterior
    deshabilitarFechas();

    //almacenar hora de la cita
    horaCita();
}


function mostrarSeccion(){

    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if( seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');;
    }

    //eliminar mostrar seccion de la seccion anterior

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs button.actual');
    if( tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //resaltar el actual

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}


function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e =>{
            e.preventDefault();

            //va a ir cambiando el valor  de pagina
            pagina = parseInt(e.target.dataset.paso); //saber a que le doy click

            //llamar mostrar seccion
            mostrarSeccion();
            botonespaginador();
        });
    })

}


async function mostrarServicios(){ //funcion asincrona
    
    try {

        const url = 'http://localhost:3000/servicios.php';

        const resultado = await fetch(url);  //obtene de esta carpeta
        const db = await resultado.json();      //el resultado es un jotason
        
        // console.log(db);

        // const { servicios } = db; //destructuring, de DB sacale los "servicios" y guardalos

        //generar html

        db.forEach( servicio => {
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
            servicioDiv.dataset.idServicio = id;

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

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }
    else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            //el dataset lo puse yo
            id: parseInt( elemento.dataset.idServicio ),
            //el primer elemento del div
            nombre: elemento.firstElementChild.textContent,
            //el que le sigue
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        // console.log(servicioObj);

        agregarServicio(servicioObj);
    }
    
}

function eliminarServicio(id){
    const {servicios } = cita;
    //trae todos los que tengan un id diferente al que quiero borrar
    //y guardalos en cita => servicios
    cita.servicios = servicios.filter( servicio => servicio.id !== id );

    console.log(cita);
}

function agregarServicio(servicioObj){
    const { servicios} = cita;

    //toma y pon en cita servicios, el contenido de servicios (vacio se va llenando) y agregale el obj
    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}


function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click' , () => {
        pagina++;
        botonespaginador();
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click' , () => {
        pagina--;
        botonespaginador();
    });
}

function botonespaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');


    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if (pagina === 2) {
        paginaAnterior.classList.remove('ocultar');
    }

    if(pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        console.log(cita);
        mostrarResumen(); //pagina 3? carga el resumen de la cita
    }else if (pagina === 2){
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();

}

function mostrarResumen(){

    const { nombre, fecha, horario, servicios} = cita;

    //Seleccionar el resumen
    const contenedor = document.querySelector('.contenido-resumen');

    //toma el html y vacialo
    while(contenedor.firstChild){
        contenedor.removeChild( contenedor.firstChild);
    }

    //validacion
    //se fija si algun campo esta vacio
    //todos menos el array
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Debes de llenar todos los campos';

        noServicios.classList.add('invalidar-cita')

        contenedor.appendChild(noServicios);

        return
    }

    //mostrar el resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = "Resumen de Cita";

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span>${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span>${horario}`;


    const resumen = document.querySelector('.contenido-resumen');

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = "Resumen";
    serviciosCita.appendChild(headingServicios);

    //precio a pagar
    let cantidad = 0;

    //iterar sobre el arreglo de servicios

    servicios.forEach( servicio =>{

        const { nombre, precio } = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt( totalServicio[1].trim() );

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    });


    resumen.appendChild(headingCita);
    resumen.appendChild(nombreCita);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span> Total a pagar : </span> $ ${cantidad}`;

    resumen.appendChild(cantidadPagar);

}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    
    //validar en tiempo real, mientras escribo
    nombreInput.addEventListener('input',e =>{
        //trim elimina el espacio en blanco
        const nombreTexto = e.target.value.trim();
        console.log(nombreTexto);

        if(nombreTexto === '' || nombreTexto.length <= 3){
            mostrarAlerta('Nombre IN-valido','error');
        }else{
            cita.nombre = nombreTexto;
            const alerta = document.querySelector('.alerta');
            if(alerta)
                alerta.remove();
            mostrarAlerta('Nombre aceptado','correcto');
        }


    })

}

function mostrarAlerta(mensaje,tipo){

    //si hay una alerta previan o crear otra
    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia)
        return;

    const alerta = document.createElement('DIV');
    alerta.classList.add('alerta');
    alerta.textContent = mensaje;

    if(tipo === 'error'){
        alerta.classList.add('error');
    }
    else{
        alerta.classList.add('correcto');
    }

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminarla despues de 3 segundos

    setTimeout(() => {
        alerta.remove();
    }, 3000);

}


function fechaCita(){
    const fechaInput = document.querySelector('#fecha');

    fechaInput.addEventListener('input', e =>{
        // console.log(e.target.value);

        //tener acceso a las funciones de fecha
        //get me da el numero del dia 0 domingo- 6 sabado
        const dia = new Date(e.target.value).getUTCDay();

        // const opciones = {
        //     weekday: 'long', //dia
        //     year: 'numeric',
        //     month: 'long'
        // }
        //ponerlo en español
        // console.log(dia.toLocaleDateString('es-ES',opciones));
        // console.log(dia);

        //este es un array method, si 0 esta incluido en dia
        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Los fines de semana estamos cerrados','error');
        }else{
            cita.fecha = fechaInput.value;
            console.log(cita);
        }

    })
}

function deshabilitarFechas(){
    const inputFecha = document.querySelector('#fecha');

    //la variable guarda la fecha en la que se creo
    const fechaAhora = new Date;
    const year = fechaAhora.getFullYear();
    let mes = fechaAhora.getMonth() + 1 ; //empieza en 0
    if(mes < 10) {
        mes = `0${mes}`
    }
    let dia = fechaAhora.getDate() + 1;
    if(dia < 10) {
            dia = `0${dia}`
        }

    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;

}

function horaCita(){

    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', e =>{

        const horaCita = e.target.value;
        //split divide un string en 2 segun que le pase
        const hora = horaCita.split(':');
        //pos 0 hora pos 1 minutos

        if(hora[0] < 10 || hora[0] > 18 ){
            mostrarAlerta('Es muy temprano','error');
            inputHora.value = '';
            return
        }
        cita.horario = horaCita;

        console.log(cita);

    })

}