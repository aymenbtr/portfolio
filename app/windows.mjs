import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Service } from 'node-windows';
import { join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create a new service object
const svc = new Service({
    name: 'ContactServerService',
    description: 'Contact form server service',
    script: join(__dirname, 'server.mjs'),
    nodeOptions: ['--experimental-modules'], // Ensure Node.js can run ES modules
    env: [{
        name: "PORT",
        value: 3000
    }]
});

// Listen for service events
svc.on('install', () => {
    svc.start();
    console.log('Service installed and started');
});

svc.on('error', (error) => {
    console.error('Service error:', error);
});

// Install the service
svc.install();