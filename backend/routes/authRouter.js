import { googleLogin } from '../controllers/authController.js';
import { Router } from 'express';

const router = Router();

router.get('/test', (req, res) => {
    res.send('Test Router');
}); 

router.get('/google', googleLogin);

export default router;