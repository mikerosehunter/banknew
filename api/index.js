import express from 'express';
import cors from 'cors';

import dashboard from '../server/dashboard.js';
import banksIndex from '../server/banks/index.js';
import errorsIndex from '../server/errors/index.js';
import errorsId from '../server/errors/[id].js';
import errorsAnalyze from '../server/errors/[id]/analyze.js';
import errorsGenArticle from '../server/errors/[id]/generate-article.js';
import errorsGenImage from '../server/errors/[id]/generate-image.js';
import articlesIndex from '../server/articles/index.js';
import articlesId from '../server/articles/[id].js';
import articlesGenBulk from '../server/articles/generate-bulk.js';
import articlesPublish from '../server/articles/[id]/publish.js';
import monitoringRun from '../server/monitoring/run.js';
import monitoringRuns from '../server/monitoring/runs.js';

const app = express();
app.use(cors());
app.use(express.json());

// Add the req.query map from params to mimic Vercel's behavior
const wrap = (handler, paramNames = []) => async (req, res) => {
  req.query = { ...req.query, ...req.params };
  return handler(req, res);
};

app.get('/api/dashboard', wrap(dashboard));
app.get('/api/banks', wrap(banksIndex));

app.get('/api/errors', wrap(errorsIndex));
app.get('/api/errors/:id', wrap(errorsId));
app.patch('/api/errors/:id', wrap(errorsId));
app.post('/api/errors/:id/analyze', wrap(errorsAnalyze));
app.post('/api/errors/:id/generate-article', wrap(errorsGenArticle));
app.post('/api/errors/:id/generate-image', wrap(errorsGenImage));

app.get('/api/articles', wrap(articlesIndex));
app.post('/api/articles/generate-bulk', wrap(articlesGenBulk));
app.get('/api/articles/:id', wrap(articlesId));
app.post('/api/articles/:id/publish', wrap(articlesPublish));

app.post('/api/monitoring/run', wrap(monitoringRun));
app.get('/api/monitoring/runs', wrap(monitoringRuns));

export default app;
