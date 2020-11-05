require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json({ extended: false }));
app.use(express.static('files'));

//Define routes
app.use('/pdf/farmerprofile', require('./routes/pdf/farmerprofile'));

app.get('/', (req,res) => res.send('API Running'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); //hanya bisa diakses dari localhost