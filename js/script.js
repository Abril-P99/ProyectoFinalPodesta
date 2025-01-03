// Obtenemos la base de datos de usuarios (en este caso localStorage)
const usersDatabase = JSON.parse(localStorage.getItem('users')) || [];

// Función para simular el inicio de sesión
function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        const user = usersDatabase.find(user => user.username === username && user.password === password);
        if (user) {
            // Guardamos el usuario en localStorage cuando se loguea
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            resolve('Inicio de sesión exitoso');
        } else {
            reject('Usuario o contraseña incorrectos');
        }
    });
}

// Manejo del evento de inicio de sesión en index.html
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita el comportamiento por defecto del formulario
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    loginUser(username, password)
        .then(message => {
            alert(message);  // Mensaje de éxito
            window.location.href = 'tienda.html';  // Redirige a la tienda
        })
        .catch(error => {
            alert(error);  // Mensaje de error
        });
});

// Función para registrar un usuario
function registerUser(username, email, password) {
    return new Promise((resolve, reject) => {
        // Verificar si el nombre de usuario ya existe
        if (usersDatabase.some(user => user.username === username)) {
            reject('El nombre de usuario ya está registrado');
        } else {
            // Agregar el nuevo usuario
            const newUser = { username, email, password };
            usersDatabase.push(newUser);
            localStorage.setItem('users', JSON.stringify(usersDatabase)); // Guardamos los usuarios en el localStorage
            resolve('Usuario registrado con éxito');
        }
    });
}

// Manejo del evento de registro en registro.html
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita el comportamiento por defecto del formulario

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    registerUser(username, email, password)
        .then(message => {
            alert(message);  // Mensaje de éxito
            window.location.href = '../index.html';  // Redirige al inicio de sesión después de registrar
        })
        .catch(error => {
            alert(error);  // Mensaje de error
        });
});