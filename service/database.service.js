/**
 * @fileoverview This module provides database connection services using Mongoose for MongoDB integration
 * within an Express application. It offers functions to connect to and disconnect from the MongoDB database,
 * handling various database events such as errors, disconnections, and reconnections. The service is designed
 * to ensure robust database connection management by automatically reconnecting on disconnections and
 * logging significant events related to the database connection lifecycle.
 *
 * Key functionalities include:
 * - Establishing a persistent connection to MongoDB and managing reconnection attempts in case of disconnection.
 * - Gracefully disconnecting from the database when the application is shutting down or when required by the logic.
 * - Logging detailed information and errors related to database connections to assist in monitoring and troubleshooting.
 *
 * The module enhances the reliability of the application's data layer by ensuring that database connections are
 * managed efficiently and errors are handled gracefully.
 */

import mongoose from 'mongoose';

import configuration from '../configuration/configuration.js';

/**
 * Connects to the MongoDB database using configuration settings specified in the application's configuration module.
 * This function sets up and manages a persistent connection to the database, handling connectivity issues such as
 * automatic reconnections on disconnections. It also listens to various Mongoose connection events to log different
 * statuses like errors, disconnection, and successful reconnection, ensuring that the application can monitor and react
 * appropriately to changes in database connection status.
 *
 * The function throws an exception if the initial connection attempt fails, which should be handled by the caller to
 * manage application behavior in case of database unavailability.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} A promise that resolves when the database connection is successfully established,
 *                           or rejects with an error if the connection cannot be made.
 * @example
 * try {
 *     await DatabaseService.connect();
 *     console.log('Database connected!');
 * } catch (error) {
 *     console.error('Failed to connect to database:', error);
 * }
 */
const connect = async () => {
    // Set up event listeners for the MongoDB connection
    mongoose.connection.on('error', (error) =>
        console.error(`Database connection error: ${error.message}`)
    );

    // mongoose.connection.on('connected', () =>
    //     console.info('Database connection established.')
    // );

    // mongoose.connection.on('connecting', () =>
    //     console.info('Attempting to connect to the database...')
    // );

    mongoose.connection.on('disconnecting', () =>
        console.info('Database is disconnecting...')
    );

    mongoose.connection.on('disconnected', async () => {
        console.warn('Database disconnected! Attempting to reconnect...');

        try {
            await mongoose.connect(configuration.mongoose.url);
            console.info('Database reconnected successfully.');
        } catch (error) {
            console.error(`Database reconnection failed: ${error.message}`);
        }
    });

    mongoose.connection.on('uninitialized', () =>
        console.warn('Database connection is uninitialized.')
    );

    mongoose.connection.on('reconnected', () =>
        console.info('Database has successfully reconnected.')
    );

    // Attempt to connect to the database
    try {
        let dbName;
        if (mongoose.connection.readyState === 1) {
            dbName = mongoose.connection.db.databaseName;
            console.info(`Database already connected to ${dbName}`);
        } else {
            await mongoose.connect(configuration.mongoose.url);
            dbName = mongoose.connection.db.databaseName;
            console.info(`Database connected successfully to '${dbName}'.`);
        }
    } catch (error) {
        console.error(
            `Initial database connection attempt failed: ${error.message}`
        );

        throw error; // Re-throwing is necessary for the caller to handle it
    }
};

/**
 * Disconnects the application from the MongoDB database. This function is typically called when the application
 * is shutting down or when a manual disconnection is required. It ensures that all database connections are cleanly
 * terminated, releasing all database resources and handles gracefully. During the disconnection process, this function
 * logs the status of the disconnection attempt and any errors that might occur, aiding in troubleshooting and ensuring
 * that disconnection procedures are transparent and verifiable.
 *
 * If the disconnection process encounters an error, the function rethrows the error after logging it, allowing the caller
 * to handle it according to their error management strategy.
 *
 * @async
 * @function disconnect
 * @returns {Promise<void>} A promise that resolves when the database has been successfully disconnected,
 *                           or rejects with an error if the disconnection fails.
 * @example
 * try {
 *     await DatabaseService.disconnect();
 *     console.log('Database disconnected!');
 * } catch (error) {
 *     console.error('Failed to disconnect from database:', error);
 * }
 */
const disconnect = async () => {
    try {
        console.info('Database connection disconnecting...');

        await mongoose.disconnect();

        console.info('Database connection disconnected successfully.');
    } catch (error) {
        console.error(`Database disconnection error: ${error.message}`);

        throw error; // Re-throwing is necessary for the caller to handle it
    }
};

const DatabaseService = {
    connect,
    disconnect,
};

export default DatabaseService;
