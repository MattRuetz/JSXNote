import express from 'express';
import fs from 'fs/promises'; //module for async (promised) file saving functions
import path from 'path';

interface Cell {
    id: string;
    constent: string;
    type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router();

    router.use(express.json());

    const fullPath = path.join(dir, filename);

    router.get('/cells', async (req, res) => {
        //Try to read file...
        try {
            const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
            res.send(JSON.parse(result));
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                //file doesnt exist
                //Create file and add default cells
                await fs.writeFile(fullPath, '[]', 'utf-8');
                res.send([]);
            } else {
                //unanticipated error - just re-throw
                throw err;
            }
        }
        //if throws error - doesn't exist - add a default list of cells
        // - Read file, parse list out, and send cell list back to browser
    });

    router.post('/cells', async (req, res) => {
        //Make sure file exists... if not exists - will be created automatically
        //take list of cells from 'req' object
        //serialize them
        const { cells }: { cells: Cell[] } = req.body;

        //Write to file
        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

        res.send({ status: 'ok' });
    });

    return router;
};
