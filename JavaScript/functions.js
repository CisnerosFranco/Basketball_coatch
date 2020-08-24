const regExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ // validacion de mail
const regAlfabeto = /^[a-zA-Z ]+$/ //varificaion de alfabeto y espacio
const regAlfaNumerico = /^\w+$/
const regNumero = /^\d+$/


function ajax(elemento) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest;
        xhr.open('get', elemento);
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
            else {
                reject('hubo un problema en el pedido');
            }
        }
        xhr.send();
    })
}



function validarLogin(user, pass) {
    user.setCustomValidity('');
    pass.setCustomValidity('');
    let nombre = user.value.trim();
    for(let i=0; i<Object.keys(localStorage).length; i++){
        let localUser = JSON.parse(localStorage.getItem(Object.keys(localStorage)[i]));
        if(localUser.nombre === nombre || localUser.mail  === nombre){
            if (localUser.password != pass.value) {
                pass.setCustomValidity('el password no coincide con el usuario ' + nombre);
                return false;
            }
            return true;
        }
    }
    user.setCustomValidity('el usuario ingresado no se encuentra registrado');
    return false;  
}



function existeLocalStorage() {
    return localStorage ? true : false;
}

function existeUser(nombre) {
    return localStorage.getItem(nombre) != null;
}


function existeMail(mail) {
    for(let i=0; i<Object.keys(localStorage).length; i++){
        let localUser = JSON.parse(localStorage.getItem(Object.keys(localStorage)[i]));
        if(localUser.mail === mail){
            return true;
        }
    }
    return false;
}
 

function validNombre(elemento) {
    elemento.setCustomValidity('');
    let valor = elemento.value.trim();
    let cont = 0;
    if(!elemento.value || elemento.value.trim().length < 4 || elemento.value.trim().length > 20){
        elemento.setCustomValidity('el nombre debe contener entre 4 y 20 letras');
        return false;
    }
    for (let i = 0; i < valor.length; i++) {
        if (valor.charAt(i) === ' ') {
            cont++;
        }
        if (cont > 1) {
            elemento.setCustomValidity(" el nombre debe contener solo letras, como minimo 4 y como mucho un espacio");
            return false;
        }
    }
    if (valor.length < 4 || !regAlfabeto.test(valor)) {
        elemento.setCustomValidity(" el nombre debe contener solo letras, como minimo 4 y como mucho un espacio");
        return false;
    }
    elemento.setCustomValidity("");
    return true;
}

function validMail(elemento) {
    elemento.setCustomValidity('');
    let valor = elemento.value.trim();
    if (valor.length < 4 && !regExpEmail.test(valor)) {
        elemento.setCustomValidity('se deben cumplir las reglas de nombre@dominio.com');
        return false;
    }
    elemento.setCustomValidity('');
    return true;
}

function validPass(elemento) {
    elemento.setCustomValidity('');
    let valor = elemento.value.trim();
    if (!regAlfaNumerico.test(valor) || valor.length < 6) {
        elemento.setCustomValidity('la contraseña solo acepta letras y numeros, como minimo 6 caracteres');
        elemento.value = '';
        return false;
    }
    elemento.setCustomValidity("");
    return true;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
}

function soloNumeros(mesage){
    return !mesage ? false : regNumero.test(mesage);
}



//user

function liberar(elem){
    elem.addEventListener('blur', event => {
        elem.setCustomValidity('');
    })
}

function actualizarDB(usuario) {
    localStorage.setItem(usuario.nombre, JSON.stringify(usuario));
    dibujarUser(usuario)
}

function dibujarUser(user) {
    let usuario = user;
    const iconUser = document.getElementById('icon-user');
    const nombreUser = document.getElementById('nombre-user');
    const tabla = document.getElementById('text-body');
    tabla.innerHTML = ''

    iconUser.src = usuario.image;
    nombreUser.innerHTML = usuario.nombre;
    let jugadores = usuario.listaJugadores;
    
    if(jugadores.length < 1 ){
        let tr = document.createElement('tr');
            tr.classList.add('item-grid');
            let thLegajo = document.createElement('th');
            let tdNombre = document.createElement('td');
            let tdTiros = document.createElement('td');
            let tdEficiencia = document.createElement('td');
    
            thLegajo.innerHTML = 'vacio';
            tdNombre.innerHTML = 'vacio';
            tdTiros.innerHTML = 'vacio';
            tdEficiencia.innerHTML = 'vacio';
            
            tr.appendChild(thLegajo);
            tr.appendChild(tdNombre);
            tr.appendChild(tdTiros);
            tr.appendChild(tdEficiencia);
            tabla.appendChild(tr);
    }
    else{
        jugadores.forEach(elem =>{
            let tr = document.createElement('tr');
            tr.classList.add('item-grid');
            let thLegajo = document.createElement('th');
            let tdNombre = document.createElement('td');
            let tdTiros = document.createElement('td');
            tdTiros.classList.add('item-tiros');
            let tdEficiencia = document.createElement('td');
    
            thLegajo.innerHTML = elem.legajo;
            tdNombre.innerHTML = elem.nombre;
            tdTiros.innerHTML = `${String(elem.tiros.length)} <span class="material-icons mostrar-tiros">
                                                                offline_bolt
                                                              </span>`
            tdEficiencia.innerHTML = eficienciaJugador(elem);
            
            tr.appendChild(thLegajo);
            tr.appendChild(tdNombre);
            tr.appendChild(tdTiros);
            tr.appendChild(tdEficiencia);
            tabla.appendChild(tr);
        })
    }
}


function dibujarTiros(jugador, gridTiros) {
    let listaTiros = jugador.tiros;
    if(listaTiros.length < 1 ){
        let tr = document.createElement('tr');
        tr.classList.add('item-grid');
        let thLegajo = document.createElement('th');
        let tdPosicion = document.createElement('td');
        let tdMetros = document.createElement('td');
        let tdAcerto = document.createElement('td');

        thLegajo.innerHTML = String(jugador.legajo);
        tdPosicion.innerHTML = '--'
        tdMetros.innerHTML = '--'
        tdAcerto.innerHTML = '--'
        
        tr.appendChild(thLegajo);
        tr.appendChild(tdPosicion);
        tr.appendChild(tdMetros);
        tr.appendChild(tdAcerto);
        gridTiros.appendChild(tr);
    }
    else{
        listaTiros.forEach(elem => {
            let tr = document.createElement('tr');
            tr.classList.add('item-grid');
            let thLegajo = document.createElement('th');
            let tdPosicion = document.createElement('td');
            let tdMetros = document.createElement('td');
            let tdAcerto = document.createElement('td');
    
            thLegajo.innerHTML = String(elem.lanzador);
            tdPosicion.innerHTML = String(elem.posicion);
            tdMetros.innerHTML = String(elem.metros);
            tdAcerto.innerHTML = String(elem.acerto);
    
            tr.appendChild(thLegajo);
            tr.appendChild(tdPosicion);
            tr.appendChild(tdMetros);
            tr.appendChild(tdAcerto);
            gridTiros.appendChild(tr);
        });
    }
}

function eficienciaJugador(jugador) {
    let acertados = 0;
    jugador.tiros.forEach(elem => {
        if(elem.acerto === 'si'){
            acertados++;
        }
    })
    return acertados + '/' + jugador.tiros.length;
}


function existeLegajo(usuario, legajo){
    let listaJugadores = usuario.listaJugadores;
    for(let i=0; i< listaJugadores.length; i++) {
        if(listaJugadores[i].legajo == legajo) {
            return true;
        }
    }
    return false;
}



function getUsuario(nombre) {
    return JSON.parse(localStorage.getItem(nombre));
}

function agregarJugador(coatch, nombre, legajo){
    coatch.listaJugadores.push(jugador(nombre, legajo));
    alert('el jugador se agrego con exito');
}

function agregarTiro(lanzador, posicion, metros, acerto){
    lanzador.tiros.push(tiro(lanzador.legajo, posicion, metros, acerto));
    alert('el tiro se agrego con exito')
}

function getJugador(user, legajo) {
    let lista = user.listaJugadores;
    for(let i=0; i < lista.length; i++) {
        if(lista[i].legajo === legajo){
            return lista[i];
        }
    }
    return false;
}


function mostrarTiros(){
    let containerTiros = document.getElementById('container-tiros');
    let gridTiros = document.getElementById('body-tiros');
    let btnMostrar = document.querySelectorAll('.mostrar-tiros')
    let usuario = getUsuario(usuarioActual);
    btnMostrar.forEach(btn => {
        btn.addEventListener('click', () => {
            containerTiros.classList.remove('d-none');
            gridTiros.innerHTML = '';
            let legajo = Number(btn.parentNode.parentNode.children[0].innerHTML);
            let jugador = getJugador(usuario, legajo);
            dibujarTiros(jugador, gridTiros);
        })
    })
}

//objets

function coatch(nombre, email, password, img_path) {
    return {
        nombre : nombre,
        mail : email,
        password : password,
        image : img_path,
        listaJugadores: []
    }
}

function jugador(nombre, legajo){
    return {
        nombre : nombre,
        legajo : legajo,
        tiros : []
    }
}

function tiro(lanzadorLegajo, posicion, metros, acerto){
    return {
        lanzador : lanzadorLegajo,
        posicion: posicion,
        metros : metros,
        acerto : acerto
    }
}


