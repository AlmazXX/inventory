import {Router} from "express";

const locationsRouter = Router();

locationsRouter.get('/', (req, res) => {
    res.send('Locations will be here');
});

locationsRouter.get('/:id', (req, res) => {
    res.send('A location will be here');
});

locationsRouter.post('/', (req, res) => {
    res.send('A location will be created here');
});

locationsRouter.delete('/:id', (req, res) => {
    res.send('A location will be deleted here');
});

export default locationsRouter;