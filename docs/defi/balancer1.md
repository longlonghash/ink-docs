---
title: Balancer 交易等式解析
slug: /balancer1
---

Balancer 提供了 2 种以上 Token 组合交易与提供单币种流动性的功能。

<center> <img src="../picture/blancer-coordinate.png" alt="How it Works" width = "70%" height = "70%" /> </center>

<center> 3 种 Token 对应的坐标与曲面 （图片来自 Blancer 白皮书）</center>

### 用拉格朗日乘数法分析 Balancer 等式
我们举一个实际的例子来分析 Balancer 的无常损失的最低点是如何求出来的。

对两种 Token 的交易等式，有

> (X^1) \* (Y^2) = V^3，指数 1 和 2 表示权重

做一次等价变形，1 和 2 分别对应 1/3 和 2/3，可得

> (X^(1/3)) \* (Y^(2/3)) = V

为了更方便进行讲述，以下仍然采取整数形式的等式写法

> (X^1) \* (Y^2) = V^3 => X \* (Y^2) = V^3

如何发现这种交易的的无常损失的最低点呢？Balancer 白皮书采取求偏导的方法来求解最低点。

这里使用拉格朗日乘数法，可使计算过程更加清晰简单：

令 F(X,Y) = X+Y 作为我们得目标函数（因为这个函数值最小即得无常损失最低，参见 Curve 的 X+Y=K 等式），根据拉格朗日乘数法，引入

> C \* (X\*(Y^2) - V^3) = 0，C 是任意常数

对 F(X,Y) = X+Y + C\*(X\*(Y^2)-V^3) 求两个偏导数，并形成方程组
> Fx = 1 - C\*(Y^2) = 0
> 
> Fy = 1 - 2CXY = 0

可解得 Y = 2X

### Blancer，Uniswap 与黄金分割 
若 X 和 Y 的指数都是 1，那么 Balancer 的等式，就会变成 Uniswap 的 X\*Y=K 等式。但 Balancer 提供了一个很优秀的特性，用户可用单个币种取提供流动性，在这种情况下，白皮书里面提供了如下等式：


未完，待续...

