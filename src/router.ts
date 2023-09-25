import express, { Router } from 'express';
import authRouter from './API/authentication/authRouter';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import * as fs from 'fs';
const router: Router = express.Router();
const app = express()
const swaggerJsDocs = YAML.load('src/API/authentication/authApiDocs.yaml');
router.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerJsDocs));
app.use(express.json());

router.use('/app',authRouter);


export default router