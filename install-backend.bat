@echo off
echo Installing Campus Stay Suite Backend Dependencies...
echo.

cd backend

echo Installing npm packages...
npm install

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Create config.env file with your MongoDB connection string
echo 2. Run: npm run seed (to populate database)
echo 3. Run: npm run dev (to start server)
echo.

pause
