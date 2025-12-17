import app from './app.js';
import logger from './logger.js';

const PORT = 3000

app.listen(PORT, () => {
    logger.info(`Millenium falcon onboard computer is running on port ${PORT}
    
    `);
});