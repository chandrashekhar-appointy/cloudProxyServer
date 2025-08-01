import inquirer from 'inquirer';
import chalk from 'chalk';
import apiClient from '../api/client.js';
import storage from '../config/storage.js';

export async function createToken(options) {
  console.log(chalk.blue('\n🔐 Creating authentication token...\n'));

  let { name, position } = options;

  // Prompt for missing information
  if (!name || !position) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter your name:',
        when: !name,
        validate: (input) => {
          if (input.trim().length === 0) {
            return 'Name is required';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'position',
        message: 'Enter your position:',
        when: !position,
        validate: (input) => {
          if (input.trim().length === 0) {
            return 'Position is required';
          }
          return true;
        }
      }
    ]);

    name = name || answers.name;
    position = position || answers.position;
  }

  console.log(chalk.gray(`\n📡 Connecting to AptProxy server...`));

  try {
    // Make API call to create token
    const response = await apiClient.createToken(name, position);
    
    if (!response.token) {
      console.error(chalk.red('❌ Server did not return a token'));
      process.exit(1);
    }

    // Save token locally
    storage.saveToken(response.token, name, position);

    console.log(chalk.green(`\n🎉 Authentication successful!`));
    console.log(chalk.gray(`   User: ${name}`));
    console.log(chalk.gray(`   Position: ${position}`));
    console.log(chalk.gray(`   Token: ${response.token.substring(0, 20)}...`));

  } catch (error) {
    // Error handling is done in apiClient
    process.exit(1);
  }
} 