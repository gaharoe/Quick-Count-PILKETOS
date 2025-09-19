const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const ejsLayouts = require('express-ejs-layouts');
const fs = require('fs');

const dataVote = JSON.parse(fs.readFileSync("./data/vote.json"))
console.log(dataVote);
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(ejsLayouts);
app.set('view engine', 'ejs');

io.on('connection', socket => {
    data = [
        dataVote.paslon1,
        dataVote.paslon2,
        dataVote.paslon3
    ];
    io.of('/').emit('updateChart', data);

    console.log(socket.id);
    socket.on('disconnect', () => {
        console.log("disconnected");
    });
    socket.on('vote', (data) => {
        dataVote.paslon1+=data[0];
        dataVote.paslon2+=data[1];
        dataVote.paslon3+=data[2];
        console.log(dataVote);
        data = [
            dataVote.paslon1,
            dataVote.paslon2,
            dataVote.paslon3
        ]
        io.of('/').emit('updateChart', data);
        fs.writeFileSync('./data/vote.json', JSON.stringify(dataVote));
    })

});

app.get('/', (req, res) => {
    res.render('page/chart', {
        layout: "layouts/mainLayout"
    });
});

app.get('/entry', (req,res) => {
    res.render('page/entry', {
        layout: "layouts/mainLayout"
    });
});

http.listen(80, () => {
    console.log("** server running **");
});