---
title: MMR，追加与拱起的游戏
slug: /mmr
---
### Reference

- [OpenTimestamps](https://github.com/opentimestamps/opentimestamps-server/blob/master/doc/merkle-mountain-range.md)
- [Grin](https://docs.grin.mw/wiki/chain-state/merkle-mountain-range)

### MMR (Merkle Mountain Range)

在俄罗斯方块游戏中，只要界面中的小方块完整连续成一行，这一行就会被消除掉，游戏者和旁观者看到这一幕时，心情都会很舒适、很愉悦。也许我们读懂 Merkle Mountain Range (MMR)的游戏规则之后，也会感到很愉悦，只不过MMR的规则不是消除，而是不断地在追加、拱起方块。具体的游戏规则是这样的：

初始状态是一张白纸，什么内容也没有，现在开始从白纸底部第1行追加方块

追加一个方块，在纸上记下 0

0

追加一个方块：在纸上记下 1

0&nbsp&nbsp&nbsp1

方块0 和 方块1 都排在第 1 行，所以方块0 和 方块1 的高度都是 1，MMR的规则设定了白纸中的任意一行只要[新出现]两个相同高度的方块，这两个方块就要拱起生成一个新的方块放置在上方，于是白纸当前的状态变为：

&nbsp&nbsp2

0&nbsp&nbsp&nbsp1  （0与1拱起2）

追加一个方块：在纸上记下 3

&nbsp&nbsp2

0&nbsp&nbsp&nbsp1&nbsp&nbsp&nbsp3

追加一个方块：在纸上记下 4

&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp6

&nbsp&nbsp2&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp5（2与5拱起6）

0&nbsp&nbsp&nbsp1&nbsp&nbsp&nbsp3&nbsp&nbsp&nbsp4 （3与4拱起 5）

持续追加到白纸上出现19个方块（0～18），对应的图案模式应该是：

L3&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp14

L2&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp6&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp13

L1&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp2&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp5&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp9&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp12&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp17

L0&nbsp&nbsp&nbsp&nbsp0&nbsp&nbsp&nbsp1&nbsp&nbsp&nbsp3&nbsp&nbsp&nbsp4&nbsp&nbsp&nbsp7&nbsp&nbsp&nbsp8&nbsp&nbsp&nbsp10&nbsp&nbsp&nbsp11&nbsp&nbsp&nbsp15&nbsp&nbsp&nbsp16&nbsp&nbsp&nbsp18

MMR_ROOT = HASH(PEAK_14 | HASH(PEAK_13 | HASH(PEAK_17 | PEAK_18)))

若将这些方块按编号依次排放到一行，并在下一行的对应位置写下每一个方块的高度，可得：

0&nbsp&nbsp1&nbsp&nbsp2&nbsp&nbsp3&nbsp&nbsp4&nbsp&nbsp5&nbsp&nbsp6&nbsp&nbsp7&nbsp&nbsp8&nbsp&nbsp9&nbsp10&nbsp11&nbsp12&nbsp13&nbsp14&nbsp15&nbsp16&nbsp17&nbsp18

0&nbsp&nbsp0&nbsp&nbsp1&nbsp&nbsp0&nbsp&nbsp0&nbsp&nbsp1&nbsp&nbsp&nbsp2&nbsp&nbsp0&nbsp&nbsp0&nbsp&nbsp1&nbsp&nbsp0&nbsp&nbsp0&nbsp&nbsp1&nbsp&nbsp&nbsp2&nbsp&nbsp3&nbsp&nbsp0&nbsp&nbsp0&nbsp&nbsp1&nbsp&nbsp&nbsp0

若每个小方块，不依次编号，直接用其对应的高度进行表示，可直接得出第2行的高度数字序列：

0 追加1个

00 => 001 追加1个，拱起1次

0010 追加1个

00100 => 001001 => 0010012 追加1个，拱起2次

00100120 追加1个

001001200 => 0010012001 追加1个，拱起1次

00100120010 追加1个

001001200100 => 0010012001001 => 00100120010012 => 001001200100123 追加1个，拱起3次

0010012001001230 追加1个

00100120010012300 => 001001200100123001 追加1个，拱起1次

0010012001001230010 追加1个

