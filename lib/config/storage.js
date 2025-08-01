import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const CONFIG_DIR = path.join(os.homedir(), '.aptproxy');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export class Storage {
  constructor() {
    this.ensureConfigDir();
  }

  ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
  }

  saveToken(token, name, position) {
    const config = {
      token,
      server: 'http://localhost:3000',
      user: {
        name,
        position
      },
      created_at: new Date().toISOString()
    };

    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
      console.log(chalk.green('✅ Token saved successfully!'));
      console.log(chalk.gray(`   Config saved to: ${CONFIG_FILE}`));
    } catch (error) {
      console.error(chalk.red('❌ Failed to save token:'), error.message);
      process.exit(1);
    }
  }

  getToken() {
    if (!fs.existsSync(CONFIG_FILE)) {
      console.error(chalk.red('❌ No authentication token found'));
      console.error(chalk.yellow('💡 Run "aptproxy createToken" first to authenticate'));
      process.exit(1);
    }

    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return config.token;
    } catch (error) {
      console.error(chalk.red('❌ Failed to read token:'), error.message);
      console.error(chalk.yellow('💡 Try running "aptproxy createToken" again'));
      process.exit(1);
    }
  }

  getConfig() {
    if (!fs.existsSync(CONFIG_FILE)) {
      return null;
    }

    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (error) {
      return null;
    }
  }

  hasToken() {
    return fs.existsSync(CONFIG_FILE);
  }

  clearToken() {
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
      console.log(chalk.green('✅ Token cleared successfully'));
    }
  }
}

export default new Storage(); 