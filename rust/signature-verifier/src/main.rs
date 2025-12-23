use axum::{routing::post, Json, Router};
use ethers::core::types::Signature;
use ethers::core::utils::hash_message;
use serde::{Deserialize};
use tokio::net::TcpListener;

#[derive(Deserialize)]

// create a verify request struct
struct VerifyRequest {
    address: String,
    message: String,
    signature: String
}

async fn verify(Json(payload): Json<VerifyRequest>) -> Json<bool> {
    let message_hash = hash_message(payload.message);
    let signature: Signature = match payload.signature.parse() {
        Ok(sig) => sig,
        Err(_) => return Json(false),
    };
    let recovered_address = match signature.recover(message_hash) {
        Ok(addr) => addr,
        Err(_) => return Json(false),
    };
    Json(
        recovered_address
            .to_string()
            .to_lowercase()
            == payload.address.to_lowercase(),
    )
}


#[tokio::main]

async fn main() {
    let app = Router::new().route("/verify", post(verify));
    let listener = TcpListener::bind("0.0.0.0:4000")
        .await
        .expect("Failed to bind");

    println!("Rust signature verifier running on :4000");

    axum::serve(listener, app).await.unwrap();
}