document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.querySelector(".form-register");
    const alertaError = formRegister.querySelector(".alerta-error");
    const alertaExito = formRegister.querySelector(".alerta-exito");

    formRegister.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        // Recopila los datos del formulario
        const formData = new FormData(formRegister);
        const userData = {
            name: formData.get("userName"),
            email: formData.get("userEmail"),
            password: formData.get("userPassword"), // ¡Recuerda hashear esto!
            profile: {
                age: parseInt(formData.get("age")),
                phone: formData.get("phone"),
                address: {
                    street: formData.get("street"),
                    city: formData.get("city"),
                    postalCode: formData.get("postalCode"),
                    country: formData.get("country")
                }
            },
            id: null, // Se generaría en el backend o de forma incremental si es solo local
            createdAt: new Date().toISOString(),
            isActive: true,
            role: "cliente" // Por defecto
        };

        // Simple validación de ejemplo (deberías mejorarla)
        // Se valida que los campos esenciales no estén vacíos.
        if (!userData.name || !userData.email || !userData.password ||
            isNaN(userData.profile.age) || !userData.profile.phone ||
            !userData.profile.address.street || !userData.profile.address.city ||
            !userData.profile.address.postalCode || !userData.profile.address.country) {

            alertaError.style.display = "block";
            alertaExito.style.display = "none";
            return;
        } else {
            alertaError.style.display = "none";
        }

        // Aquí iría la lógica para hashear la contraseña y guardar el usuario.
        // Si no tienes un backend, esto se vuelve más complejo para persistir los datos
        // de forma segura en un JSON local y sería más para un entorno de aprendizaje.
        // En un entorno real, enviarías 'userData' (con la contraseña hasheada) a una API.

        console.log("Datos del nuevo usuario a registrar:", userData);
        alertaExito.style.display = "block";
        formRegister.reset(); // Limpia el formulario
    });
});