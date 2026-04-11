import express from 'express';
import multer from 'multer';
import { createNews, getNewsList, getNewsDetail, updateNews, deleteNews, getTotalNews, getNewsForAdmin } from '../controllers/news.js';
import { newsSchema } from '../validates/news.js';
import { validate } from '../middlewares/validate-handler.js';
import { authenticate, authorizeRoles } from '../middlewares/authenticate.js';

const upload = multer({ storage: multer.memoryStorage() });
const newsRouter = express.Router();

// newsRouter.get('/', validate({ query: newsSchema.query }), getNewsList);
// newsRouter.get('/admin', validate({ query: newsSchema.query }), getNewsForAdmin);
// newsRouter.get('/count', getTotalNews); 

// newsRouter.get('/:newsId', validate({ params: newsSchema.params }), getNewsDetail);

// newsRouter.post('/create', authenticate, authorizeRoles('ADMIN'), upload.single('image'), createNews);

// newsRouter.put('/update/:newsId', authenticate, authorizeRoles('ADMIN'), upload.single('image'), validate({ params: newsSchema.params, body: newsSchema.updateBody }), updateNews);

// newsRouter.delete('/delete/:newsId', authenticate, authorizeRoles('ADMIN'), validate({ params: newsSchema.params }), deleteNews);

newsRouter.get('/', validate({ query: newsSchema.query }), getNewsList);
newsRouter.get('/admin', validate({ query: newsSchema.query }), getNewsForAdmin);
newsRouter.get('/count', getTotalNews);

newsRouter.get('/:newsId', validate({ params: newsSchema.params }), getNewsDetail);

newsRouter.post('/create', upload.single('image'), createNews);

newsRouter.put('/update/:newsId', upload.single('image'), validate({ params: newsSchema.params, body: newsSchema.updateBody }), updateNews);

newsRouter.delete('/delete/:newsId', validate({ params: newsSchema.params }), deleteNews);

export default newsRouter;