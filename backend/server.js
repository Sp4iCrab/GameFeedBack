require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos', err);
        return;
    }
    console.log('Conectado a MySQL');
});


app.post('/register', (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const checkEmailQuery = "SELECT * FROM usuarios WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error("Error verificando el email:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        const checkNombreQuery = "SELECT * FROM usuarios WHERE nombre = ?";
        db.query(checkNombreQuery, [nombre], (err, results) => {
            if (err) {
                console.error("Error verificando el usuario:", err);
                return res.status(500).json({ error: "Error en el servidor" });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "El nombre del usuario ya está registrado" });
            }

            const insertQuery = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
            db.query(insertQuery, [nombre, email, password], (err, result) => {
                if (err) {
                    console.error("Error al registrar usuario:", err);
                    return res.status(500).json({ error: "Error al registrar usuario" });
                }
                res.status(201).json({ message: "Usuario registrado correctamente" });
            });
        });
    });
});


app.post('/login', (req, res) => {
    const {nombre, password } = req.body;

    if (!nombre || !password) {
        return res.status(400).json({error: 'Todos los campos son obligatorios'});
    }

    const checkQuery = "SELECT * FROM usuarios WHERE nombre = ?";
    db.query(checkQuery, [nombre], (err, results) => {
        if (err) {
            console.error("Error verificando el usuario", err);
            return res.status(400).json({error: "Erorr en el servidor"});
        }

        if (results.length === 0) {
            return res.status(400).json({error: "El usuario no esta registrado"});
        }

        if (results[0].password !== password) {
            return res.status(401).json({ error: "Contraseña incorrecta"});
        }

        res.status(200).json({ message: "Inicio de sesion exitoso", usuario: results[0]});
    });

});

app.post("/comentarios", (req, res) =>{
    const {usuario, comentario, puntuacion, juego_id} = req.body;

    if (!usuario || !comentario || !puntuacion || !juego_id ) {
        return res.status(400).json({error: "Todos los campos son obligatorios"})
    }

    const queryUsuario = "SELECT id FROM usuarios WHERE nombre = ?";
    db.query(queryUsuario, [usuario], (err, results) =>{
        if (err || results.length === 0) {
            return res.status(400).json({error: "Usuario no encontrado"});
        }

        const usuario_id = results[0].id;
        const insertQuery = "INSERT INTO reviews (usuario_id, juego_id, comentario, puntuacion, fecha) VALUES (?, ?, ?, ?, NOW())";

        db.query(insertQuery, [usuario_id, juego_id, comentario, puntuacion], (err) =>{
            if (err) {
                console.error("Error al guardar comentario", err)
                return res.status(500).json({error: "Error al guaurdar comentario", detalle: err.message});
            }
            res.status(201).json({message: "Comentario guardado correctamente"});

        });
    });
});

app.get("/comentarios", (req, res) =>{
    const { juego_id } = req.query;

    if (!juego_id){
        return res.status(400).json({error: "Se requiere ID del juego"});
    }

    const query = `
        SELECT usuarios.nombre AS usuario, reviews.comentario, reviews.puntuacion, reviews.fecha 
        FROM reviews 
        JOIN usuarios ON reviews.usuario_id = usuarios.id 
        WHERE reviews.juego_id = ? 
        ORDER BY reviews.fecha DESC
    `;

    db.query(query, [juego_id], (err, results) =>{
        if (err) {
            return res.status(500).json({error: "Error al obtener comentario"});
        }
        res.json(results);
    });


});

app.get("/puntuacion", (req, res) =>{
    const {juego_id} = req.query;

    if (!juego_id) {
        return res.status(400).json({error: "Se requiere el ID del juego"});
    }

    const query = `
        SELECT AVG(puntuacion) AS promedio_puntuacion 
        FROM reviews 
        WHERE juego_id = ?

    `;

    db.query(query, [juego_id], (err, results) =>{
        if (err){
            return res.status(500).json({error: "Error al obtener la puntuacion"});
        }
        res.json({promedio: results[0].promedio_puntuacion || 0 });
    });
});

app.listen(3000, () =>{
    console.log('Servidor corriendo en http://localhost:3000')
});

