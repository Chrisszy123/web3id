# Web3 Identity & Access Management (WEB3ID)

A production-grade **Web3 WEB3ID platform** that bridges **wallet-based identity** with **enterprise authorization**, issuing standard JWTs backed by **on-chain roles**, **refresh token rotation**, **session revocation**, and **security observability**.

> **Think Auth0 — but where the identity provider is the blockchain.**

---

## Problem

Web3 applications can authenticate users via wallets but:

- Wallet login ≠ authorization
- Web2 systems require JWTs and RBAC
- On-chain role checks are slow and expensive
- Most teams reinvent insecure auth logic

This results in fragmented identity systems, security bugs, and poor scalability.

---

## Solution

This WEB3ID platform provides:

- Wallet-based authentication (nonce + signature)
- On-chain role resolution (smart contract–backed)
- Short-lived JWTs for Web2 compatibility
- Refresh token rotation with reuse detection
- Session revocation (user & admin controlled)
- Role caching for performance and cost reduction
- Structured audit logs (SIEM-ready)

---

## Architecture Overview

**Core Services**

- **Auth Service (Node.js / Fastify)**  
  Handles authentication, token issuance, session management, and authorization.

- **Signature Verifier (Rust / Axum)**  
  Performs cryptographic signature verification for wallet authentication.

- **Admin Console (React / TypeScript)**  
  Provides RBAC-based administrative controls and observability.

- **Identity Smart Contract (Solidity)**  
  Defines on-chain roles and permissions.

---

## Authentication Flow

1. Client requests a nonce
2. Wallet signs the nonce
3. Signature verified via Rust service
4. On-chain roles are resolved and cached
5. Access JWT + Refresh Token are issued

## Token Lifecycle

- **Access Token (JWT)**
  - Lifetime: 5–15 minutes
  - Used for API authorization

- **Refresh Token**
  - Lifetime: 7–30 days
  - Rotated on every use
  - Reuse detection triggers session revocation

  ---

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Fastify
- **Crypto**: Rust, Axum
- **Blockchain**: Solidity (EVM)
- **Database**: PostgreSQL
- **Infrastructure**: Docker, Docker Compose

---

## Key Security Features

- Stateless JWT authentication
- Stateful session validation
- Refresh token rotation with replay detection
- On-chain authorization with caching
- Rate-limited authentication endpoints
- Full audit trail for security events

---

## Use Cases

- DAO admin dashboards
- Web3 SaaS platforms
- Creator / brand marketplaces
- Hybrid Web2 + Web3 applications
- Microservice-based backend systems

---

## Why This Project Matters

This project demonstrates:

- Senior-level auth & security design
- Token lifecycle management
- Blockchain and enterprise system integration
- Scalable authorization architecture
- Production observability and auditability

It goes beyond wallet login to solve **real authorization problems in Web3 systems**.

---

## Running Locally

```bash
cd infra/docker && docker compose up --build
