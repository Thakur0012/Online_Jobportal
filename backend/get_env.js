import { Client } from 'ssh2';

const conn = new Client();
const ip = '145.223.21.139';
const username = 'root';
const password = 'Kumarsoft@261623';

conn.on('ready', () => {
  conn.exec('cat /var/www/reliableattestation/backend/.env', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', () => {
      console.log(out);
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
