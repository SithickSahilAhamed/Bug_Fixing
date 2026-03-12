# Secure Notes Manager

A full stack debugging challenge built using:

Frontend
- HTML
- CSS
- Vanilla JS

Backend
- Node.js
- Express

Database
- JSON files

Sensitive data is encrypted before storing.

Features

User registration
User login
Create encrypted notes
View notes
Delete notes

Architecture

Client → Routes → Controllers → Services → File Storage

APIs

POST /auth/register
POST /auth/login

GET /notes
POST /notes/create
DELETE /notes/:id

Bug Categories

Syntax bugs
Logical bugs
Security bugs
Async bugs

Bug Count

Syntax bugs: 3
Logical bugs: 8
Security bugs: 6
Async bugs: 4

Total ≈ 21 bugs

Goal

Participants must identify and fix bugs, improve security, and stabilize the system.