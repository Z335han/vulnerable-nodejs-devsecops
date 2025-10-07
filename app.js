// app.js - Intentionally vulnerable Node.js application for DevSecOps testing
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 4567;

// VULNERABILITY: Helmet disabled (Security headers missing)
// app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// VULNERABILITY: Weak session secret
app.use(session({
    secret: 'weak-secret-123',  // CWE-798: Use of Hard-coded Credentials
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,  // VULNERABILITY: Cookie not using secure flag
        httpOnly: false  // VULNERABILITY: Cookie accessible via JavaScript
    }
}));

// VULNERABILITY: Hardcoded database credentials (CWE-798)
const dbConfig = {
    host: 'localhost',
    user: 'admin',
    password: 'admin123',  // Hardcoded password
    database: 'vulnerable_db'
};

// Database connection (for demonstration - won't actually connect)
const connection = mysql.createConnection(dbConfig);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// VULNERABILITY: SQL Injection (CWE-89)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Vulnerable SQL query - directly concatenating user input
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    // Simulated database query
    console.log('Executing query:', query);
    
    res.json({ 
        message: 'Login attempt',
        query: query  // VULNERABILITY: Exposing internal query structure
    });
});

// VULNERABILITY: Command Injection (CWE-78)
app.get('/ping', (req, res) => {
    const { host } = req.query;
    
    if (!host) {
        return res.status(400).json({ error: 'Host parameter required' });
    }
    
    // Vulnerable to command injection
    const { exec } = require('child_process');
    exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ output: stdout });
    });
});

// VULNERABILITY: Path Traversal (CWE-22)
app.get('/download', (req, res) => {
    const fileName = req.query.file;
    
    if (!fileName) {
        return res.status(400).json({ error: 'File parameter required' });
    }
    
    // Vulnerable to path traversal attacks
    const filePath = path.join(__dirname, 'uploads', fileName);
    
    // No validation of file path
    res.sendFile(filePath);
});

// VULNERABILITY: Cross-Site Scripting (XSS) - CWE-79
app.post('/comment', (req, res) => {
    const { comment } = req.body;
    
    // Directly rendering user input without sanitization
    res.send(`
        <html>
            <body>
                <h1>Your Comment:</h1>
                <div>${comment}</div>
            </body>
        </html>
    `);
});

// VULNERABILITY: Insecure Random Number Generation (CWE-338)
app.get('/token', (req, res) => {
    // Using Math.random() for security-sensitive token
    const token = Math.random().toString(36).substring(7);
    
    res.json({ 
        token: token,
        message: 'Generated using weak randomness'
    });
});

// VULNERABILITY: Sensitive Data Exposure (CWE-200)
app.get('/api/users', (req, res) => {
    // Exposing sensitive user data without authentication
    const users = [
        { id: 1, username: 'admin', password: 'admin123', ssn: '123-45-6789' },
        { id: 2, username: 'user', password: 'user123', creditCard: '4111111111111111' }
    ];
    
    res.json(users);
});

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Vulnerable Node.js App for DevSecOps Testing',
        endpoints: [
            'POST /login - SQL Injection vulnerability',
            'GET /ping?host= - Command Injection vulnerability',
            'GET /download?file= - Path Traversal vulnerability',
            'POST /comment - XSS vulnerability',
            'GET /token - Weak randomness',
            'GET /api/users - Sensitive data exposure'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Vulnerable app running on port ${PORT}`);
    console.log('WARNING: This application contains intentional security vulnerabilities!');
    console.log('Use only for DevSecOps testing in isolated environments.');
});

module.exports = app;
