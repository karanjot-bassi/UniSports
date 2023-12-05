const express = require('express');
const path = require('path');

const app = express();



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
})

app.get('/shome', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/shome.html'));
})

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/settings.html'));
})

app.get('/equipment', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/equipment.html'));
})

app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/book.html'));
})

app.get('/programs', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/programs.html'));
})

app.get('/adminsignin', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/adminsignin.html'));
})

app.get('/adminhome', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/adminhome.html'));
})

app.get('/studentLU', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/studentLU.html'));
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});