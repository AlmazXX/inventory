import {Router} from "express";

const categoriesRouter = Router();

categoriesRouter.get('/', (req, res) => {
    res.send('Categories will be here');
});

categoriesRouter.get('/:id', (req, res) => {
    res.send('A category will be here');
});

categoriesRouter.post('/', (req, res) => {
    res.send('A category will be created here');
});

categoriesRouter.delete('/:id', (req, res) => {
    res.send('A category will be deleted here');
});

export default categoriesRouter;