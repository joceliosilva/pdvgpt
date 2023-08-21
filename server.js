const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // Importe o SQLite

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// Crie ou abra o banco de dados
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado ao banco de dados.');
  }
});

// Crie as tabelas (se não existirem)
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL
)`);

// Rota padrão que redireciona para a página de login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
  res.sendFile(__dirname + '/cadastro.html');
});
// Rota para a página inicial
app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/cadastro-sucesso', (req, res) => {
  res.sendFile(__dirname + '/cadastro-sucesso.html');
});

// Rota para processar o formulário de cadastro
app.post('/cadastrar', (req, res) => {
  const { username, password } = req.body;

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      res.send('Erro ao cadastrar o usuário.');
    } else {
     res.redirect('/cadastro-sucesso');

    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err) {
      res.send('Erro ao verificar as credenciais.');
    } else if (user) {
     res.redirect('/index');
    } else {
      res.send('Credenciais inválidas. Tente novamente.');
    }
  });
}); 
// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}/`);
});
