import ioredis, { Redis } from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;

const redisClient = new Redis(redisPort, {
    host: redisHost
});

redisClient.on('connect', () => {
    console.log(`Connected to Redis at ${redisHost}:${redisPort}`);
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});


export default redisClient