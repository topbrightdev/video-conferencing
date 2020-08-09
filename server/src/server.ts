import express from 'express';

const PORT = 8081;
const app = express();

app.get('/echo', (req, res) => {
    res.send('Echo From server');
});

app.listen(PORT, () => {
    console.log(`Server started at port : ${PORT}`);
});
