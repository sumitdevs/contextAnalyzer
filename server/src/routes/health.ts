import express from 'express';
import { 
    basicHealthCheck 
} from '../controllers/healthController';

const router = express.Router();

router.get('/', basicHealthCheck);

export default router;

