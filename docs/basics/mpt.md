---
title: MPT 数据结构
slug: /mpt
---
先看一幅图，但不要被吓着，抛开细节不谈，MPT的核心设计思想，其实并不难：

<center> <img src="../picture/mpt1.png" alt="How it Works" width = "100%" height = "100%" /> </center>

<center> MPT 数据结构示意图（图片来自网络） </center>

### MPT 概览

MPT 是 Merkle Patricia Trie 的简写，由 Trie、Patricia Trie、Merkle Tree、Map<Key, Value> 这 4 种数据结构结合设计而成。

Trie的核心思想是数据按构成字段顺序分层存放，不同数据可共享相同前缀，典型例子是字典：比如 foobar 这个词，由 6 个字母组成，分 6 层存储和检索（每层26个字母），如下：

f->o->o->b->a->r

若再存入 foozee 这个词，则其可与 foobar 共享 foo 这个共同前缀，数据存储如下：

f->o->o->b->a->r

-------->z->e->e

若再存入 foozar 这个词，数据存储如下：

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

Patricia Trie 数据：path(foobar) => Hash(50)；

KVS 存储数据：Hash(50) => 50，以及多层 path 对应的一系列 <key, value> 数据。

以 Hash 值为指针/索引的做法，来自 Merkle Tree，所以上文提到 MPT 的整体设计，是由 Trie、Patricia Trie、Merkle Tree、Map<Key, Value> 这4种数据结构结合设计而成。

### MPT 详解

在了解了MPT的整体概貌和设计思想后，以下内容以更详细的方式，论述 MPT 数据结构的设计。

#### 预备知识 1: Radix 与进制

Radix : (numeration system) the positive integer that is equivalent to one in the next higher counting place; e.g.10 is the radix of the decimal system.

Radix的中文翻译是“基数”，这是一个数学专业词汇，具体含义是指数字的进制单位，比如10是十进制系统的基数，也就是0～9的字符个数。类似的 2 是二进制系统的基数（0～1），8 是八进制系统的基数（0～7），16 是十六进制系统的基数（0～F），我们在这里重点关注16进制（Hex）,每个十六进制字符由二进制数的 4 bit 构成，称为 nibble 或半字节。

#### 预备知识 2: Key Value Storage（KVS）

可以把 <Key, Value> Storage/DB（KVS）系统看成是一由 <key, value> Pair 构成的集合，通过 Key 操纵对应的 Value，KVS 系统具备增删改查功能。从 KVS 角度看到的 Value 是广义的、底层的 Data Bytes，其内部结构与字段含义，完全由上层应用程序（比如 MPT）负者构造与解析。从 MPT 的设计思路出发，这里重点关注 Array 数据结构。Array 包含 17 个单元，前 16 个单元是 MPT 程序进行下一步查找需要用到的 Key，最后 1 个单元是狭义的、具体的 Value，其本身仍可能只是一个哈希值，并不是最终数据值。在 MPT 中，Key 和 Value 被统一为相同的哈希值类型进行处理，最终数据值是经过 RLP 编码后的 Bytes，需进行 RLP 解码后，才可继续进行其他操作。MPT 将 KVS 角度看到的 <Key, Value> Pair 改称为 Node（但在某些语境下，Node 只表示Value 部分，而忽略了 Key 部分）。可总结如下：

node1 == <key1, value1> == <key1, array1>

node2 == <key2, value2> == <key2, array2>

key1 == keccak(array1) == hash1 => array1

key2 == keccak(array1) == hash2 => array2

array1 == [i0|i1|i2|i3|i4|i5|i6|i7|i8|i9|ia|ib|ic|id|ie|if|v1]

array2 == [j0|j1|j2|j3|j4|j5|j6|j7|j8|j9|ja|jb|jc|jd|je|jf|v2]

v1 == keccak(rlp(data1)) => rlp(data1) == rlpd1

v2 == keccak(rlp(data2)) => rlp(data2) == rlpd2

#### 预备知识 3: Basic Radix Tries

从 KVS 的角度看，<key, value> Pairs 之间是相互平行的，Pairs 数据集是平坦的，而 Radix Trie 或 MPT 则通过 Key-Path 转换，共享前缀，将平坦的 Pairs 数据集收拢为树状分支结构，整个数据集的状态通过树根的哈希值（RootHash）确定下来，以帮助网络中不同的计算机节点校验并维持数据集的一致性。「Key-Path转换」将初始的 <key, value> 变成 <path, value>。举例说明：

假如我们原本要存储 <'dog'，'description words of the dog'>，若直接存储和查询 KVS 系统是很简单的，只有一次操作：'dog' => 'description words of the dog'。而经过 Radix Trie 的 Key-Path 转换后，以查询 dog 对应的数据值为例，则需进行多次查找：

取得 dog 的十六进制表示：|64|6f|67|；

取得 Path 的 nibble 序列： root -> 6 -> 4 -> 6 -> 15 -> 6 -> 7；

以 RootHash 为 key，取得 array0；

以 array0[6] 为 key，取得 array1；

以 array1[4] 为 key，取得 array2；

以 array2[6] 为 key，取得 array3；

以 array3[15] 为 key，取得 array4；

以 array4[6] 为 key，取得 array5；

以 array5[7] 为 key，取得 array6；

以 array6[16] 为 key，取得 RLP 编码值 rlp(data);

最终解码 rlp(data)，得到 'description words of the dog'。

插入和修改 dog 数据也一样需要经过多次操作，在第一次插入dog数据的时候，假如当前数据集中array3并不存在，则以递归或逆反方式进行操作：

创建并清零 array6， [16] = keccak(rlpBytes)， 插入 <keccak(array6)， array6> pair；

创建并清零 array5， [7] = keccak(array6)， 插入 <keccak(array5)，array5> pair；

创建并清零 array4， [6] = keccak(array5)， 插入 <keccak(array4)，array4> pair；

创建并清零 array3， [15] = keccak(array4)， 插入 <keccak(array3)，array3> pair；

获取并复制出 array2，[6] = keccak(array3)， 插入 <keccak(array2)，array2> pair；

获取并复制出 array1，[4] = keccak(array2)， 插入 <keccak(array1)，array1> pair；

获取并复制出 array0，[6] = keccak(array1)， 插入 <keccak(array0)，array0> pair；

更新 RootHash：RootHash = keccak(array0)。

任何修改操作，必将导致数据哈希值变化，需插入新的 <key, value> pairs 到当前数据集，但并不会对任何已存在的 <key, value> pair 执行更改或删除操作。在不特意执行删除操作时，KVS 系统相当于一个「只增数据库」：不执行更新和删除操作，所有的修改和新增，都将演变为一系列的添加插入操作。

#### Merkle Patricia Trie（MPT）

MPT 是对 Basic Radix Tries 的优化改进。通过上面的 dog 例子，可以看出原始的 key 越长，对应的 path 就越长，而 path 中的每个 nimble 都将对应一个中间层的分支 node，这必将导致「添加、查询、存储」的较高开销，显然需要优化。Radix Tries 进行了「key-path 转换」，有两种 node 类型：空节点 NullNode、分支节点 BranchNode。MPT 则进行了「key-encodedPath 转换」，并新增了两种类型的节点：扩展节点 ExtentionNode、叶子节点 LeafNode。四种节点的数据结构如下：

空节点:   没有数据；

分支节点: 17 元数组；

扩展节点: |encodedPath|hashKey|；

叶子节点: |encodedPath|hashKey|。

若 rlp(data) 的长度小于 hashKey 的长度，则直接存储在 LeafNode 中，否则就得计算出 hashKey 并存储在 LeafNode 中；ExtentionNode 中的 hashKey 指向 BranchNode；encodedPath 将 key-path 所包含的一部分 nimbles 和节点类型 nimble 联合编码在一起，以消除 Radix Tries 中的大量中间层 node、减少计算步骤与存储资源消耗。

nimble(0000)， hex(0)， start(0x00)， Extension, Even

nimble(0001)， hex(1)， start(0x0*)， Extension, Odd

nimble(0010)， hex(2)， start(0x20)， Leaf, Even

nimble(0011)， hex(3)， start(0x3*)， Leaf, Odd

\* 表示 path 的第 1 个 nimble 对应的十六进制字符。

encodedPath示例：

Path Nimbles: f, 2, 3, 4, 5, ...

encodedPath: |1f|23|45|...| ## ExtentionNode

Path Nimbles: e, f, 2, 3, 4, 5, ...

encodedPath: |00|ef|23|45|...| ## ExtentionNode

Path Nimbles: e, f, 2, 3, 4, 5, ...

encodedPath: |20|ef|23|45|...| ## LeafNode

Path Nimbles: f, 2, 3, 4, 5, ...

encodedPath: |3f|23|45|...| ## LeafNode

Path Nimbles: f, 1, c, b, 8, 10 ## 0x10==16，表示终止符。

encodedPath: |3f|1c|b8| ## LeafNode

Path Nimbles: 0, f, 1, c, b, 8, 10 ## 0x10==16，表示终止符。

encodedPath: |20|0f|1c|b8| ## LeafNode

MPT的插入操作示例：

依次插入下面的 <key, value> pair 的操作流程，假设不需要执行 keccak(rlp(key))：

<'do', 'verb'>, <'dog', 'puppy'>, <'doge', 'coin'>, <'horse', 'stallion'>.

<64 6f> => Hverb => keccak(rlp('verb'))

<64 6f 67> => Hpuppy => keccak(rlp('puppy'))

<64 6f 67 65> => Hcoin => keccak(rlp('coin'))

<68 6f 72 73 65> => Hstallion => keccak(rlp('stallion'))

\#\#insert <64 6f> => Hverb

rootHash => |20|64|6f|, Hverb

\#\#insert <64 6f 67> => Hpuppy

rootHash =>	|00|64|6f|, branch1

branch1	=>	|i0|i1|i2|i3|i4|i5|leaf1|i7|i8|i9|ia|ib|ic|id|ie|if|, Hverb

leaf1 =>	|37|, Hpuppy

\#\#insert <64 6f 67 65> => Hcoin

rootHash =>	|00|64|6f|, branch2

branch2	=>	|i0|i1|i2|i3|i4|i5|extn1|i7|i8|i9|ia|ib|ic|id|ie|if|, Hverb

extn1	=>	|07|, branch3

branch3	=>	|i0|i1|i2|i3|i4|i5|leaf2|i7|i8|i9|ia|ib|ic|id|ie|if|, Hpuppy

leaf2 =>	|35|, Hcoin

\#\# insert <68 6f 72 73 65> => Hstallion

rootHash =>	|16|, branch4

branch4 =>	|i0|i1|i2|i3|extn2|i5|i6|i7|leaf3|i9|ia|ib|ic|id|ie|if|, NULL

extn2 =>	|00|6f|, branch2

leaf3 =>	|20|6f|72|73|65|, Hstallion

branch2	=>	|i0|i1|i2|i3|i4|i5|extn1|i7|i8|i9|ia|ib|ic|id|ie|if|, Hverb

extn1	=>	|17|, branch3

branch3	=>	|i0|i1|i2|i3|i4|i5|leaf2|i7|i8|i9|ia|ib|ic|id|ie|if|, Hpuppy

leaf2 =>	|35|, Hcoin

#### 典型 MPT 结构

> Root=>扩展|N|=>分支|1|=>扩展|M|=>分支|1|=>叶子|W|=>Value，（N、M、W 三个字母看起来都呈现出"折叠"的形象）

扩展节点折叠了开头 N 或者中间的 M 个 path-nimbles，叶子节点折叠了最后 W 个 path-nimbles，分支节点只表达开头或中间 1 个 nimble：

折叠起来的 path 象形字符 (N, 1, M, 1, W)。组合运用这三类节点与 encodedPath，MPT 消除了 Radix Trie 中原本需用分支节点实现的大量中间层节点，提高了操作效率并减少了计算与存储成本。

> 注意：执行以上步骤之后，在 KVS 中，branch1 和 leaf1，及其指向的 node 数据，仍然存在，并没有被删除。若把底层的 KVS 中，当前存储的 <key, value> pairs 看作一个超集，历史上出现过的 rootHash 序列则代表各个不同子集。
