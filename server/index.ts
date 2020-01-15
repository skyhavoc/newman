import { bootstrapMicroframework } from 'microframework';
import { authenticationLoader } from './loaders/authentication.loader';
import { corsLoader } from './loaders/cors.loader';
import { serverLoader } from './loaders/server.loader';
import { initLoader } from './loaders/init.loader';
import { mongooseLoader } from './loaders/mongoose.loader';
import { publicLoader } from './loaders/public.loader';
import { swaggerLoader } from './loaders/swagger.loader';
import { logError, logInfo } from './utils/log';

bootstrapMicroframework({
  config: {
    showBootstrapTime: true
  },
  loaders: [
    initLoader,
    corsLoader,
    publicLoader,
    swaggerLoader,
    authenticationLoader,

    // DB Loader
    mongooseLoader,

    // start server after all middlewares
    serverLoader
  ]
})
  .then((e) => {
    logInfo('Start Development');
  })
  .catch((err) => {
    logError('application erry', err);
  });
