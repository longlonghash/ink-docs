---
title: Hyperledger Besu 部署运行
slug: /besu
---
### Reference
- [Besu](https://besu.hyperledger.org)

### 基础环境
- 选择阿里云主机、CentOS 7.9操作系统为基础运行环境
- 准备好Java运行环境，参考以下链接

https://computingforgeeks.com/how-to-install-java-11-openjdk-11-on-rhel-8/
  
https://computingforgeeks.com/how-to-install-java-11-on-centos-7-fedora-29-fedora-28/

```shell
curl -O https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_linux-x64_bin.tar.gz
tar zxvf openjdk-11.0.2_linux-x64_bin.tar.gz
sudo mv jdk-11.0.2/ /usr/local/
sudo vim /etc/profile.d/jdk11.sh
export JAVA_HOME=/usr/local/jdk-11.0.2
export PATH=$PATH:$JAVA_HOME/bin
source /etc/profile.d/jdk11.sh
java -version
openjdk version "11.0.2" 2019-01-15
OpenJDK Runtime Environment 18.9 (build 11.0.2+9)
OpenJDK 64-Bit Server VM 18.9 (build 11.0.2+9, mixed mode)
which java
/usr/local/jdk-11.0.2/bin/java
若存在旧版本的 java 在更高查找优先级的 bin 目录中，可以执行类似这样的操作：mv /usr/bin/java java8
```

### 准备材料

- 下载besu可执行程序，从以下链接中找到最新版

https://github.com/hyperledger/besu/releases

```shell  
wget -c https://dl.bintray.com/hyperledger-org/besu-repo/besu-20.10.2.zip
unzip besu-20.10.2.zip
./besu-20.10.2/bin/besu --network=dev --miner-enabled --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 --rpc-http-cors-origins="all" --host-allowlist="*" --rpc-http-enabled --data-path=/tmp/tmpDatdir
./besu-20.10.2/bin/besu --help
````

- 准备安装目录与配置文件

```shell 
mkdir -pv IBFT-Network/Node-1/data
mkdir -pv IBFT-Network/Node-2/data
mkdir -pv IBFT-Network/Node-3/data
mkdir -pv IBFT-Network/Node-4/data
```



### genesis-file

https://besu.hyperledger.org/en/stable/HowTo/Configure/Consensus-Protocols/IBFT/#genesis-file

```json
{
  "genesis": {
    "config": {
      "chainId": 2018,
      "muirglacierblock": 0,
      "ibft2": {
        "blockperiodseconds": 2,
        "epochlength": 30000,
        "requesttimeoutseconds": 4
      }
    },
    "nonce": "0x0",
    "timestamp": "0x58ee40ba",
    "gasLimit": "0x47b760",
    "difficulty": "0x1",
    "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "alloc": {
      "fe3b557e8fb62b89f4916b721be55ceb828dbd73": {
        "privateKey": "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
        "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
        "balance": "0xad78ebc5ac6200000"
      },
      "627306090abaB3A6e1400e9345bC60c78a8BEf57": {
        "privateKey": "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
        "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
        "balance": "90000000000000000000000"
      },
      "f17f52151EbEF6C7334FAD080c5704D77216b732": {
        "privateKey": "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
        "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
        "balance": "90000000000000000000000"
      }
    }
  },
  "blockchain": {
    "nodes": {
      "generate": true,
      "count": 4
    }
  }
}
```

### 运行节点

```shell
cd IBFT-Network/Node-1/
~/hyperledger/besu-20.10.2/bin/besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all"

enode://a7b4fcf42f8bc774ac51237cfcef5114a03e345fee38db5512c1d033e72caf8babd1de5bb1ef28e41c2c7893754a6c416c69f9ecc9d7d59b6740f8d42453b8d4@127.0.0.1:30303

cd IBFT-Network/Node-2/
~/hyperledger/besu-20.10.2/bin/besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --p2p-port=30304 --rpc-http-port=8645 --bootnodes="enode://a7b4fcf42f8bc774ac51237cfcef5114a03e345fee38db5512c1d033e72caf8babd1de5bb1ef28e41c2c7893754a6c416c69f9ecc9d7d59b6740f8d42453b8d4@127.0.0.1:30303"

cd IBFT-Network/Node-3/
~/hyperledger/besu-20.10.2/bin/besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --p2p-port=30305 --rpc-http-port=8745 --bootnodes="enode://a7b4fcf42f8bc774ac51237cfcef5114a03e345fee38db5512c1d033e72caf8babd1de5bb1ef28e41c2c7893754a6c416c69f9ecc9d7d59b6740f8d42453b8d4@127.0.0.1:30303"

cd IBFT-Network/Node-4/
~/hyperledger/besu-20.10.2/bin/besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --p2p-port=30306 --rpc-http-port=8845 --bootnodes="enode://a7b4fcf42f8bc774ac51237cfcef5114a03e345fee38db5512c1d033e72caf8babd1de5bb1ef28e41c2c7893754a6c416c69f9ecc9d7d59b6740f8d42453b8d4@127.0.0.1:30303"

curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":51}' http://127.0.0.1:8545
```


