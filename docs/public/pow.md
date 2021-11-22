---
title: 超简单的 PoW 算法实例
slug: /pow
---

### 超简单的设计

以下代码来自 Substrate Recipes 教程，感觉其算法设计的极致简单，所以将其摘录于此，其核心设计思想： 

> 将难度值与哈希值看作是 256 bit 的大整数，计算 (难度值 * 哈希值) 的值，若乘积溢出，则说明哈希值过大，不符合当前 PoW 挖矿难度要求，若乘积没有溢出，则 PoW 挖矿命中。

```rust

    // https://github.com/JoshOrndorff/recipes/blob/master/consensus/sha3pow/src/lib.rs
    /// Determine whether the given hash satisfies the given difficulty.
    /// The test is done by multiplying the two together. If the product
    /// overflows the bounds of U256, then the product (and thus the hash)
    /// was too high.
    pub fn hash_meets_difficulty(hash: &H256, difficulty: U256) -> bool {
	    let num_hash = U256::from(&hash[..]);
	    let (_, overflowed) = num_hash.overflowing_mul(difficulty);

	    !overflowed
    }

    // https://github.com/JoshOrndorff/recipes/blob/master/nodes/basic-pow/src/service.rs
	// Start Mining
	let mut nonce: U256 = U256::from(0);
	thread::spawn(move || loop {
		let worker = _worker.clone();
		let metadata = worker.lock().metadata();
		if let Some(metadata) = metadata {
		    let compute = Compute {
			    difficulty: metadata.difficulty,
			    pre_hash: metadata.pre_hash,
			    nonce,
			};
			let seal = compute.compute();
			if hash_meets_difficulty(&seal.work, seal.difficulty) {
				nonce = U256::from(0);
				let mut worker = worker.lock();
				worker.submit(seal.encode());
			} else {
				nonce = nonce.saturating_add(U256::from(1));
				if nonce == U256::MAX {
					nonce = U256::from(0);
				}
			}
		} else {
			thread::sleep(Duration::new(1, 0));
		}
	});

```





