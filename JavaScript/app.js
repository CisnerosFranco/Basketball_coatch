(function () {
    const container = document.getElementById('container');
    const listaImg = ['nuclear-explosion', 'nuclear', 'nuclear-sign', 'bacterium', 'virus-2', 'radio', 'physics', 'virus']
    let usuarioActual;

    document.addEventListener('DOMContentLoaded', (event) => {
        event.preventDefault();
        ajax('form_login.html')
            .then(resp => {
                container.innerHTML = resp;
                history.pushState(null, '', 'form_login')
                loginInit();
            })
            .catch(error => {
                console.log(error);
            })
    })



    //----------------------------------
    window.addEventListener("popstate", () => {
        let ubicacion = location.pathname.split('/')[1];
        let url = ubicacion + ".html"; // este contiene el url actual
        ajax(url)
            .then(resp => {
                container.innerHTML = resp;
                if (ubicacion === 'form_login') {
                    loginInit();
                }
                else if (ubicacion === 'form_signin') {
                    signinInit();
                }
                else if (ubicacion === 'dashboard') {
                    dibujarUser(getUsuario(usuarioActual));
                    mostrarTiros();
                    dasboardInit();
                }
            })
    })



    function loginInit() {
        let login = document.querySelector('.form-login');
        let loginUser = document.getElementById('login-user');
        let loginPass = document.getElementById('login-pass');
        let registrar = document.getElementById('signin');

        liberar(loginUser);
        liberar(loginPass);

        registrar.addEventListener('click', (event) => {
            event.preventDefault();
            ajax('form_signin.html')
                .then(resp => {
                    container.innerHTML = resp;
                    history.pushState(null, '', 'form_signin')
                    signinInit();
                })
                .catch(error => {
                    console.log(error);
                })
        }, true)

        login.addEventListener('submit', (event) => {
            loginUser.setCustomValidity('');
            loginPass.setCustomValidity('');
            event.preventDefault();
            let validacion = validarLogin(loginUser, loginPass);

            if (validacion) {
                loginUser.setCustomValidity('');
                loginPass.setCustomValidity('');
                ajax('dashboard.html')
                    .then(resp => {
                        container.innerHTML = resp;
                        history.pushState(null, '', 'dashboard')
                        usuarioActual = loginUser.value.trim();
                        dibujarUser(getUsuario(usuarioActual));
                        mostrarTiros();
                        dasboardInit();
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }

        })

    }



    function signinInit() {
        const signin = document.querySelector('.form-signin');
        const signUser = document.getElementById('signin-user');
        const signPass = document.getElementById('signin-pass');
        const mail = document.getElementById('email');
        const alerta = document.getElementById('alert');

        liberar(signPass);
        liberar(signUser);
        liberar(mail);

        signin.addEventListener('submit', event => {
            event.preventDefault();
            let pathImg = 'images/'
            let userName = signUser.value.trim();
            let userMail = mail.value.trim();
            let userPass = signPass.value.trim();

            if (!existeLocalStorage) {
                alerta('tu navegador no acepta local Storage, por favor actualiza a una version mas reciente')
            }
            else {
                if (existeUser(userName)) {
                    alerta.innerHTML = 'el nombre de usuario ingresado ya se encuentra registrado';
                    alerta.classList.remove('d-none');
                }
                else if (existeMail(userMail)) {
                    alerta.innerHTML = 'el mail ingresado ya se encuentra registrado';
                    alerta.classList.remove('d-none');
                }
                else if (validNombre(signUser) && validMail(mail) && validPass(signPass)) {
                    pathImg += listaImg[getRandomInt(0, listaImg.length - 1)] + '.png';
                    let nuevoUser = coatch(userName, userMail, userPass, pathImg);
                    localStorage.setItem(userName, JSON.stringify(nuevoUser));
                    ajax('dashboard.html')
                        .then(resp => {
                            usuarioActual = userName;
                            container.innerHTML = resp;
                            dibujarUser(getUsuario(usuarioActual));
                            history.pushState(null, '', 'dashboard');
                            dasboardInit();
                            alert('la cuenta se a creado con exito');
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            }
        })

    }






    function dasboardInit() {
        const btn_Exit = document.getElementById('exit');
        const btnToggle = document.getElementById('btn-toggle');
        const menu = document.getElementById('menu');
        const btnJugador = document.getElementById('btn-add-Jugador');
        const btnTiro = document.getElementById('btn-add-Tiro');

        const formJugador = document.getElementById('form-add-jugador');
        const addJugador = document.getElementById('add-Jugador');
        const addLegajo = document.getElementById('add-Legajo');

        const formTiro = document.getElementById('form-add-tiro');
        const legajoLanzador = document.getElementById('legajoDelLanzador');
        const metrosTiro = document.getElementById('metros-tiro');
        const posicionLanzador = document.getElementById('posicion-lanzamiento');
        const encestoLanzamiento = document.getElementById('encesto-lanzamiento');

        const descender = 'descenderForm';
        let usuario = getUsuario(usuarioActual);



        liberar(addJugador);
        liberar(addLegajo)
        liberar(legajoLanzador);
        liberar(metrosTiro);
        liberar(posicionLanzador);
        liberar(encestoLanzamiento);

        btnToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            menu.classList.toggle('d-block');
        })

        btn_Exit.onclick = function () {
            let url = 'form_login.html'
            ajax(url)
                .then(resp => {
                    container.innerHTML = resp;
                    history.pushState(null, '', 'form_login');
                    loginInit();
                })
        }

        document.addEventListener('click', (event) => {
            let elemento = event.target;
            if (menu.classList.contains('d-block') && elemento.parentNode.tagName != 'LI' && elemento.parentNode.parentNode.id != 'menu' && elemento.parentNode.id != 'menu') {
                menu.classList.toggle('d-block');
            }
        })

        btnJugador.addEventListener('click', (e) => {
            formJugador.parentNode.classList.toggle(descender)
        }, false)

        btnTiro.addEventListener('click', (e) => {
            e.stopPropagation();
            formTiro.parentNode.classList.toggle(descender)
        }, false)

        document.addEventListener('click', event => {
            if (event.target.classList.contains(descender)) {
                event.target.classList.remove(descender)
                legajoLanzador.value = '';
                metrosTiro.value = '';
                encestoLanzamiento.value = encestoLanzamiento.children[0].value;
                encestoLanzamiento.value = encestoLanzamiento.children[0].value;
                addJugador.value = '';
                addLegajo.value = '';
            }
        })


        formJugador.addEventListener('submit', event => {
            event.preventDefault();
            let legajoValor = Number(addLegajo.value);
            if (validNombre(addJugador)) {
                if (!soloNumeros(legajoValor) || legajoValor.length < 1 || legajoValor.length > 5) {
                    addLegajo.setCustomValidity('solo se aceptan numeros positivos entre 1 y 5 digitos');
                }
                else if (existeLegajo(usuario, legajoValor)) {
                    addLegajo.setCustomValidity('ya existe un jugador con ese legajo')
                }
                else {
                    agregarJugador(usuario, addJugador.value.trim(), legajoValor)
                    actualizarDB(usuario);
                    mostrarTiros();
                    addJugador.value = '';
                    addLegajo.value = '';
                }
            }
        })

        formTiro.addEventListener('submit', event => {
            event.preventDefault();
            let legajo = Number(legajoLanzador.value);
            if (!soloNumeros(legajo) || legajo.length < 1 || legajo.length > 5) {
                legajoLanzador.setCustomValidity('los legajos contienen numeros positivos, entre 1 y 5 digitos')
            }
            else if (!existeLegajo(usuario, legajo)) {
                legajoLanzador.setCustomValidity('no se encuentra registrado el legajo ingresado')
            }
            else {
                if (!soloNumeros(metrosTiro.value) || metrosTiro.value < 1 || metrosTiro.value > 60) {
                    metrosTiro.setCustomValidity('los metros se indican con valores entre 1 y 60');
                }
                if (posicionLanzador.value === posicionLanzador.children[0].value) {
                    posicionLanzador.setCustomValidity('se debe completar este campo')
                }
                if (encestoLanzamiento.value === encestoLanzamiento.children[0].value) {
                    encestoLanzamiento.setCustomValidity('se debe completar este campo')
                }
                else {
                    let jugador = getJugador(usuario, legajo);
                    agregarTiro(jugador, metrosTiro.value, posicionLanzador.value, encestoLanzamiento.value)
                    actualizarDB(usuario);
                    mostrarTiros();
                    legajoLanzador.value = '';
                    metrosTiro.value = '';
                    encestoLanzamiento.value = encestoLanzamiento.children[0].value;
                    encestoLanzamiento.value = encestoLanzamiento.children[0].value;
                }
            }
        })
    }

})();


