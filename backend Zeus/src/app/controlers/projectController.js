const express = require('express');
const authMiddleware = require('../../middlewares/auth');
const Cachorro = require('../../models/cachorro');
const Compra = require('../../models/compra');
const User = require('../../models/user');


const router = express.Router();

router.use(authMiddleware)

router.get('/', async (req, res) =>{
    try{
        const cachorros = await Cachorro.find().populate(['user', 'compras']);

        return res.send({ cachorros })
    } catch(err){
        return res.status(400).send({ error: 'Error loading cachorros' })
    }
});

router.get('/:cachorroId', async (req,res) =>{
    try{
        const cachorro = await Cachorro.findById(req.params.cachorroId).populate(['user', 'compras']);
        return res.send({ cachorro })
    } catch(err){
        return res.status(400).send({ error: 'Error loading cachorro' })
    }
});

router.get('/user/:userId', async (req, res) =>{
    try{
        const userCachorros = await Cachorro.find({user: {_id:req.params.userId}}).populate(['user', 'compras']);

        return res.send({ userCachorros })
    } catch(err){
        return res.status(400).send({ error: 'Error loading user cachorros' })
    }
});

router.post('/', async (req,res) =>{
    try{
        const { title, description, compras } = req.body;

        const cachorro = await Cachorro.create({ title, description, user: req.userId});

        await Promise.all(compras.map(async compra =>{
            const cachorroCompra = new Compra({...compra, cachorro: cachorro._id});

            await cachorroCompra.save();
            
            cachorro.compras.push(cachorroCompra);
        }));


        await cachorro.save();


        return res.send({ cachorro });
    } catch (err){
        return res.status(400).send({ error: 'Error creating new cachorro' })
    }
});

router.put('/:cachorroId', async (req,res) =>{
    try{
        const { title, description, compras } = req.body;

        const cachorro = await Cachorro.findByIdAndUpdate(req.params.cachorroId, { 
            title, 
            description, 
            }, { new: true });


        cachorro.compras = [];
        await Compra.deleteMany({cachorro: cachorro._id});
        

        await Promise.all(compras.map(async compra =>{
            if(compra.createdAt){
                const [day, month, year] = compra.createdAt.split("/");
                compra.createdAt = [month, day, year].join("/");
            }
            const cachorroCompra = new Compra({...compra, cachorro: cachorro._id});

            await cachorroCompra.save();
            
            cachorro.compras.push(cachorroCompra);
        }));


        await cachorro.save();


        return res.send({ cachorro });
    } catch (err){
        return res.status(400).send({ error: 'Error uptading cachorro' })
    }
});

router.delete('/:cachorroId', async (req,res) =>{
    try{
        const cachorros = await Cachorro.findByIdAndRemove(req.params.cachorroId);

        return res.send()
    } catch(err){
        return res.status(400).send({ error: 'Error deleting cachorro' })
    }
});


module.exports = app => app.use('/cachorros', router)