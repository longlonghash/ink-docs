---
title: OpenEthereum 编译部署
slug: /oe
---
### Reference
- [OE Github](https://github.com/openethereum/openethereum)

- [OE Wiki](https://openethereum.github.io)

- [PoA Demo](https://openethereum.github.io/Demo-PoA-tutorial)

- [Dev Mode](https://openethereum.github.io/Private-development-chain)

### 编译运行 openethereum (OE)
下载源码，并编译出debug与release版本的OE，注意采用合适的编译器版本：
```shell

git clone https://github.com/openethereum/openethereum.git
cd openethereum

rustup install nightly-2020-10-06
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-10-06

cargo +nightly-2020-10-06 build
cargo +nightly-2020-10-06 build --release --features final

./target/release/openethereum

```

### 搭建本地 PoA 测试网的整体思路
- 创建 chain-spec 配置文件 demo-spec.json，demo-spec.ok.json
- 准备 2 个 authority 节点，及其配置文件node0.toml，node1.toml, node0.ok.toml, node1.ok.toml
- 准备 1 个外围 non-authority (viewer) 节点， 及其配置文件node2.ok.toml
- 启动上述 3 个节点对应的 3 个节点进程，构建出本地测试链
- 用 curl 命令，通过 RPC 接口与链进行交互

> 搭建过程分为两大部分：准备阶段，运行阶段。在准备阶段用到的所有配置文件，是为了临时启动节点，创建账户与密钥，账户地址信息需填写到运行阶段的新配置文件中（文件名含 ok 字样）。
> 
> 所有配置文件，可执行 git clone https://github.com/longlonghash/openethereum-poa-demo.git 获取到。

### 准备阶段

demo-spec.json

```json
{
  "name": "DemoPoA",
  "engine": {
    "authorityRound": {
      "params": {
        "stepDuration": "5",
        "validators" : {
          "list": []
        }
      }
    }
  },
  "params": {
    "gasLimitBoundDivisor": "0x400",
    "maximumExtraDataSize": "0x20",
    "minGasLimit": "0x1388",
    "networkID" : "0x2323",
    "eip155Transition": 0,
    "validateChainIdTransition": 0,
    "eip140Transition": 0,
    "eip211Transition": 0,
    "eip214Transition": 0,
    "eip658Transition": 0
  },
  "genesis": {
    "seal": {
      "authorityRound": {
        "step": "0x0",
        "signature": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    "difficulty": "0x20000",
    "gasLimit": "0x5B8D80"
  },
  "accounts": {
    "0x0000000000000000000000000000000000000001": { "balance": "1", "builtin": { "name": "ecrecover", "pricing": { "linear": { "base": 3000, "word": 0 } } } },
    "0x0000000000000000000000000000000000000002": { "balance": "1", "builtin": { "name": "sha256", "pricing": { "linear": { "base": 60, "word": 12 } } } },
    "0x0000000000000000000000000000000000000003": { "balance": "1", "builtin": { "name": "ripemd160", "pricing": { "linear": { "base": 600, "word": 120 } } } },
    "0x0000000000000000000000000000000000000004": { "balance": "1", "builtin": { "name": "identity", "pricing": { "linear": { "base": 15, "word": 3 } } } }
  }
}
```

node0.toml

```toml
[parity]
chain = "demo-spec.json"
base_path = "/tmp/parity0"
[network]
port = 30300
[rpc]
port = 8540
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[websockets]
port = 8450

```

node1.toml

```toml
[parity]
chain = "demo-spec.json"
base_path = "/tmp/parity1"
[network]
port = 30301
[rpc]
port = 8541
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[websockets]
port = 8451
[ipc]
disable = true
```

通过配置文件或通过命令行参数启动 node0 与 node1

```shell
## 通过命令行参数方式启动 node0
./target/release/openethereum  \
    -d /tmp/parity0 \
    --chain demo-spec.json  \
    --port 30300 \
    --jsonrpc-port 8540 \
    --ws-port 8450 \
    --jsonrpc-apis web3,eth,net,personal,parity,parity_set,traces,rpc,parity_accounts
    
## 通过配置文件方式启动 node0
./target/release/openethereum  --config node0.toml

## 通过配置文件方式启动 node1
./target/release/openethereum --config node1.toml
```

```shell
curl --data '{"jsonrpc":"2.0","method":"parity_newAccountFromPhrase","params":["user", "123456"],"id":0}' \
     -H "Content-Type: application/json" -X POST localhost:8540
## Returned address should be 0x004ec07d2329997267ec62b4166639513386f32e

curl --data '{"jsonrpc":"2.0","method":"parity_newAccountFromPhrase","params":["node0", "123456"],"id":0}' \
     -H "Content-Type: application/json" -X POST localhost:8540
## Returned address should be 0x00bd138abd70e2f00903268f3db08f2d25677c9e

curl --data '{"jsonrpc":"2.0","method":"parity_newAccountFromPhrase","params":["node1", "123456"],"id":0}' \
     -H "Content-Type: application/json" -X POST localhost:8541
## Returned address should be 0x00aa39d30f0d20ff03a22ccfc30b7efbfca597c2
```

### 运行阶段

添加 node0 与 node1 对应的账户地址到chain-spec配置文件( demo-spec.ok.json )，并为user账户设置eth初始额度

```json
{
    "name": "DemoPoA",
    "engine": {
        "authorityRound": {
            "params": {
                "stepDuration": "5",
                "validators" : {
                    "list": [
                        "0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e",
                        "0x00Aa39d30F0D20FF03a22cCfc30B7EfbFca597C2"
                    ]
                }
            }
        }
    },
    "params": {
        "gasLimitBoundDivisor": "0x400",
        "maximumExtraDataSize": "0x20",
        "minGasLimit": "0x1388",
        "networkID" : "0x2323",
        "eip155Transition": 0,
        "validateChainIdTransition": 0,
        "eip140Transition": 0,
        "eip211Transition": 0,
        "eip214Transition": 0,
        "eip658Transition": 0
    },
    "genesis": {
        "seal": {
            "authorityRound": {
                "step": "0x0",
                "signature": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            }
        },
        "difficulty": "0x20000",
        "gasLimit": "0x5B8D80"
    },
    "accounts": {
        "0x0000000000000000000000000000000000000001": { "balance": "1", "builtin": { "name": "ecrecover", "pricing": { "linear": { "base": 3000, "word": 0 } } } },
        "0x0000000000000000000000000000000000000002": { "balance": "1", "builtin": { "name": "sha256", "pricing": { "linear": { "base": 60, "word": 12 } } } },
        "0x0000000000000000000000000000000000000003": { "balance": "1", "builtin": { "name": "ripemd160", "pricing": { "linear": { "base": 600, "word": 120 } } } },
        "0x0000000000000000000000000000000000000004": { "balance": "1", "builtin": { "name": "identity", "pricing": { "linear": { "base": 15, "word": 3 } } } },
        "0x004ec07d2329997267Ec62b4166639513386F32E": { "balance": "10000000000000000000000" }
    }
}
```

node0.ok.toml

```toml
[parity]
chain = "demo-spec.ok.json"
base_path = "/tmp/parity0"
[network]
port = 30300
[rpc]
port = 8540
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[websockets]
port = 8450
[account]
password = ["node.pwds"]
[mining]
engine_signer = "0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e"
reseal_on_txs = "none"
```

node1.ok.toml

```toml
[parity]
chain = "demo-spec.ok.json"
base_path = "/tmp/parity1"
[network]
port = 30301
[rpc]
port = 8541
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[websockets]
port = 8451
[ipc]
disable = true
[account]
password = ["node.pwds"]
[mining]
engine_signer = "0x00Aa39d30F0D20FF03a22cCfc30B7EfbFca597C2"
reseal_on_txs = "none"
```

启动 node0 与 node1

```shell
./target/release/openethereum  --config node0.ok.toml

./target/release/openethereum --config node1.ok.toml
```

建立 node0 与 node1 之间的网络连接

```shell
curl --data '{"jsonrpc":"2.0","method":"parity_enode","params":[],"id":0}' \
     -H "Content-Type: application/json" -X POST localhost:8540

## 用上个命令获取到的 node0 enode 信息，替换以下命令中的 RESULT ，执行后即可建立连接，控制台界面输出内容中可见 0/1/25 peers 字样。
curl --data '{"jsonrpc":"2.0","method":"parity_addReservedPeer","params":["enode://RESULT"],"id":0}' \
     -H "Content-Type: application/json" -X POST localhost:8541
```
