import { Client } from 'ssh2';

const conn = new Client();
const ip = '145.223.21.139';
const username = 'root';
const password = 'Kumarsoft@261623';

console.log('Connecting to', ip);

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('cd /var/www/reliableattestation/backend && rm -f middleware/uploadMiddleware.js && git checkout -- server.js routes/authRoutes.js && pm2 restart reliableattestation-backend', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', (code, signal) => {
      console.log('RESTORE DONE:\n', out);
      conn.end();
    }).on('data', (data) => {
      out += data;
    });
  });
}).on('error', (err) => {
  console.error('Connection Error:', err);
}).connect({
  host: ip,
  port: 22,
  username: username,
  password: password
});
