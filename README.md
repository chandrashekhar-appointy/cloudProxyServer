# AptProxy CLI

CLI tool for AptProxy database proxy server.

## Phase 1 Implementation ✅

Basic CLI with two commands:
- `createToken` - Create and store authentication token
- `query` - Execute SQL queries on remote database

## Installation

```bash
cd aptproxy-cli
npm install
```


## Usage

### 1. Create Authentication Token

```bash
# Interactive mode
node bin/aptproxy.js createToken

# With options
node bin/aptproxy.js createToken --name "John Doe" --position "Developer"
```

**What it does:**
- Prompts for name and position (if not provided via options)
- Makes API call to `http://localhost:3000/createToken`
- Saves token locally in `~/.aptproxy/config.json`

### 2. Execute SQL Query

```bash
node bin/aptproxy.js query "SELECT * FROM users;"
```

**What it does:**
- Reads stored token from local config
- Makes API call to `http://localhost:3000/poolQuery`
- Displays results in formatted table

## Examples

```bash
# Step 1: Create token
node bin/aptproxy.js createToken --name "Developer" --position "Engineer"

# Step 2: Run queries
node bin/aptproxy.js query "SELECT version();"
node bin/aptproxy.js query "SELECT * FROM users LIMIT 5;"
node bin/aptproxy.js query "SELECT COUNT(*) FROM users;"
```

## Requirements

- Node.js 18+
- AptProxy server running on `http://localhost:3000`
- Valid database connection configured in server

## Features

✅ **Interactive prompts** for missing information  
✅ **Local token storage** in user home directory  
✅ **Formatted table output** for query results  
✅ **Comprehensive error handling** with helpful hints  
✅ **Color-coded output** for better UX  

## File Structure

```
aptproxy-cli/
├── bin/aptproxy.js          # Main CLI entry point
├── lib/
│   ├── api/client.js        # HTTP client for server API
│   ├── commands/
│   │   ├── createToken.js   # Token creation command
│   │   └── query.js         # Query execution command
│   └── config/storage.js    # Local token storage
└── package.json
```

## Next Steps (Future Phases)

- **Phase 2**: Enhanced authentication with email validation
- **Phase 3**: Local proxy server (`aptproxy connect db <dbname>`)
- **Phase 4**: Connection pooling and session management 