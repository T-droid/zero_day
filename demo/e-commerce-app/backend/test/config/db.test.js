// const mongoose = require('mongoose')
// const connectDB = require('../../config/db')

import mongoose from 'mongoose';
import connectDB from '../../config/db';

jest.mock('mongoose');

describe('connectDB', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to MongoDB successfully', async () => {
    mongoose.connect.mockResolvedValue();
    const consoleSpy = jest.spyOn(console, 'log');

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String));
    expect(consoleSpy).toHaveBeenCalledWith('Mongodb connected');
  });

  it('should handle connection error and exit process', async () => {
    const mockError = new Error('Connection failed');
    mongoose.connect.mockRejectedValue(mockError);
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Database connection failed', mockError);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
