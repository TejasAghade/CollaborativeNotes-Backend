import { Sequelize } from "sequelize";


let POSTGRES_USER = process.env.POSTGRES_USER;
let POSTGRES_PASS = process.env.POSTGRES_PASS;
let POSTGRES_HOST = process.env.POSTGRES_HOST;

// Initialize Sequelize connection
export const sequelize = new Sequelize(
    `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@${POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
    {
        dialect: 'postgres',
    },
);


/**
 * connect to database with sequelize
 */
export const connectDB = async () => {
    try {
        await sequelize.authenticate();

        sequelize.sync()
            .then(() => {
                console.log('Tables have been created!');
            })
            .catch((error) => {
                console.error('Error syncing database:', error);
                throw error;
            });

        console.log("Connection has been established successfully.");
        return true;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;

    }
};