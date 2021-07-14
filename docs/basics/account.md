---
title: 账户，密钥，地址
slug: /account
---

### 基于椭圆曲线的数字账户

私钥本质上只是一个随机数，其取值范围非常大（256个比特位），可确保在有限时间内，采取暴力搜索的方式，破解成功的概率接近于零。Bitcoin 和 Ethereum 都采用 Secp256k1 曲线，生成随机数私钥 r 之后，取椭圆曲线上的一个基点 G，经过特殊定义的乘法运算，可得到公钥 R=r*G 。通过 R 和 G 无法反推出 r，所以 R 和 G 是可以公开的。为了协助用户记忆或保存私钥，研究者发明了助记词，将私钥与英文单词序列一一对应，可互相推导。

> 单词序列通常包含 12 个单词，取自于一个较大的单词库，通常由超过 7000 个单词所构成，由于不同的软件所采用的单词库是不一样的，将助记词输入给不同的软件，得到的私钥可能是不同的，互不兼容，这一点需特别注意。

数字账户由私钥所掌控，由地址所标示。将公钥通过一定的哈希运算及校验编码可得到地址，但仅通过地址，不可能反推出公钥。

### 对以上概念的简单总结

私钥是某个随机数r，公钥是 Secp256k1 曲线二维坐标系上的某个点 R=r*G=(x, y)，Bitcoin 和 Ethereum 中数字账户所涉及的基本概念及计算推导关系如下：

```
Seed => Random => Private Key
Private Key => Mnemonic Words
Private Key => Uncompressed Public Key
Uncompressed Public Key => Compressed Public Key
Uncompressed Public Key => Address
Compressed Public Key => Address 
Address => Checked Address
Message => Hash => Signature => (Hash, V, R, S) => Public Key => Address
```
比特币地址示例：1Nt6XLmq8k8noafGGFdfwue74uJTFu9vQC

以太坊地址示例：**0x**3a7b653E26f54E4A579237A15893E13A4bDD3451

> 比特币的地址，是对公钥做哈希运算后，再经过Base58编码而成；以太坊的地址，是对公钥做哈希运算后，截取保留了20字节而成。

### 经过实践检验才算安全
Secp256k1 算法的安全性，是经过了长时间的实践检验的。从区块链系统的设计角度看，选择兼容比特币或以太坊的密钥生成算法和地址格式有很多优势，这并不是“抄袭”，因为 Secp256k1 算法及实现，就像是 TCP/IP 协议一样，属于通用基础模块，方便利用现有的钱包 APP 与 API 接口。在区块链的设计中，把更多的精力放在账户易用性、TPS、经济模型、体系结构等方面会更合理一些。更优秀的加密与签名算法，留给专业的密码学家去设计和论证。
