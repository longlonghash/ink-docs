---
title: 不用哈希密钥的原子跨链交易
slug: /myatomic
---
以下内容，是我在 2019 年 7 月对 [经典原子跨链交易](http://longlonghash.io/atomic) 的的改进，若读者能找出设计漏洞，请不吝赐教。

如何用智能合约模拟出跨链原子交易，且不准使用哈希密钥（超时机制仍需用到）？ 

Alice 在 Achain 上拥有 Acoin ; 

Bob 在 Bchain 上拥有 Bcoin ; 

Achain 与 Bchain 上分别部署了智能合约 ContractA 、 ContractB ,

Alice 与 Bob 将 Acoin 与 Bcoin 分别存入 ContractA 、 ContractB , 

现在开始执行跨链交易: Alice 用 Y Acoin 兑换 Bob 的 X Bcoin。

### 初步改进版
假设 ContractA 的检测逻辑为：

若 Alice 签名 ( Bob 签名 ( Y Acoin == X Bcoin ) ) 则对 Alice 的账户执行扣款，并转账给 B 。
> Bob 不执行下面的最外层动作怎么办？

假设 ContractB 的检测逻辑为：

若 Bob 签名 ( Alice 签名 ( Y Acoin == X Bcoin ) ) 则对 B 的账户执行扣款，并转账给 Alice 。
> Alice 不执行上面的最外层签名怎么办？

### 最终改进版
所以上面的流程设计是有漏洞的，进一步改为以下步骤即可： 

ContractA 的检测逻辑为：

若 Alice 签名 ( Bob 签名( Y Acoin == X Bcoin ) ) 

且 Bob 签名 ( Alice 签名( Y Acoin == X Bcoin ) ) 则对 Alice 的存款额度执行扣款，并转账给 Bob 。

ContractB 的检测逻辑为：

若 Bob 签名 ( Alice 签名 (Y Acoin == X Bcoin ) ) 

且 Alice 签名 ( Bob 签名 ( Y Acoin == X Bcoin ) ) 则对 Bob 的存款额度执行扣款，并转账给 Alice 。

