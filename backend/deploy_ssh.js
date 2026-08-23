import SftpClient from 'ssh2-sftp-client';
import path from 'path';

const config = {
  host: '145.223.21.139',
  port: 22,
  username: 'root',
  password: 'Kumarsoft@261623'
};

const remoteDir = '/var/www/reliableattestation/backend';
const localDir = path.resolve('.');

const sftp = new SftpClient();

async function deploy() {
  try {
    console.log('Connecting to SFTP...');
    await sftp.connect(config);
    console.log('Connected.');

    const directories = ['controllers', 'routes', 'models', 'middleware', 'utils', 'config', 'scripts'];
    const files = ['server.js', 'package.json', '.env'];

    // 1. Upload root files
    for (const file of files) {
      const src = path.join(localDir, file);
      const dest = `${remoteDir}/${file}`;
      console.log(`Uploading ${file}...`);
      await sftp.put(src, dest);
    }

    // 2. Upload directories
    for (const dir of directories) {
      const src = path.join(localDir, dir);
      const dest = `${remoteDir}/${dir}`;
      console.log(`Syncing directory: ${dir}...`);
      await sftp.uploadDir(src, dest);
    }

    console.log('All files uploaded. Running production commands...');
    
    // Using ssh2 through sftp.client for command execution
    const ssh = sftp.client;
    const remoteCmd = `cd ${remoteDir} && npm install --production && pm2 restart all`;
    
    await new Promise((resolve, reject) => {
      ssh.exec(remoteCmd, (err, stream) => {
        if (err) reject(err);
        stream.on('close', (code) => {
          console.log(`Deployment Complete. PM2 restarted (Exit Code: ${code})`);
          resolve();
        }).on('data', (data) => {
          process.stdout.write(data);
        }).stderr.on('data', (data) => {
          process.stderr.write(data);
        });
      });
    });

  } catch (err) {
    console.error('Deployment Error:', err.message);
  } finally {
    await sftp.end();
  }
}

deploy();
