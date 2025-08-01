import axios from 'axios';
import chalk from 'chalk';

const API_BASE_URL = 'http://localhost:3000';

export class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async createToken(name, position) {
    try {
      const response = await this.client.post('/createToken', {
        name,
        position
      });
      return response.data;
    } catch (error) {
      this.handleError('createToken', error);
    }
  }

  async executeQuery(query, token) {
    try {
      const response = await this.client.post('/poolQuery', 
        { query },
        {
          headers: {
            'Authorization': token
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError('query', error);
    }
  }

  handleError(operation, error) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'Unknown error';
      
      console.error(chalk.red(`\n❌ ${operation} failed:`));
      console.error(chalk.red(`   Status: ${status}`));
      console.error(chalk.red(`   Message: ${message}`));
      
      if (status === 401) {
        console.error(chalk.yellow('\n💡 Hint: Run "aptproxy createToken" to authenticate first'));
      }
    } else if (error.request) {
      // Network error
      console.error(chalk.red(`\n❌ Cannot connect to AptProxy server:`));
      console.error(chalk.red(`   Make sure your server is running on ${API_BASE_URL}`));
      console.error(chalk.yellow('\n💡 Hint: Start server with "node index.js" in demo-server directory'));
    } else {
      // Other error
      console.error(chalk.red(`\n❌ Unexpected error: ${error.message}`));
    }
    
    process.exit(1);
  }
}

export default new ApiClient(); 