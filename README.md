# Vulnerable Node.js Application - DevSecOps Demo

⚠️ **WARNING**: This application contains intentional security vulnerabilities for testing purposes only!

## Purpose
This application is designed for DevSecOps pipeline testing and security tool evaluation.

## Vulnerabilities Included
- SQL Injection (CWE-89)
- Command Injection (CWE-78)
- Path Traversal (CWE-22)
- Cross-Site Scripting (XSS) (CWE-79)
- Weak Cryptography (CWE-327)
- Hardcoded Credentials (CWE-798)
- Sensitive Data Exposure (CWE-200)
- Weak Random Number Generation (CWE-338)
- Unvalidated Redirects (CWE-601)

## DO NOT USE IN PRODUCTION
This application should only be used in isolated testing environments.

## Running Locally
- Port: 4567
- Install: npm install
- Start: npm start
- Access: http://localhost:4567

## Security Scanning
This project includes automated security scanning using:
- Snyk (SCA & SAST)
- OWASP ZAP (DAST)
- npm audit
- Retire.js
