use std::net::TcpListener;

fn main() {
    let listener = TcpListener::bind("0.0.0.0:4000").unwrap();
    println!("Rust Signature Verifier running on :4000");

    for _ in listener.incoming() {
        // Placeholder
    }
}