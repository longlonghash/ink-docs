---
title: P2P 网络的开发实现
slug: /p2p
---

### 当前已实现的 P2P 网络组件

在一个公链系统中，P2P 网络通信模块通常负责分布在全球各地的节点组网、区块（Block）和交易（Transaction）数据的广播发送与接收。目前可选的 P2P 实现方式比较多，有的基于 QUIC 协议实现，但未被大范围采用，可能是因为其安全性未经长时间的实践检验，较为通用的公链 P2P 功能实现有以下 3 种：

- 1、Bitcoin 所采用的 Gossip 协议实现；

- 2、Etherum 所采用的 DevP2P 实现；

- 3、Polkadot 所采用的 LibP2P 实现。

### 公链 P2P 网络的功能实现需求

若需实现以下功能目标与交付物，我倾向于去移植 Rust 语言实现的 DevP2P 或 LibP2P，

- 1、新节点可自由加入或退出全球 P2P 网络；

- 2、需支持没有公网 IP 地址的节点加入全球 P2P 网络；

- 3、实现对任意消息数据的全球广播与接收；

- 4、功能和性能至少和 Ethereum 的 P2P 网络持平；

- 5、给出 DevP2P 与 LibP2P 在功能与性能等方面的差异对比；

- 6、需交付可正常编译运行的 Rust 源代码（支持 Linux、Windows、macOS 等常见 OS 平台）；

- 7、设计文档、配置文档、操作文档。

### DevP2P 

- 研究 DevP2P 的时候，想明白了：为什么放着成熟的 SSL/TLS 协议不用，偏要重新发明一套加密传输协议（RLPx）呢？原因是 TLS/SSL 依赖数字证书和 CA，而 RLPx 只依赖公钥和私钥，这样才能确保去中心化。可以认为 RLPx 是简化版的 TLS。

- 以太坊的 DevP2P 采取了 KAD 算法，但实际上以太坊并没有用到 KAD 的绝妙之处（节点定位能力），这里就有较大的设计与折腾空间，容易出研究成果。


有不少人建议我用LibP2P，但我知道DevP2P经历过日蚀攻击，做过改进，经历过实践检验，是安全的，LibP2P呢？而且DevP2P非常轻量级，容易改造，比如把所有TCP协议都换成UDP/QUIC协议也是可以尝试的。

LibP2P运用在公链中，还没有经历过真正的实践检验，以后再移植也来得及，DevP2P伴随以太坊系统至少稳定运行这么多年了。

参考这篇论文《Eclipsing Ethereum Peers with False Friends》: Our false friends attack exploits the Kademlia-inspired peer discovery logic used by Geth and enables a low-resource eclipsing of long- running, remote victim nodes. An adversary only needs two hosts in distinct /24 subnets to launch the eclipse, which can then be leveraged to filter the victim’s view of the Blockchain.

找到了一个，https://github.com/maidsafe/quic-p2p
可以看下you链已在以太坊上实现了
日蚀攻击是上层协议的事，跟devp2p联系不大，已经有项目基于devp2p实现了quic
noise protocol不知道是不是更适合做key exchange

目前能搞定以下内容的团队有没有？（这些都是非常老的内容了），仅此一例，就不难想象出在软件设计与实现这一块，差距有多么大，ETH-1.0：Account账户模型设计、RLP(受Lisp启发的数据编解码算法)、MPT(Trie-KV-DB)、Solidity编程语言设计与编译器实现、EVM虚拟机的设计与实现、GHOST共识算法、Dagger-Hashimoto/Ethash挖矿算法、KAD-P2P组网技术。

所以，一个P2P交易撮合系统，配合跨链原子交易，能够模拟出资产跨链操作，但用户需要承担资产流入流出可能导致的价格差异风险。对于实现了图灵完备的合约功能的公链，则可以采用Plasma协议，在理论上确保虚拟资产的流转安全。

今天又爆发了一个灵感：用跨链原子交易技术，配合自动撮合系统，RBC可以实现和BTC系统之间的资产双向流动问题。坚决不用LowB的多重签名方案执行资产跨链操作。💪

未完，待续...


