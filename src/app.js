import express from 'express'
import authRoutes from './routes/auth.route.js'
import categoriasRouter from './routes/categorias.route.js';

const app = express();
app.use(express.json());
app.use(authRoutes);
app.use('/api/categorias', categoriasRouter);

export default app;