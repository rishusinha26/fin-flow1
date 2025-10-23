// Simple test to check if Vite can start
const { spawn } = require('child_process');

console.log('🚀 Starting Vite dev server...\n');

const vite = spawn('npx', ['vite'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

vite.on('error', (error) => {
  console.error('❌ Error starting server:', error);
});

vite.on('close', (code) => {
  console.log(`\n📊 Server process exited with code ${code}`);
});

console.log('✅ Server process started. Press Ctrl+C to stop.\n');
