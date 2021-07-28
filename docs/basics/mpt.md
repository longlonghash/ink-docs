---
title: MPT 数据结构简介
slug: /mpt
---
先看一幅图，但不要被吓着，抛开细节不谈，MPT的核心设计思想，其实并不难：

<center> <img src="../picture/mpt1.png" alt="How it Works" width = "100%" height = "100%" /> </center>

<center> MPT 数据结构示意图（图片来自网络） </center>

### MPT
MPT 是 Merkle Patricia Trie 的简写，由 Trie、Patricia Trie、Merkle Tree、Map<Key, Value> 这 4 种数据结构结合设计而成。

Trie的核心思想是数据按构成字段顺序分层存放，不同数据可共享相同前缀，典型例子是字典：比如 foobar 这个词，由 6 个字母组成，分 6 层存储和检索（每层26个字母），如下：

f->o->o->b->a->r

若再存入 foozee 这个词，则其可与 foobar 共享 foo 这个共同前缀，数据存储如下：

f->o->o->b->a->r

-------->z->e->e

若再存入foozar这个词，数据存储如下：

f->o->o->b->a->r

-------->z->e->e

----------->a->r

但是每个字母占据一个层次的设计，比较浪费存储空间，所以可将多个字段一起压缩到一个层次，形成 Patricia Trie，如下：

foo->bar

---->z->ee

------->ar


Trie 或 Patricia Trie 结合“哈希指针”的概念，就能实现对 <Key, Value> 数据的存储和检索。比如：

<foobar, 50> <foozee, 300> <foozar, 6000>

foo->bar->Hash(50) => 50

---->z->ee->Hash(300) => 300

------->ar->Hash(6000) => 6000

健值对 <foobar, 50> 可被转换为 <path(key)，hash(value)>，由 Patricia Trie 数据结构进行管理，而在 Key Value Storage(KVS) 数据库中，则存放 <Hash(50), 50> 以及 path 所对应的一系列 <key, value> 数据。可简单总结如下：

原始数据：<foobar, 50>，或表示为 foobar => 50；

Patricia Trie数据：path(foobar) => Hash(50)；

KVS 存储数据：Hash(50) => 50，以及多层 path 对应的一系列 <key, value> 数据。

以 Hash 值为指针/索引的做法，来自 Merkle Tree，所以上文提到 MPT 的整体设计，是由 Trie、Patricia Trie、Merkle Tree、Map<Key, Value> 这4种数据结构结合设计而成。

未完，待续...
