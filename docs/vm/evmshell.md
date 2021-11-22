---
title: EvmShell 的设计
slug: /evmshell
---

- (EvmShell 可执行程序) => (命令行外壳程序) + (EVM 虚拟机) + (RocksDB 存储)
- (命令行外壳程序) => 从命令行参数获取并解析 (TransactionRawData 交易数据)，然后驱动 (EVM 虚拟机) 进行处理
- (命令行外壳程序) => 从命令行参数获取 (Account 账户数据)，并直接导入 (RocksDB 存储) 
- (TransactionRawData 交易数据) => 分为 3 种，分别是 (ContractCreate 合约创建交易数据)、(ContractCall 合约调用交易数据)、(EOA 账户转账交易数据)，处理方式各有不同
- (ContractCreate 合约创建交易数据) => 创建合约账户
- (ContractCall 合约调用交易数据) => 执行合约对应的 Code
- (EOA 账户转账交易数据) => Alice 给 Bob 转 5 ETH，不涉及 EVM，但需修改 Alice 和 Bob 的账户数据（Value、Nonce）
- (EVM 虚拟机)  => 执行 (合约程序 C)，通常需获取并修改 C 账户自身的 (Account 账户数据) 以及 (StorageTrie)
- (合约程序 C) => 可能调用了 (合约程序 D)，所以 (合约程序 D) 的 (Account 账户数据) 也可能被修改
- (合约程序 C) 或 (合约程序 D) = > 可能会给 Alice、Bob 地址转账 ETH，所以 Alice、Bob 地址对应的 (Account 账户数据) 也可能被修改
- Event/Logs 的输出？输出到什么地方？待补充...
- 预编译合约，如何处理？如何集成进来？？？待补充...


