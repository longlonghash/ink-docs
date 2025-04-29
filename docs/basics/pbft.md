---
title: 对 PBFT 3F+1 的简洁证明
slug: /pbft
---

### 错误的证明

PBFT 共识算法要求总节点数量 N >= 3F+1，这里给出一个简洁证明。 假设恶意节点数量为 F， 则有：

1、N-F > F 是必须的，这是很明显的，因为大多数人都认同，才能称之为共识，所以诚实节点数量必须大于恶意节点数量；

2、N-F 个诚实节点中，若再有 F 个故障节点（比如宕机、断网），则要求 N-F-F > F，由此得出 N >= 3F+1，证毕。

以上的证明过程对吗？其实不对，因为没有解释清楚：为什么故障节点要和作恶节点取同一个值F？

这个错误，很常见，它错就错在，先假设F个作恶节点，而不是先假设F个故障节点。

正确的做法：先假设系统有F个故障节点，再推导出系统最多可以容忍F个作恶节点。

### 正确的证明

首先在CFT理论中，N - F > F 是已经被证明的，即：

N个节点中有F个故障/宕机，那么剩余N - F个节点数，要超过故障/宕机节点数F。

由此可得 N - F > F => N > 2F => N >= 2F + 1；

然后我们再思考一下，若在剩余的N - F个节点中，还有叛徒/作恶节点，那么正常节点不能少于作恶节点，两者最多平分秋色，

正常节点数至少要占一半，不少于 N - F / 2 ，且这 N - F / 2 个正常节点还要比宕机节点F要多，对吧？

因此：(N - F) / 2 > F => N - F > 2F => N > 3F => N >= 3F + 1。此时才真正完成整个证明过程，不难理解吧？

当N = 3F + 1时，就意味着系统刚好可以容忍F个宕机、F个作恶，而剩余F+1个正常工作。

这里最关键、最核心的点，就是必须领悟：为什么这里假设有F个故障节点，就刚好要取值F个作恶节点。

### 关键词

脑裂、分区、CAP理论、Raft、Paxos、CFT、BFT、PBFT、PoW、PoS

https://raft.github.io

https://github.com/ongardie/raftscope

https://github.com/TheDhejavu/raft-consensus

https://github.com/tikv/raft-rs

https://fisco-bcos-doc.readthedocs.io/zh-cn/latest/docs/design/consensus/raft.html

