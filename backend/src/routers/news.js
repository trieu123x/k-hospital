import express from 'express';
import multer from 'multer';
import { createNews, getNewsList, getNewsDetail, updateNews, deleteNews, restoreNews, getTotalNews, getNewsForAdmin } from '../controllers/news.js';
import { newsSchema } from '../validates/news.js';
import { validate } from '../middlewares/validate-handler.js';
import { authenticate, authorizeAdmin } from '../middlewares/authenticate.js';

const upload = multer({ storage: multer.memoryStorage() });
const newsRouter = express.Router();

// ================================
// PUBLIC ROUTES
// ================================
newsRouter.get('/', validate({ query: newsSchema.query }), getNewsList);

// ================================
// ADMIN ROUTES
// ================================
newsRouter.get('/admin', authenticate, authorizeAdmin, validate({ query: newsSchema.query }), getNewsForAdmin);
newsRouter.get('/count', authenticate, authorizeAdmin, getTotalNews);
newsRouter.get('/:newsId', validate({ params: newsSchema.params }), getNewsDetail);
newsRouter.post('/create', authenticate, authorizeAdmin, upload.single('image'), createNews);
newsRouter.put('/update/:newsId', authenticate, authorizeAdmin, upload.single('image'), validate({ params: newsSchema.params, body: newsSchema.updateBody }), updateNews);
newsRouter.put('/restore/:newsId', authenticate, authorizeAdmin, validate({ params: newsSchema.params }), restoreNews);
newsRouter.delete('/delete/:newsId', authenticate, authorizeAdmin, validate({ params: newsSchema.params }), deleteNews);

export default newsRouter;