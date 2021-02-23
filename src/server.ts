import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req,res)=>{
    return res.json({ mensagem: 'Hello World! NLW' });
});

app.post('/', (req,res)=>{
    
    return res.json({ mensagem: "Os dados foram salvos"});
})

app.listen(PORT, ()=>console.log('Servidor rodando'));