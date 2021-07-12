---
title: Curve 与 X+Y=K
slug: /curve1
---

在 Uniswap 智能合约中，需维持 X\*Y=K 恒等式与对应曲线，这是因为 Uniswap 是通用 AMM，没有对参与交易的 Token 做特别的限定与假设。而 Curve 则有所不同，其假设参与交易的 Token 币值相对稳定，价格不会出现大幅度波动，比如 DAI 与 USDC 互相兑换，其比例通常非常接近 1 ：1，如下图所示。有了这种假设之后，继续采取 X\*Y=K 的恒等式和曲线就不太合适了。

<img src="../picture/curve-dai-usdc.png" alt="How it Works" />

### X+Y=K 的特性
观察 X+Y=K 这个公式，K代表交易池的流动性规模，若有人卖出 Y Token 获得 X Token，则 X 减少 A，则 Y 增长 A，因为 X 与 Y 在理想状态下的价值是等同的。

### 曲线拟合
在正常状态下，稳定币之间的真实交易曲线应该接近 X+Y=K 曲线（相切于二维坐标（K/2，K/2）点），然而在交易市场中，X Token 与 Y Token 确实会存在一定程度的价值比例波动，AMM 也必须接受任意量的 Token 抛售行为，所以为了应对这些特殊情况，交易曲线又得具备 X\*Y=K'的特性，K' = (K/2)^2。

<img src="../picture/curve-coordinate.png" alt="How it Works" />

Curve 选择了在 X+Y=K 和 X\*Y=K' 两个曲线之间进行拟合，具体的拟合方式就是对每个曲线分别取 a 与 b 为权重:

a(X+Y-K) + b(X*Y-K') = 0 现在对其进行优化，

未完，待续...

