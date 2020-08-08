import express from 'express';

const PORT = 8000;
const app = express();

app.get('/echo', (req, res) => {
    res.send('Echo From server');
});

app.listen(8000, () => {
    console.log(`Server started at port : ${PORT}`);
});
