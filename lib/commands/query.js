import chalk from 'chalk';
import Table from 'cli-table3';
import apiClient from '../api/client.js';
import storage from '../config/storage.js';

export async function query(sql) {
  console.log(chalk.blue(`\n🔍 Executing query...\n`));
  console.log(chalk.gray(`SQL: ${sql}`));

  // Get stored token
  const token = storage.getToken();
  const config = storage.getConfig();

  console.log(chalk.gray(`User: ${config?.user?.name || 'Unknown'}`));
  console.log(chalk.gray(`\n📡 Sending query to AptProxy server...`));

  try {
    // Execute query
    const response = await apiClient.executeQuery(sql, token);

    if (!response || !Array.isArray(response)) {
      console.error(chalk.red('❌ Invalid response from server'));
      process.exit(1);
    }

    // Display results
    displayResults(response, sql);

  } catch (error) {
    // Error handling is done in apiClient
    process.exit(1);
  }
}

function displayResults(data, sql) {
  console.log(chalk.green(`\n✅ Query executed successfully!`));

  if (data.length === 0) {
    console.log(chalk.yellow('📄 No rows returned'));
    return;
  }

  // Check if it's a simple command result (like INSERT, UPDATE, DELETE)
  if (data.length === 1 && Object.keys(data[0]).length === 0) {
    console.log(chalk.green('📄 Command executed successfully'));
    return;
  }

  // Create table for displaying results
  const headers = Object.keys(data[0]);
  const table = new Table({
    head: headers.map(h => chalk.cyan(h)),
    style: {
      head: [],
      border: ['gray']
    }
  });

  // Add rows to table
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null) return chalk.gray('NULL');
      if (typeof value === 'boolean') return value ? chalk.green('TRUE') : chalk.red('FALSE');
      if (typeof value === 'number') return chalk.yellow(value.toString());
      if (value instanceof Date) return chalk.magenta(value.toISOString());
      return value.toString();
    });
    table.push(values);
  });

  console.log(`\n${table.toString()}`);
  console.log(chalk.gray(`\n📊 Rows returned: ${data.length}`));

  // Show query type info
  const queryType = sql.trim().split(' ')[0].toLowerCase();
  if (['select', 'show', 'describe', 'explain'].includes(queryType)) {
    console.log(chalk.gray(`Query type: ${queryType.toUpperCase()}`));
  }
} 