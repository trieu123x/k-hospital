import express from 'express';
import multer from 'multer';
import { createNews, getNewsList, getNewsDetail, updateNews, deleteNews } from '../controllers/news.js'; 
import { newsSchema } from '../validates/news.js';
import { validate } from '../middlewares/validate-handler.js';
import { authenticate } from '../middlewares/auth-handler.js'
import { authorizeRoles } from '../middlewares/authorize-handler.js'

const upload = multer({ storage: multer.memoryStorage() });
const newsRouter = express.Router();

newsRouter.get('/', validate({ query: newsSchema.query }), getNewsList);

newsRouter.get('/:newsId', validate({ params: newsSchema.params }), getNewsDetail);

newsRouter.post('/create', authenticate, authorizeRoles('admin'), upload.single('image'), createNews);

newsRouter.put('/update/:newsId', authenticate, authorizeRoles('admin'), upload.single('image'), validate({ params: newsSchema.params,  body: newsSchema.updateBody }), updateNews);

newsRouter.delete('/delete/:newsId', authenticate, authorizeRoles('admin'), validate({ params: newsSchema.params }), deleteNews);

export default newsRouter;