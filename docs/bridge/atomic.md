---
title: 原子跨链交易
slug: /atomic
---
### 问题描述

思考一个问题：Alice 有 2 BTC，Bob 有 10 ETH，Alice 与 Bob 通过网络进行交易，互相并不认识，互相并不信任，如何在没有第三方担保与中介机构的情况下顺利完成交易？因为双方互不信任，所以没有人敢先发送交易到对方，因为接收方在收到资金后，可随时离线，不再做出任何回应。

上述问题，这就是原子跨链交易问题（Atomic Cross-Chain Swap）（俗语：一手交钱、一手交货），即：交易要么完全成功，要么完全失败，在失败的情况下，不能让任何参与者遭受资金损失（交易上链手续费、Gas费，除外）。

### 哈希时间锁合约

要想完成原子跨链交易，需要依赖哈希时间锁合约（ HTLC，Hash Time Lock Contracts ）技术。

> 注意：Bitcoin 具备有限的智能合约功能，只是没有 Ethreuem 智能合约功能灵活（图灵完备）

其原理如下：

Alice 与 Bob 互相交换账户地址信息；

Alice 生成随机数 secret , 并计算出该随机数的哈希值 hs = hash(secret)；

Alice 发送 hs 给 Bob；

Alice 与 Bob 设置智能合约的各种参数（地址信息、hs、时间段 T1 比时间段 T2 足够长...）；

Alice 设定条件：任何人能在 T1 时间段内出示 hs 的原像 secret，就将 2 BTC 发送到 Bob 的对应账户；

Bob 设定条件：任何人能在 T2 时间段内出示 hs 的原像 secret，就将 10 ETH 发送到 Alice 的对应账户；

Alice 必须先出示 secret (因为只有Alice知道 secret), 获得 10 ETH；

Alice 出示 secret，Bob 也就获悉了 secret，由于 T1 > T2, Bob 有足够的时间去发送交易，出示 secret，获得 2 BTC，交易全部成功；

Alice 一直不出示 secret，则等待时间 T2 之后，智能合约可自动回退 10 ETH 给 Bob，等到 T1 之后，系统也将自动回退 2 BTC 给 Alice，交易全部失败。

<img src="../picture/atomic-swap-htlc.png" alt="How it Works" />

<center>图片来自《A Game-Theoretic Analysis of Cross-Chain Atomic Swaps with HTLCs》</center>


### 简单总结

Alice 和 Bob 通过智能合约锁定各自的资产，Alice 公开出示 secret 可获得 Bob 锁定的资产，同时 Bob 也获悉了 secret，可获得 Alice 锁定的资产，若超过设定的时间，Alice 没有出示 secret，智能合约中锁定的资产会自动回退给双方。通过在智能合约中设定密钥和合理的时间段，巧妙地实现了"原子交易"功能。
