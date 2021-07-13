---
title: Bifrost 的 SALP 设计方案
slug: /bifrost2
---

Bifrost 项目的定位，就是为质押资产（或被锁定的资产）提供流动性，并从 Polkadot 生态起步，逐步拓展到其他公链生态。针对 Polkadot 的 Staking 和 Slot 竞拍机制，Bifrost 分别设计了 SLP 与 SALP 两大方案，为其中的锁定资金，提供释放流动性释放服务。本篇先讲述 SALP 设计方案。

### Slot 竞拍概述
Polkadot采取了中继链与平行链协同工作的设计方案。多个平行链共享同一个中继链提供的共识安全性。中继链能够支撑的平行链数量是有限的，某个平行链能够接入中间链运行，则必先拥有中继链的区块槽位（Slot），因此 Polkadot 设计了 PLO（Parachain Lease Offering）槽位竞拍与 Crowdloan 机制。

简单来说，平行链项目竞拍 Slot，需锁定、质押较高额度的中继链代币（DOT/KSM），这些资金或来自于平行链项目方自身，或由项目方在社区中通过众筹（Crowdloan）活动募集而来。平行链项目方通常会承诺给予社区支持者一定额度的回报，比如平行链项目自身发行的代币（Parachain Token）。Slot 竞拍规则的具体细节，可参考：https://wiki.polkadot.network/docs/en/learn-auction

### 释放 Slot 竞拍锁定资金的流动性

<img src="../picture/bifrost-salp-plo1.png" alt="How it Works" />

<center>原始的 SLOT 竞拍交互时序图</center>

<img src="../picture/bifrost-salp-plo2.png" alt="How it Works" />

<center>通过Bifrost 平台进行 SLOT 竞拍的交互时序图</center>

### 两个交易池（Swap Pool）的设计

<img src="../picture/bifrost-salp-bancor1.png" alt="How it Works" />

<center>vsDOT/vsKSM 承兑交互时序图</center>

### 改造后的 Bancor 算法

<img src="../picture/bifrost-salp-bancor2.png" alt="How it Works" />

<center>vsDOT/vsKSM 承兑交互时序图</center>


