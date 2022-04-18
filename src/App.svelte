<script>
	import { Canvas, Layer, t } from "svelte-canvas";
	import { fade, fly } from "svelte/transition";
	import Bar from "./Bar.svelte";
	function scale(val, max) {
		return Math.floor(val * max);
	}
	function scaleExp(val, max) {
		return Math.floor(max ** val);
	}
	const arrayOptions = [
		{ id: 1, text: "Random" },
		{ id: 2, text: "Almost Sorted" },
		{ id: 3, text: "Most Elements Sorted" },
		{ id: 4, text: "Sorted" },
		{ id: 5, text: "Reversed" },
		{ id: 6, text: "Custom" },
	];
	const sortOptions = [
		{
			name: "Simple",
			options: [
				{ id: 1, text: "Insertion" },
				{ id: 2, text: "Selection" },
				{ id: 3, text: "Bubble" },
			],
		},
		{
			name: "Normal",
			options: [
				{ id: 4, text: "Quick" },
				{ id: 5, text: "Merge" },
				{ id: 6, text: "Heap" },
			],
		},
		{
			name: "Esoteric",
			options: [
				{ id: 14, text: "Cocktail" },
				{ id: 15, text: "Odd-Even" },
				{ id: 16, text: "2 Way Selection" },
				{ id: 17, text: "Gnome" },
				{ id: 18, text: "Cycle" },
				{ id: 19, text: "Shell 1" },
				{ id: 20, text: "Shell 2" },
				{ id: 21, text: "Shell 3" },
				{ id: 22, text: "Comb" },
				{ id: 23, text: "Shaker" },
			],
		},
		{
			name: "Value based",
			options: [
				{ id: 7, text: "Counting" },
				{ id: 8, text: "Radix LSD (Base 2)" },
				{ id: 9, text: "Radix MSD (Base 4)" },
				{ id: 10, text: "Radix LSD (Base 256)" },
				{ id: 11, text: "Radix MSD (Base 64)" },
			],
		},
		{
			name: "Hybrid",
			options: [
				{ id: 12, text: "Bucket (16 Buckets)" },
				{ id: 13, text: "Bucket (256 Buckets)" },
				{ id: 24, text: "Tim" },
			],
		},
		{
			name: "Fastest",
			options: [
				{ id: 25, text: "Slow" },
				{ id: 26, text: "Bogo" },
			],
		},
	];
	const displayOptions = [
		{ id: 1, text: "Bars" },
		{ id: 2, text: "Flipped Bars" },
		{ id: 3, text: "Scatterplot" },
		{ id: 4, text: "Rainbow" },
		{ id: 5, text: "Image" },
		{ id: 6, text: "Spiral Bar" },
		{ id: 7, text: "Spiral" },
		{ id: 8, text: "Color Wheel" },
		{ id: 9, text: "Lines" },
		{ id: 10, text: "Lines Circle" },
	];
	const audioOptions = [
		{ id: 0, text: "None" },
		{ id: 1, text: "Audio 1" },
		{ id: 2, text: "Audio 2" },
		{ id: 3, text: "Audio 3" },
		{ id: 4, text: "Audio 4" },
	];
	const MIN_INTERVAL = 10,
		MAX_VALUE = 30000;
	const timer = (ms) => new Promise((res) => setTimeout(res, ms));
	const width =
			screen.width > 1000 ? screen.width * 0.7 : screen.width * 0.95,
		height = Math.min(width, screen.height * 0.7);
	let size = scale(Math.random() ** 2, 100) + 3,
		speedAdjust = 0.5,
		algorithm = 1,
		arrayType = 1,
		arrayAdjust = 0.5,
		sortType = 1,
		displayType = 1,
		audioType = 0;
	let speed = 1,
		arr = [],
		maxVal = 0;
	function updArr(val = null) {
		sortID++;
		paused = -1;
		speed = 1;
		size = Math.max(Math.min(size, 10000), 1);
		if (arrayType != 6) arr = Array.from({ length: size }, (v, i) => i + 1);
		switch (arrayType) {
			case 1:
				for (let i = arr.length - 1; i >= 0; i--) {
					let j = scale(Math.random(), i + 1);
					[arr[i], arr[j]] = [arr[j], arr[i]];
				}
				break;
			case 2:
				let d = scaleExp(arrayAdjust, arr.length);
				for (let i = 0; i < arr.length; i++) {
					let a = Math.floor(Math.min(i, d));
					let j = i - scale(Math.random() ** 2, a);
					[arr[i], arr[j]] = [arr[j], arr[i]];
				}
				break;
			case 3:
				let swaps = scaleExp(arrayAdjust, arr.length);
				while (swaps--) {
					let i = scale(Math.random(), size),
						j = scale(Math.random(), size);
					[arr[i], arr[j]] = [arr[j], arr[i]];
				}
				break;
			case 4:
				break;
			case 5:
				arr.reverse();
				break;
			case 6:
				if (!val) break;
				arr = val
					.split(/[^0-9]/)
					.filter((x) => x)
					.map((x) => Math.max(1, Math.min(MAX_VALUE, x)));
				size = arr.length;
				break;
		}
		maxVal = Math.max(...arr);
	}
	let sortID = 0,
		step = 1,
		paused = true,
		time,
		speedup = "",
		steps;
	async function displayEvent(curID, a = null, b = null) {
		if (curID != sortID) return true;
		if (a) {
			arr[a] *= -1;
			playNote(arr[a] / maxVal);
		}
		if (b) {
			arr[b] *= -1;
		}
		await timer(time);
		while (paused == 1) await timer(200);
		if (curID != sortID) return true;
		if (a) arr[a] *= -1;
		if (b) arr[b] *= -1;
		return false;
	}
	async function insertionSort() {
		let curID = ++sortID;
		for (let i = 0; i < size; i++) {
			if (step >= size) {
				if (curID != sortID) return;
				let a = [],
					aa = Math.ceil(step / size),
					newSteps = 0;
				for (let j = i; j <= i + aa && j < size; j++) {
					a.push(arr[j]);
				}
				a.sort((a, b) => a - b);
				aa = a.length;
				for (let j = i - 1; j >= 0 && aa > 0; j--) {
					if (arr[j] > a[aa - 1]) {
						arr[j + aa] = arr[j];
						newSteps += aa;
					} else {
						arr[j + aa] = a[aa - 1];
						aa--;
						j++;
					}
				}
				for (let j = 0; j < aa; j++) arr[j] = a[j];
				i += a.length - 1;
				if (step - (steps % step) < newSteps) {
					if (await displayEvent(curID)) return;
					await timer((time * newSteps) / step);
				}
				steps += newSteps;
				continue;
			}
			for (let j = i; j > 0; j--) {
				if (curID != sortID) return;
				if (arr[j] >= arr[j - 1]) {
					break;
				}
				[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];

				if (++steps % step == 0) {
					if (await displayEvent(curID, j, j - 1)) return;
				}
			}
		}
		sortID++;
	}
	async function selectionSort() {
		let curID = ++sortID;
		let a = [];
		for (let i = 0; i < size; i++) {
			a[arr[i]] = i;
		}
		for (let i = 0; i < size; i++) {
			if (step >= size && arrayOptions != 6) {
				if (curID != sortID) return;
				a[arr[i]] = a[i + 1];
				[arr[a[i + 1]], arr[i]] = [arr[i], arr[a[i + 1]]];
				if (step - (steps % step) < size - i - 1) {
					if (await displayEvent(curID, i)) return;
				}
				steps += size - i - 1;
				continue;
			}
			for (let j = i + 1; j < size; j++) {
				if (curID != sortID) return;
				if (arr[j] < arr[i]) {
					[arr[j], arr[i]] = [arr[i], arr[j]];
					[a[arr[j]], a[arr[i]]] = [a[arr[i]], a[arr[j]]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, j, i)) return;
				}
			}
		}
		sortID++;
	}
	async function bubbleSort() {
		let curID = ++sortID,
			last = arr.length,
			newLast;
		while (last > 0) {
			newLast = 0;
			for (let i = 1; i < last; i++) {
				if (curID != sortID) return;
				if (arr[i] < arr[i - 1]) {
					newLast = i;
					[arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, i - 1)) return;
				}
			}
			last = newLast;
		}
		sortID++;
	}
	async function quickSort(l = 0, r = size - 1, curID = ++sortID) {
		if (l >= r) return;
		let a = arr.slice(l, r + 1),
			newSteps = Math.ceil((r - l + 1) * Math.log2(r - l + 1));
		if (newSteps < step) {
			a.sort((a, b) => a - b);
			arr.splice(l, a.length, ...a);
			if (step - (steps % step) < newSteps) {
				await timer(time);
			}
			steps += newSteps;
			return;
		}
		let mi = Math.min(...a),
			ma = Math.max(...a);
		if (mi == ma) return;
		let m = (mi + ma) / 2,
			x = l,
			mid;
		for (let i = 0; i < a.length; i++) {
			if (curID != sortID) return;
			if (a[i] <= m) {
				arr[x++] = a[i];
			}
			if (++steps % step == 0) {
				if (await displayEvent(curID, x - 1)) return;
			}
		}
		mid = x - 1;
		for (let i = 0; i < a.length; i++) {
			if (curID != sortID) return;
			if (a[i] > m) {
				arr[x++] = a[i];
			}
			if (++steps % step == 0) {
				if (await displayEvent(curID, x - 1)) return;
			}
		}
		await quickSort(l, mid, curID);
		await quickSort(mid + 1, r, curID);
	}
	async function quickSortInit() {
		let curID = ++sortID;
		await quickSort(0, size - 1, curID);
		arr = arr;
		if (curID == sortID) sortID++;
		console.log(steps);
	}
	async function mergeSort(l = 0, r = size - 1, curID = ++sortID) {
		if (l >= r) return;
		let newSteps = Math.ceil((r - l + 1) * Math.log2(r - l + 1));
		if (newSteps < step) {
			let a = arr.slice(l, r + 1);
			a.sort((a, b) => a - b);
			arr.splice(l, a.length, ...a);
			if (step - (steps % step) < newSteps) {
				await timer(time);
			}
			steps += newSteps;
			return;
		}
		let mid = Math.floor((l + r) / 2);
		await mergeSort(l, mid, curID);
		await mergeSort(mid + 1, r, curID);
		let a = arr.slice(l, mid + 1),
			b = arr.slice(mid + 1, r + 1),
			aa = 0,
			bb = 0;
		a[a.length] = b[b.length] = Infinity;
		for (let i = l; i <= r; i++) {
			if (curID != sortID) return;
			if (a[aa] < b[bb]) {
				arr[i] = a[aa];
				aa++;
			} else {
				arr[i] = b[bb];
				bb++;
			}
			if (++steps % step == 0) {
				if (await displayEvent(curID, i)) return;
			}
		}
	}
	async function mergeSortInit() {
		let curID = ++sortID;
		await mergeSort(0, size - 1, curID);
		if (curID == sortID) sortID++;
	}
	async function heapSort() {
		let curID = ++sortID;
		let depth = Array(size * 2 + 1).fill(0);
		async function insert(id, val) {
			if (curID != sortID) return;
			if (++steps % step == 0) if (await displayEvent(curID, id)) return;
			let lc = id * 2 + 1,
				rc = id * 2 + 2;
			if (depth[id] == 0) {
				arr[id] = val;
			} else {
				if (val > arr[id]) [val, arr[id]] = [arr[id], val];
				if (depth[lc] <= depth[rc]) await insert(lc, val);
				else await insert(rc, val);
			}
			depth[id] = Math.min(depth[lc], depth[rc]) + 1;
		}
		async function pop(id) {
			if (curID != sortID) return;
			if (++steps % step == 0) if (await displayEvent(curID, id)) return;
			let lc = id * 2 + 1,
				rc = id * 2 + 2;
			if (depth[lc] == 0 && depth[rc] == 0) {
				depth[id] = 0;
				return;
			}
			if (!depth[rc] || (depth[lc] && arr[lc] > arr[rc])) {
				arr[id] = arr[lc];
				await pop(lc);
			} else if (depth[rc]) {
				arr[id] = arr[rc];
				await pop(rc);
			}
			depth[id] = Math.min(depth[lc], depth[rc]) + 1;
		}
		for (let i = 0; i < size; i++) {
			if (curID != sortID) return;
			await insert(0, arr[i]);
		}
		for (let i = size - 1; i >= 0; i--) {
			if (curID != sortID) return;
			let temp = arr[0];
			await pop(0);
			await insert(0, arr[i]);
			depth[i] = 0;
			arr[i] = temp;
		}
		sortID++;
	}
	async function countingSort() {
		let curID = ++sortID;
		let a = Array(maxVal + 1).fill(0),
			x = 0;
		for (let i = 0; i < size; i++) {
			if (++steps % step == 0) {
				if (await displayEvent(curID, i)) return;
			}
			a[arr[i]]++;
		}
		for (let i = 1; i <= maxVal; i++) {
			if (curID != sortID) return;
			for (let j = 0; j < a[i]; j++) {
				arr[x++] = i;
				if (++steps % step == 0) {
					if (await displayEvent(curID, x - 1)) return;
				}
			}
		}
		sortID++;
	}
	async function radixLSD(base) {
		let curID = ++sortID;

		for (let bit = 1; bit <= size; bit *= base) {
			let a = Array.from(Array(base), () => Array()),
				x = 0;
			for (let i = 0; i < size; i++) {
				a[Math.floor(arr[i] / bit) % base].push(arr[i]);
			}
			for (let i = 0; i < base; i++) {
				for (let j = 0; j < a[i].length; j++) {
					if (curID != sortID) return;
					arr[x++] = a[i][j];
					if (++steps % step == 0) {
						if (await displayEvent(curID, x - 1)) return;
					}
				}
			}
		}
		sortID++;
	}
	async function radixMSD(l, r, bit, base, curID) {
		if (bit < 1 || l >= r) return;
		let a = arr.slice(l, r + 1),
			b = Array.from(Array(base), () => Array()),
			m = [],
			x = l;
		for (let i = 0; i < a.length; i++) {
			b[Math.floor((a[i] % (bit * base)) / bit)].push(a[i]);
		}
		for (let i = 0; i < base; i++) {
			m[i] = x;
			for (let j = 0; j < b[i].length; j++) {
				if (curID != sortID) return;
				arr[x++] = b[i][j];
				if (++steps % step == 0) {
					if (await displayEvent(curID, x - 1)) return;
				}
			}
		}
		m[base] = r + 1;
		for (let i = 0; i < base; i++) {
			await radixMSD(m[i], m[i + 1] - 1, bit / base, base, curID);
		}
	}
	async function radixMSDInit(base) {
		let bit = 1;
		while (bit < size) bit *= base;
		let curID = ++sortID;
		await radixMSD(0, size - 1, bit, base, curID);
		if (curID == sortID) sortID++;
	}
	async function bucketSort(base) {
		let curID = ++sortID;
		let bit = Math.max(...arr) / base + 1;
		let b = Array.from(Array(base), () => Array()),
			m = [],
			x = 0;
		for (let i = 0; i < arr.length; i++) {
			b[Math.floor(arr[i] / bit)].push(arr[i]);
		}
		for (let i = 0; i < base; i++) {
			m[i] = x;
			for (let j = 0; j < b[i].length; j++) {
				if (curID != sortID) return;
				arr[x++] = b[i][j];
				if (++steps % step == 0) {
					if (await displayEvent(curID, x - 1)) return;
				}
			}
		}
		await insertionSort();
		sortID++;
	}
	async function cocktailSort() {
		let curID = ++sortID,
			last = arr.length,
			newLast,
			first = 0,
			newFirst;
		while (first < last) {
			newLast = 0;
			newFirst = size;
			for (let i = first + 1; i < last; i++) {
				if (curID != sortID) return;
				if (arr[i] < arr[i - 1]) {
					newLast = i;
					[arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, i - 1)) return;
				}
			}
			last = newLast;
			for (let i = last - 2; i >= first; i--) {
				if (curID != sortID) return;
				if (arr[i] > arr[i + 1]) {
					newFirst = i;
					[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, i + 1)) return;
				}
			}
			first = newFirst;
		}
		sortID++;
	}
	async function oddEven() {
		let curID = ++sortID,
			done = false;
		while (!done) {
			done = 1;
			for (let i = 1; i < size; i += 2) {
				if (curID != sortID) return;
				if (arr[i] < arr[i - 1]) {
					done = 0;
					[arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, i + 1)) return;
				}
			}
			for (let i = 2; i < size; i += 2) {
				if (curID != sortID) return;
				if (arr[i] < arr[i - 1]) {
					done = 0;
					[arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, i + 1)) return;
				}
			}
		}
		sortID++;
	}
	async function selection2() {
		let curID = ++sortID;
		for (let i = 0; i < size; i++) {
			let a = i,
				b = i;
			for (let j = i; j <= size - 1 - i; j++) {
				if (curID != sortID) return;
				if (arr[j] < arr[a]) a = j;
				if (arr[j] > arr[b]) b = j;
				if (++steps % step == 0) {
					if (await displayEvent(curID, j)) return;
				}
			}
			[arr[i], arr[a]] = [arr[a], arr[i]];
			if (i + 1 >= size - 1 - i) break;
			if (b == i) b = a;
			[arr[size - 1 - i], arr[b]] = [arr[b], arr[size - 1 - i]];
			if (++steps % step == 0) {
				playNote(arr[b] / maxVal);
				await timer(time);
			}
		}
		sortID++;
	}
	async function gnome() {
		let curID = ++sortID;
		for (let i = 0; i < size; i++) {
			if (curID != sortID) return;
			if (i > 0 && arr[i - 1] > arr[i]) {
				[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
				i -= 2;
			}
			if (++steps % step == 0) {
				if (await displayEvent(curID, Math.max(1, i))) return;
			}
		}
		sortID++;
	}
	async function cycle() {
		let curID = ++sortID;
		for (let i = 0; i < size; i++) {
			if (++steps % step == 0) {
				playNote(arr[i] / maxVal);
				await timer(time);
			}
			for (let p = arr[i], j = arr[arr[i] - 1]; ; j = arr[j - 1]) {
				if (curID != sortID) return;
				arr[p - 1] = p;
				if (p - 1 == i) break;
				p = j;
				if (++steps % step == 0) {
					if (await displayEvent(curID, p - 1)) return;
				}
			}
		}
		sortID++;
	}
	async function shellSort(seq) {
		let curID = ++sortID;
		console.log(seq);
		for (let a of seq) {
			for (let i = a; i < size; i++) {
				for (let j = i; j >= a; j -= a) {
					if (curID != sortID) return;
					if (arr[j] >= arr[j - a]) {
						break;
					}
					[arr[j], arr[j - a]] = [arr[j - a], arr[j]];
					if (++steps % step == 0) {
						if (await displayEvent(curID, j, j - a)) return;
					}
				}
			}
		}
		sortID++;
	}
	async function shellSort1() {
		let seq = [];
		for (let i = 1; 2 ** i - 1 <= size; i++) seq.push(2 ** i - 1);
		seq.reverse();
		shellSort(seq);
	}
	async function shellSort2() {
		let seq = [1];
		for (let i = 1; 4 ** i + 3 * 2 ** (i - 1) + 1 <= size; i++)
			seq.push(4 ** i + 3 * 2 ** (i - 1) + 1);
		seq.reverse();
		shellSort(seq);
	}
	async function shellSort3() {
		let seq = [1];
		for (let i = 1; i <= size; i *= 2)
			for (let j = i; j <= size; j *= 3) seq.push(j);
		seq.sort((a, b) => b - a);
		shellSort(seq);
	}
	async function combSort() {
		let curID = ++sortID,
			done = false,
			a = size;
		while (!done || a > 1) {
			done = true;
			a = Math.max(1, Math.floor(a / 1.3));
			for (let i = a; i < size; i++) {
				if (curID != sortID) return;
				if (arr[i] < arr[i - a]) {
					done = false;
					[arr[i], arr[i - a]] = [arr[i - a], arr[i]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, i - a)) return;
				}
			}
		}
		sortID++;
	}
	async function shakerSort() {
		let curID = ++sortID,
			done = false,
			a = size;
		while (!done || a > 1) {
			done = true;
			a = Math.max(1, Math.floor(a / 1.3));
			for (let i = a; i < size; i++) {
				if (curID != sortID) return;
				if (arr[i] < arr[i - a]) {
					done = false;
					[arr[i], arr[i - a]] = [arr[i - a], arr[i]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, i - a)) return;
				}
			}
			for (let i = size - 1 - a; i >= 0; i--) {
				if (curID != sortID) return;
				if (arr[i] > arr[i + a]) {
					done = false;
					[arr[i], arr[i + a]] = [arr[i + a], arr[i]];
				}
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, i + a)) return;
				}
			}
		}
		sortID++;
	}
	async function timSort(l = 0, r = size - 1, curID = ++sortID) {
		if (r - l <= 16) {
			for (let i = l; i < r; i++) {
				for (let j = i + 1; j > l; j--) {
					if (curID != sortID) return;
					if (arr[j] >= arr[j - 1]) {
						break;
					}
					[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];

					if (++steps % step == 0) {
						if (await displayEvent(curID, j, j - 1)) return;
					}
				}
			}
			return;
		}
		let newSteps = Math.ceil((r - l + 1) * Math.log2(r - l + 1));
		if (newSteps < step) {
			let a = arr.slice(l, r + 1);
			a.sort((a, b) => a - b);
			arr.splice(l, a.length, ...a);
			if (step - (steps % step) < newSteps) {
				await timer(time);
			}
			steps += newSteps;
			return;
		}
		let mid = Math.floor((l + r) / 2);
		await timSort(l, mid, curID);
		await timSort(mid + 1, r, curID);
		let a = arr.slice(l, mid + 1),
			b = arr.slice(mid + 1, r + 1),
			aa = 0,
			bb = 0;
		a[a.length] = b[b.length] = Infinity;
		for (let i = l; i <= r; i++) {
			if (curID != sortID) return;
			if (a[aa] < b[bb]) {
				arr[i] = a[aa];
				aa++;
			} else {
				arr[i] = b[bb];
				bb++;
			}
			if (++steps % step == 0) {
				if (await displayEvent(curID, i)) return;
			}
		}
	}
	async function timSortInit() {
		let curID = ++sortID;
		await timSort(0, size - 1, curID);
		if (curID == sortID) sortID++;
	}
	let slowSortSteps = [];
	async function slowSort(l = 0, r = size - 1, curID = ++sortID) {
		if (l >= r) return;
		if (step > slowSortSteps[r - l + 1]) {
			if (step - (steps % step) <= slowSortSteps[r - l + 1]) {
				if (await displayEvent(curID, r, l)) return;
			}
			steps += slowSortSteps[r - l + 1];
			let a = arr.slice(l, r + 1);
			a.sort((a, b) => a - b);
			arr.splice(l, r - l + 1, ...a);
			return;
		}
		let mid = Math.floor((l + r) / 2);
		await slowSort(l, mid, curID);
		await slowSort(mid + 1, r, curID);
		if (++steps % step == 0) {
			if (await displayEvent(curID, mid, r)) return;
		}
		if (curID != sortID) return;
		if (arr[mid] > arr[r]) [arr[mid], arr[r]] = [arr[r], arr[mid]];
		await slowSort(l, r - 1, curID);
	}
	async function slowSortInit() {
		slowSortSteps[0] = slowSortSteps[1] = 0;
		for (let i = 2; i <= size; i++) {
			slowSortSteps[i] =
				slowSortSteps[i - 1] +
				slowSortSteps[Math.floor(i / 2)] +
				slowSortSteps[Math.ceil(i / 2)] +
				1;
		}
		console.log(slowSortSteps[size]);
		let curID = ++sortID;
		await slowSort(0, size - 1, curID);
		arr = arr;
		if (curID == sortID) sortID++;
	}
	let fact = [1];
	async function bogoSort() {
		for (let i = 1; i <= size; i++) fact[i] = fact[i - 1] * i;
		console.log(fact[size]);
		let curID = ++sortID;
		for (let done = false; !done; ) {
			if (step > size) {
				if (Math.random() * size * fact[size] <= step) {
					arr.sort((a, b) => a - b);
					break;
				}
				playNote(arr[0] / maxVal);
				await timer(time);
			}
			for (let i = arr.length - 1; i >= 0; i--) {
				let j = scale(Math.random(), i + 1);
				[arr[i], arr[j]] = [arr[j], arr[i]];
				if (++steps % step == 0) {
					if (await displayEvent(curID, i, j)) return;
				}
				if (curID != sortID) {
					return;
				}
			}
			done = true;
			for (let i = 1; i < size; i++)
				if (arr[i] < arr[i - 1]) done = false;
		}
		sortID++;
	}
	async function go() {
		steps = 0;
		paused = 0;
		arr = arr.map(Math.abs);
		switch (sortType) {
			case 1:
				speed = calcSpeed(size ** 2);
				calcTime();
				insertionSort();
				break;
			case 2:
				speed = calcSpeed(size ** 2);
				calcTime();
				selectionSort();
				break;
			case 3:
				speed = calcSpeed(size ** 2);
				calcTime();
				bubbleSort();
				break;
			case 4:
				speed = calcSpeed(size * Math.log2(size) * 4);
				calcTime();
				quickSortInit();
				break;
			case 5:
				speed = calcSpeed(size * Math.log2(size) * 4);
				calcTime();
				mergeSortInit();
				break;
			case 6:
				speed = calcSpeed(size * Math.log2(size) * 4);
				calcTime();
				heapSort();
				break;
			case 7:
				speed = calcSpeed(size * 3);
				calcTime();
				countingSort();
				break;
			case 8:
				speed = calcSpeed(size * Math.log2(size));
				calcTime();
				radixLSD(2);
				break;
			case 9:
				speed = calcSpeed(size * Math.log2(size));
				calcTime();
				radixMSDInit(4);
				break;
			case 10:
				speed = calcSpeed(size * Math.log2(size));
				calcTime();
				radixLSD(256);
				break;
			case 11:
				speed = calcSpeed(size * Math.log2(size));
				calcTime();
				radixMSDInit(64);
				break;
			case 12:
				speed = calcSpeed(size ** 2 / 16);
				calcTime();
				bucketSort(16);
				break;
			case 13:
				speed = calcSpeed(size * Math.max(2, size / 256));
				calcTime();
				bucketSort(256);
				break;
			case 14:
				speed = calcSpeed(size ** 2);
				calcTime();
				cocktailSort();
				break;
			case 15:
				speed = calcSpeed(size ** 2);
				calcTime();
				oddEven();
				break;
			case 16:
				speed = calcSpeed(size ** 2);
				calcTime();
				selection2();
				break;
			case 17:
				speed = calcSpeed(size ** 2);
				calcTime();
				gnome();
				break;
			case 18:
				speed = calcSpeed(size * 2);
				calcTime();
				cycle();
				break;
			case 19:
				speed = calcSpeed(size ** 1.5);
				calcTime();
				shellSort1();
				break;
			case 20:
				speed = calcSpeed(size ** 1.5);
				calcTime();
				shellSort2();
				break;
			case 21:
				speed = calcSpeed(size ** 1.5);
				calcTime();
				shellSort3();
				break;
			case 22:
				speed = calcSpeed(size ** 1.5);
				calcTime();
				combSort();
				break;
			case 23:
				speed = calcSpeed(size ** 1.5);
				calcTime();
				shakerSort();
				break;
			case 24:
				speed = calcSpeed(size * Math.log2(size));
				calcTime();
				timSortInit();
				break;
			case 25:
				speed = calcSpeed(size * Math.log2(size));
				calcTime();
				slowSortInit();
				break;
			case 26:
				speed = calcSpeed(size * Math.log2(size) * 100);
				calcTime();
				bogoSort();
				break;
		}
		let curID = sortID,
			nextSpeedup = 30000;
		while (curID == sortID) {
			await timer(nextSpeedup);
			if (curID != sortID) break;
			if (paused == 1) continue;
			speedup = "x2";
			speed *= 2;
			calcTime();
			nextSpeedup *= nextSpeedup < 5000 ? 0.95 : 0.8;
		}
		speedup = "";
	}
	function calcSpeed(ops) {
		return ops / ((2 + Math.log(size) / 2) * (1 + Math.log(ops / size)));
	}
	$: speedMult = scaleExp(speedAdjust, 100 ** 2) / 100;
	function calcTime() {
		time = Math.max(MIN_INTERVAL, 1000 / (speed * speedMult));
		step = Math.ceil((time / 1000) * speed * speedMult);
	}
	$: speedAdjust && calcTime();

	$: size && arrayType && arrayAdjust && updArr();
	let img;

	const audioCtx = new AudioContext();
	function playNote(val) {
		if (audioType == 0) return;
		val = Math.abs(val);
		const oscillator = new OscillatorNode(audioCtx);
		const gainNode = new GainNode(audioCtx);
		let frequency, duration;
		switch (audioType) {
			case 1:
				frequency = val * 400 + 200;
				duration = 50;
				oscillator.type = "square";
				break;
			case 2:
				frequency = scaleExp(val, 50) * 80;
				duration = 5;
				oscillator.type = "square";
				break;
			case 3:
				frequency = scaleExp(val, 40) * 100;
				duration = 50;
				oscillator.type = "triangle";
				break;
			case 4:
				frequency = scaleExp(val, 40) * 100;
				duration = 500;
				oscillator.type = "sine";
				break;
		}
		oscillator.frequency.value = frequency; // value in hertz
		gainNode.gain.value = 0.005;
		oscillator.connect(gainNode).connect(audioCtx.destination);
		oscillator.start();

		setTimeout(function () {
			oscillator.stop();
		}, duration);
	}
</script>

<main>
	<img
		src="https://media.discordapp.net/attachments/600494444722257930/964100517854847067/desktop.jpg"
		bind:this={img}
		alt="testimg"
		style="display:none;"
	/>
	<div class="container" style="width:70%; margin-left:auto;">Sorting</div>
	<div class="container">
		<span>Speed: {Math.round(speed)} (x{speedMult})</span>
		<span style="float:right;">
			<label for="speedAdjust" style="display:inline">Speed Adjust:</label
			>
			<input
				id="speedAdjust"
				style="padding:0"
				type="range"
				bind:value={speedAdjust}
				min="0"
				max="1"
				step="0.01"
			/>
			<label for="displayType" style="display:inline">Display: </label>
			<select id="displayType" bind:value={displayType}>
				{#each displayOptions as option}
					<option value={option.id}>{option.text}</option>
				{/each}
			</select>
			<label for="audioType" style="display:inline">Audio:</label>
			<select id="audioType" bind:value={audioType}>
				{#each audioOptions as option}
					<option value={option.id}>{option.text}</option>
				{/each}
			</select>
		</span>
		{#key speed}
			<div in:fly={{ y: 20 }}>{speedup}</div>
		{/key}
		<Canvas {width} {height}>
			{#each arr as num, i}
				<Bar
					pos={i}
					val2={num}
					type={displayType}
					{size}
					{maxVal}
					{img}
				/>
			{/each}
		</Canvas>
	</div>
	<!-- svelte-ignore missing-declaration -->
	<div
		class="container"
		style:max-width={screen.width > 1000 ? "17.5%" : "100%"}
	>
		<label for="size">Size</label>
		<input id="size" type="number" bind:value={size} />
		<label for="arrayType">Array Type</label>
		<select id="arrayType" bind:value={arrayType}>
			{#each arrayOptions as option}
				<option value={option.id}>{option.text}</option>
			{/each}
		</select>
		{#if arrayType == 2 || arrayType == 3}
			<input
				type="range"
				bind:value={arrayAdjust}
				min="0"
				max="1"
				step="0.01"
				transition:fade
			/>
		{:else if arrayType == 6}
			<textarea
				maxlength="5000"
				transition:fade
				on:input={(e) => updArr(e.target.value)}
			/>
		{/if}
		<div>
			{#if paused == 1}
				<button on:click={() => (paused = 0)}>Resume</button>
			{:else if paused == 0}
				<button on:click={() => (paused = 1)}>Pause</button>
			{:else}
				<button on:click={go}>Sort</button>
			{/if}

			<button on:click={updArr}>Reset</button>
		</div>
		<div style="">
			{#each sortOptions as group}
				<ul
					style="display:inline-block; list-style-type: none; padding:0; margin: 1rem;"
				>
					<li style="font-weight:bold; color: #d3869b">
						{group.name}
					</li>
					{#each group.options as option}
						<li
							on:click={() => (sortType = option.id)}
							class:a={option.id === sortType}
						>
							{option.text}
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	</div>
</main>

<style>
	input[type="range"] {
		margin: 0;
	}
	main {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	.container {
		background-color: #1d2021;
		color: #d8a657;
		display: inline-block;
		border-radius: 1rem;
	}
	.container input,
	.container select,
	.container button,
	.container textarea {
		background-color: #282828;
		border: none;
		color: inherit;
		display: inline;
	}
	.container input[type="range"]::-webkit-slider-runnable-track {
		background:#f3e2b7;
	}
	.container input[type="range"]::-moz-range-track{
		background:#f3e2b7;
	}

	.a {
		color: #e7e7e7;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
		.container {
			padding: 1rem;
			margin: 2rem;
		}
	}
</style>
