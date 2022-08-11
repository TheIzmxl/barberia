let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    //Resalta el DIV actual segun el tab al que se presiona
    mostrarSeccion();
    //Mostar u ocultar un DIV segun el tab al que se presiona
    cambiarSeccion();
    //paginacion Siguiente y anterior
    paginaSiguiente();

    paginaAnterior();
    //Revisar la pagina
    botonesPaginador();
    //Muestra el Mensaje de la cita o el error
    mostrarResumen();
    //Validar nombre de la cita
    nombreCita();
    //Validar Fecha de la cita
    fechaCita();
    //Deshabilitar fechas anteriores
    deshabilitaFechaAnterior();
    //Validar Hora de la Cita
    horaCita();
}
function mostrarSeccion() {
    //Elimina mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion')
    }
    const seccionActual = document.querySelector(`#paso-${pagina}`)
    seccionActual.classList.add('mostrar-seccion')
    //eliminar la clase de Actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual')
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);
            //Llamar Mostrar Seccion
            mostrarSeccion();
            botonesPaginador();
        })
    })
}


async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        //Generar HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            //DOM Scripting
            //Generar Nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            //Generar Precio 
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            //Generar DIV contenedor
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;
            //Selecciona Servicio para la cita
            servicioDiv.onclick = seleccionarServicios;
            //Inyectar nombre y precio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectar al HTML
            document.querySelector('#servicios').appendChild(servicioDiv)
        });

    } catch (error) {
        console.log(error);
    };
};

function seleccionarServicios(e) {

    let elemento;
    //Forzar que el elemento que clickeamos sea el DIV
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio)

        elimnarServicio(id);
    } else {
        elemento.classList.add('seleccionado')


        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        // console.log(servicioObj)


        agregarServicio(servicioObj);
    }
}
function elimnarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id)
    console.log(cita)
}
function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj]
    console.log(cita)

}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();

    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar')
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar')
        paginaAnterior.classList.remove('ocultar')

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.remove('ocultar')
    }

    mostrarSeccion();
}
function mostrarResumen() {
    //Aplicar Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    const mostrarResumen = document.querySelector('.mostrar-resumen');
    //limpiar HTML
    while(mostrarResumen.firstChild) {
        mostrarResumen.removeChild(mostrarResumen.firstChild);
    }
    //Validar los inputs
    if (Object.values(cita).includes('')) {
        const noServicio = document.createElement('P');
        noServicio.textContent = 'Faltan Datos para completar el Turno';

        noServicio.classList.add('invalidar-cita')

        
        mostrarResumen.appendChild(noServicio)
        return;
    }
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
   
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const servicioCita = document.createElement('DIV');
    servicioCita.classList.add('resumen-servicios')

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    servicioCita.appendChild(headingServicios)
    
    let cantidad = 0;
    //Iterar sobre los servicios

    servicios.forEach(servicio => {
        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio')

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio')

        const totalServicio = precio.split('$');

        cantidad += parseInt(totalServicio[1].trim())

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        servicioCita.appendChild(contenedorServicio);
    
    })
    mostrarResumen.appendChild(headingCita); 
    mostrarResumen.appendChild(nombreCita);
    mostrarResumen.appendChild(fechaCita);
    mostrarResumen.appendChild(horaCita);

    mostrarResumen.appendChild(servicioCita);

    const totalPagar = document.createElement('P');
    totalPagar.innerHTML = `<span>El total a Pagar es:</span> $${cantidad}`;
    totalPagar.classList.add('total');

    mostrarResumen.appendChild(totalPagar);

}
function nombreCita() {
    const nombreInput = document.querySelector('#nombre')

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            // console.log('Nombre si es valido')
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}
function mostrarAlerta(mensaje, tipo) {

    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta)

    setTimeout(() => {
        alerta.remove()
    }, 3000);

}
function fechaCita() {
    const fechaInput = document.querySelector('#fecha');

    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();
        
        if([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('No atendemos durante el Fin de Semana', 'error')
        } else {
            cita.fecha = fechaInput.value;
            console.log(cita)
        }
    })
}

function deshabilitaFechaAnterior() {
    const inputFecha = document.querySelector('#fecha')

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDay() + 1;
    
    const fechaDeshabilitar = `${year}-${mes}-${dia}`
    
    inputFecha.min = fechaDeshabilitar;
}
function horaCita() {
    const inputHora = document.querySelector('#hora')
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Horario no Disponible', 'error') 
             setTimeout(() => {
                inputHora.value = '';
             }, 3000);
        } else {
            cita.hora = horaCita;
            console.log(cita)
        }

        
    })
}