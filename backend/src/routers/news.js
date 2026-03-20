import express from 'express';
import multer from 'multer';
import { createNews, getNewsList, getNewsDetail, updateNews, deleteNews } from '../controllers/news.js'; 
import { newsSchema } from '../validates/news.js';
import { validate } from '../middlewares/validate-handler.js';

const upload = multer({ storage: multer.memoryStorage() });
const newsRouter = express.Router();

newsRouter.get('/', validate({ query: newsSchema.query }), getNewsList);

newsRouter.get('/:newsId', validate({ params: newsSchema.params }), getNewsDetail);

newsRouter.post('/create', upload.single('image'), createNews);

newsRouter.put('/update/:newsId', upload.single('image'), validate({ params: newsSchema.params,  body: newsSchema.updateBody }), updateNews);

newsRouter.delete('/delete/:newsId', validate({ params: newsSchema.params }), deleteNews);

export default newsRouter;