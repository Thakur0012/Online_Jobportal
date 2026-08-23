import dotenv from 'dotenv';
dotenv.config();

console.log('--- BACKEND CONFIG CHECK ---');
console.log('PORT:', process.env.PORT);
console.log('FRONTEND_URL:', `"${process.env.FRONTEND_URL}"`);
console.log('JWT_SECRET Status:', process.env.JWT_SECRET ? 'Set' : 'Missing');
console.log('MONGODB_URI Status:', process.env.MONGODB_URI ? 'Set' : 'Missing');
console.log('---------------------------');

const url = process.env.FRONTEND_URL || '';
console.log('Length:', url.length);
console.log('Ends with slash:', url.endsWith('/'));
console.log('Cleaned version:', `"${url.replace(/\/$/, '')}"`);
