import {Router} from "express";

const recordsRouter = Router();

recordsRouter.get('/', (req, res) => {
    res.send('Records will be here');
});

recordsRouter.get('/:id', (req, res) => {
    res.send('A record will be here');
});

recordsRouter.post('/', (req, res) => {
    res.send('A record will be created here');
});

recordsRouter.delete('/:id', (req, res) => {
    res.send('A record will be deleted here');
});

export default recordsRouter;