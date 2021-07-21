---
title: Rust-Tron 用法简介
slug: /rusttron
---
### Reference

- [rust-tron readme](https://github.com/andelf/rust-tron/readme.md)

### 操作步骤

```shell
## install protobuf
brew install protobuf  # macOS
sudo apt install protobuf-compiler libprotobuf-dev # Ubuntu / Debian

## download and compile
git clone --recurse-submodules https://github.com/andelf/rust-tron.git
cd ./rust-tron
cargo build --all

## run
/target/debug/wallet-cli --help
./target/debug/wallet-cli wallet create --password YOUR_PASSWORD ## at least 8 characters
./target/debug/wallet-cli wallet open
./target/debug/wallet-cli wallet unlock
./target/debug/wallet-cli wallet create_key
./target/debug/wallet-cli wallet keys

## delete old db, and run again
cd ~/.config
rm -rf TronProtocol
./target/debug/wallet-cli wallet create --password YOUR_PASSWORD ## at least 8 characters

```

