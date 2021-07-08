---
title: rust-web3 应用示例
slug: /rustweb3
---
### Reference
[ganache-cli](https://github.com/trufflesuite/ganache-cli)

[rust-web3 readme](https://github.com/tomusdrw/rust-web3/blob/master/examples/readme.md)

[rust-web3 issues](https://github.com/tomusdrw/rust-web3/issues/195)

### 操作步骤

```shell
## in terminal 1
npm install -g ganache-cli
ganache-cli -b 3 -m "hamster coin cup brief quote trick stove draft hobby strong caught unable"

## in terminal 2
git clone https://github.com/tomusdrw/rust-web3.git
cd rust-web3
cargo run --example contract
```

> Mac环境下报错，按如下方式改写examples/contract.rs的部分源代码，另外还需要修改/examples/res/contract_token.code，将文件尾部的空行删掉，然后可正常运行。Linux环境下，尚未测试。

```rust
// Deploying a contract
let contract = Contract::deploy(web3.eth(), include_bytes!("../src/contract/res/token.json"))?
    .confirmations(1)
    .options(Options::with(|opt| {
        opt.value = Some(0.into());
        opt.gas_price = Some(5.into());
        opt.gas = Some(3_000_000.into());
    }))
    .execute(
        bytecode,
        (U256::from(1_000_000_u64), "My Token".to_owned(), 3u64, "MT".to_owned()),
        my_account,
    )
    .await?;
```
