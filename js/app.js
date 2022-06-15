const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

const obtenerCripto = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCripto();

    formulario.addEventListener('submit', submitFomulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function consultarCripto() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
    .then( respuesta => respuesta.json() )
    .then( resultado => obtenerCripto(resultado.Data) )
    .then( criptomonedas => selectCripto(criptomonedas) )
}

function selectCripto(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    } )
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    
}

function submitFomulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Se requieren ambos campos');
        return;
    }

    consultarAPI();
}

function mostrarAlerta(mensaje) {

    const existeError = document.querySelector('.error');

    if(!existeError) {

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
    .then( respuesta => respuesta.json() )
    .then( cotizacion => {
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    } )
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML();

    const { PRICE, OPENDAY, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const inicio = document.createElement('p');
    inicio.innerHTML = `<p>Precio inicial del dia: <span>${HIGHDAY}</span></p>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio mas alto del dia: <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio mas bajo del dia: <span>${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variacion ultimas 24hs: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Ultima actualizacion: <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(inicio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;

    resultado.appendChild(spinner);
}