const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// GET - Obtener todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tareas ORDER BY id');
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
});

// GET - Obtener una tarea por ID
app.get('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
});

// POST - Crear una tarea
app.post('/tareas', async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const resultado = await pool.query(
      'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *',
      [titulo, descripcion]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
});

// PUT - Actualizar una tarea
app.put('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, completada } = req.body;
    const resultado = await pool.query(
      'UPDATE tareas SET titulo = $1, descripcion = $2, completada = $3 WHERE id = $4 RETURNING *',
      [titulo, descripcion, completada, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
});

// DELETE - Eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('DELETE FROM tareas WHERE id = $1 RETURNING *', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
});

app.listen(PORT, () => {
  console.log('Servidor en http://localhost:' + PORT);
});