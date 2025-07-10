const btnSignIn = document.getElementById("sign-in"),
      btnSignUp = document.getElementById("sign-up"),
      containerFormRegister = document.querySelector(".register"),
      containerFormLogin = document.querySelector(".login");

// Duración de la transición en CSS (0.8s = 800ms)
const transitionDuration = 800; // Coincide con la duración en CSS

// Función para cambiar de tarjeta con animación de deslizamiento
function switchCards(cardToHide, cardToShow) {
    // 1. Iniciar la animación de salida de la tarjeta actual (desaparece por abajo)
    // Se añade la clase 'move-to-bottom' que define el fin de la animación de salida
    cardToHide.classList.add("move-to-bottom");
    // Se asegura de que no tenga la clase 'hide' para que 'move-to-bottom' se aplique y anime
    cardToHide.classList.remove("hide");

    // 2. Prepara la tarjeta que va a aparecer (la posiciona arriba y oculta)
    // Se añade la clase 'move-from-top' que define el inicio de la animación de entrada
    cardToShow.classList.add("move-from-top");
    // Se asegura de que no tenga la clase 'hide' para que 'move-from-top' se aplique.
    // Aunque move-from-top ya la oculta, quitar 'hide' es para la lógica de la animación.
    cardToShow.classList.remove("hide");


    // 3. Después de un breve momento para que el navegador procese los estados iniciales
    //    y la tarjeta saliente inicie su animación, iniciamos la animación de entrada.
    //    El pequeño delay de 50ms es para asegurar que el navegador registre los estilos
    //    de las clases 'move-to-bottom' y 'move-from-top' antes de que los quitemos
    //    para iniciar la transición.
    setTimeout(() => {
        // Quita la clase que la posicionó arriba, para que transicione a su posición central.
        // La transición definida en .container-form se encarga de la animación.
        cardToShow.classList.remove("move-from-top");

        // Después de que la tarjeta saliente haya completado su animación, la limpiamos.
        // Este setTimeout anidado es crucial para la sincronización.
        setTimeout(() => {
            // Elimina la clase de movimiento de la tarjeta que ya salió.
            cardToHide.classList.remove("move-to-bottom");
            // Vuelve a añadir la clase 'hide' a la tarjeta que se ocultó,
            // dejándola en un estado "limpio" y lista para una futura aparición.
            cardToHide.classList.add("hide");
        }, transitionDuration); // Espera la duración completa de la animación de salida para limpiar.

    }, 50); // Pequeño retraso inicial para aplicar los estilos de setup
}


// Listener para el botón "Iniciar Sesión" (en la tarjeta de registro)
btnSignIn.addEventListener("click", e => {
    switchCards(containerFormRegister, containerFormLogin);
});

// Listener para el botón "Registrarse" (en la tarjeta de login)
btnSignUp.addEventListener("click", e => {
    switchCards(containerFormLogin, containerFormRegister);
});

// Manejo inicial al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    // 1. Asegura que el formulario de login esté en su estado inicial (fuera de vista arriba y oculto)
    // al cargar la página.
    containerFormLogin.classList.add('move-from-top');
    containerFormLogin.classList.add('hide'); // Asegura que esté oculta y no interactuable desde el inicio.
    
    // 2. Asegura que el formulario de registro esté visible y en su posición central
    // (quitando cualquier clase de ocultamiento o movimiento).
    containerFormRegister.classList.remove('move-from-top');
    containerFormRegister.classList.remove('move-to-bottom');
    containerFormRegister.classList.remove('hide'); // Quita la clase 'hide' si por alguna razón la tuviera
    // Estas dos líneas pueden ser redundantes si tu CSS principal de .container-form ya los establece.
    // containerFormRegister.style.visibility = 'visible';
    // containerFormRegister.style.pointerEvents = 'auto';
});

// --- REITERACIÓN IMPORTANTE SOBRE register.js y login.js ---
// Es FUNDAMENTAL que los scripts 'register.js' y 'login.js' (y cualquier otro)
// NO manipulen directamente las clases CSS ('hide', 'move-from-top', 'move-to-bottom')
// ni las propiedades de estilo 'visibility', 'opacity', 'pointer-events', 'transform'
// de los elementos '.container-form.register' y '.container-form.login'.
// Su lógica debe estar estrictamente limitada a la validación de formularios,
// el manejo de errores/éxitos internos del formulario, y el envío de datos.
// Cualquier manipulación de visibilidad o posición de los contenedores principales
// debe hacerse EXCLUSIVAMENTE a través de este 'script.js' y 'style.css'.