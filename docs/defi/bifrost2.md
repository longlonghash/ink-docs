---
title: Bifrost SALP 设计方案
slug: /bifrost2
---

Bifrost 项目的定位，就是为质押资产（或被锁定的资产）提供流动性，并从 Polkadot 生态起步，逐步拓展到其他公链生态。针对 Polkadot 的 Staking 和 Slot 竞拍机制，Bifrost 分别设计了 SLP 与 SALP 两大方案，为其中的锁定资金，提供释放流动性释放服务。本篇先讲述 SALP 设计方案。

### Slot 竞拍概述
Polkadot采取了中继链与平行链协同工作的设计方案。多个平行链共享同一个中继链提供的共识安全性。中继链能够支撑的平行链数量是有限的，某个平行链能够接入中间链运行，则必先拥有中继链的区块槽位（Slot），因此 Polkadot 设计了 PLO（Parachain Lease Offering）槽位竞拍与 Crowdloan 机制。

简单来说，平行链项目竞拍 Slot，需锁定、质押较高额度的中继链代币（DOT/KSM），这些资金或来自于平行链项目方自身，或由项目方在社区中通过众筹（Crowdloan）活动募集而来。平行链项目方通常会承诺给予社区支持者一定额度的回报，比如平行链项目自身发行的代币（Parachain Token）。Slot 竞拍规则的具体细节，可参考：https://wiki.polkadot.network/docs/en/learn-auction

### 释放 Slot 竞拍锁定资金的流动性

投资者直接参与 Slot 竞拍、Crowdloan 活动，与通过 Bifrost SALP 方案进行 Slot 竞拍、Crowdloan 活动的流程对比如下:

<center> <img src="../picture/bifrost-salp-plo1.png" alt="How it Works" width = "90%" height = "90%" /> </center>

<center>原始的 SLOT 竞拍交互时序图</center>

<img src="../picture/bifrost-salp-plo2.png" alt="How it Works" />

<center>通过Bifrost 平台进行 SLOT 竞拍的交互时序图</center>
 

从系统设计的顶层视图看，投资者用户通过 Bifrost 参与平行链项目的 PLO 众筹活动，Contribute 行为会分离解耦出两类 Token 资产：vsToken（vsDOT/vsKSM）与 vsBond。投资者贡献 x DOTs/KSMs，可获得 x vsDOTs/vsKSMs 与 x vsBond。

vsBond 代表具体的平行链及其竞拍成功的 Lease Period 。所以 vsBond 的全名为:vsBond + 平行 链名称 + Slot 租约到期日，比 如:vsBond-Bifrost-2022-06-01。vsBond 拥有两个主要属性:

- 1.平行链竞拍成功奖励: vsBond 可通过 XCMP 转移 到对应的平行链上，然后只需要识别持有 vsBond 的地址并发放奖励即可。

- 2.与 vsToken 结合可在平行链租期到期后进行 1:1 赎回。

所以可将 vsBond 看成是蕴含了 Contribution Reward 与 1:1 赎回权的特殊商品。vsBond 作为权 益凭证，并不需要高流动性交易，可通过一口价形 式挂单出售，因此 Bifrost 系统设计有挂单售卖 vsBond 的机制，类似于 NFT 买卖市场，无需创建流动性池。

### 两个交易池（Swap Pool）的设计

与 vsBond 不同，所有的 vsToken 都是同质的，vsToken 不与特定的平行链及 Slot 绑定。Bifrost 设计了两个兑换池子：1:1承兑池、Bancor池（1:x, x < 1）。具体的兑换规则如下：
- 1、用户同时持有 vsBond-ID 和 vsToken，且 vsBond-ID 所代表的 Slot 租约已到期，则可参与承兑池以1:1的价格兑换出 Token;
- 2、若用户只有 vsToken，则可参与 Bancor 池，以1:x（x < 1）的价格兑换出 Token（Bancor 池中存放有 Token 时，用户才可正常执行兑换功能）。
- 3、当Slot租约到期时，Relaychain 将返还 Token 到 Bifrost，系统会将所有的 Token 放入 1:1 承兑池，然后每天从 1:1 承兑池的余额中抽取 5% 放入 Bancor 池。
- 4、若系统丢失 vsBond 或者某些攻击者故意囤聚 vsBond 而不愿意卖出，vsToken 持有者仍然可以从 Bancor 池中兑换出 Token，而不用担心 vsToken 不能兑付的风险。
- 5、系统注入到 Bancor 池的资金，会以线性平滑的机制逐渐释放,而不是一次性全部释放，防止 vsToken 与 Token 兑换价格不合理地大幅度波动。相当于系统在用一部分 Token 持续购买用户持有的 vsToken。
- 6、只要在 Bancor 池中发生1:x（x < 1）的兑换行为，系统（Bifrost）必然会盈利，这部分利润将进入国库,用于社区发展或回购 BNC。


<img src="../picture/bifrost-salp-bancor1.png" alt="How it Works" />

<center>vsDOT/vsKSM 承兑交互时序图</center>

### 改造后的 Bancor 算法

<center> <img src="../picture/bifrost-salp-bancor2.png" alt="How it Works" width = "80%" height = "80%" /> </center>

<center>改造后的 Bancor 价格曲线</center>

未完，待续...
