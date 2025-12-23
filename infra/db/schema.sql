CREATE TABLE users (
  id UUID PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  event TEXT,
  created_at TIMESTAMP DEFAULT now()
);
