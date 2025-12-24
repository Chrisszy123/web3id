# Build stage
FROM rust:latest AS builder

WORKDIR /app

# Copy Cargo files
COPY rust/signature-verifier/Cargo.toml rust/signature-verifier/Cargo.lock ./

# Copy source code
COPY rust/signature-verifier/src ./src

# Build the application
RUN cargo build --release

# Runtime stage - use Debian slim for compatibility with glibc-based Rust binaries
FROM debian:bookworm-slim

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the binary from builder
COPY --from=builder /app/target/release/signature-verifier /app/signature-verifier

# Expose port
EXPOSE 4000

# Run the application
CMD ["./signature-verifier"]

