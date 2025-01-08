// Simulamos la obtención de los usuarios desde un archivo JSON utilizando fetch
async function getUsersFromFile() {
    try {
        const response = await fetch('usuarios.json');  // Cargar datos desde el archivo JSON
        const data = await response.json();
        return data.users;  // Retorna los usuarios
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        return [];  // En caso de error, retornamos un array vacío
    }
}

// Función para simular el inicio de sesión
async function loginUser(username, password) {
    const usersDatabase = await getUsersFromFile();  // Obtener usuarios desde el archivo JSON
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
async function registerUser(username, email, password) {
    const usersDatabase = await getUsersFromFile();  // Obtener usuarios desde el archivo JSON
    return new Promise((resolve, reject) => {
        // Verificar si el nombre de usuario ya existe
        if (usersDatabase.some(user => user.username === username)) {
            reject('El nombre de usuario ya está registrado');
        } else {
            // Agregar el nuevo usuario
            const newUser = { username, email, password };
            usersDatabase.push(newUser);
            
            // Guardamos los usuarios en el archivo JSON simulando con un POST (este paso solo es en el cliente)
            fetch('usuarios.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ users: usersDatabase }),
            })
            .then(response => response.json())
            .then(() => {
                resolve('Usuario registrado con éxito');
            })
            .catch(() => reject('Hubo un problema al registrar el usuario'));
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