<script>
	import { Canvas, Layer, t } from "svelte-canvas";
	export let pos,
		val2,
		type,
		size,
		maxVal,
		img = null;
	//x1,x2,y1,y2,color='black',img=null,num=null,type=null;
	$: render = ({ context, width, height }) => {
		let itemWidth = width / size,
			itemHeight = height / maxVal,
			val = Math.abs(val2);
		if (type == 5) {
			let scale = Math.max(width / img.width, height / img.height);
			context.drawImage(
				img,
				Math.floor((itemWidth * (val - 1)) / scale),
				0,
				Math.floor((itemWidth * val) / scale) -
					Math.floor((itemWidth * (val - 1)) / scale),
				img.height,
				Math.floor(itemWidth * pos),
				0,
				Math.floor(itemWidth * (pos + 1)) -
					Math.floor(itemWidth * pos) +
					1,
				height
			);
			return;
		}
		if (type == 4 || type == 8) {
			context.fillStyle = "hsl(" + (val * 360) / size + ",100%,50%)";
		} else if (val2 < 0) {
			context.fillStyle = "#719c92";
		} else {
			context.fillStyle = "#f3e2b7";
		}
		if (type == 6 || type == 8) {
			itemWidth = (1 / size) * 2 * Math.PI;
			context.beginPath();
			context.moveTo(width / 2, height / 2);
			if (type == 6)
				context.arc(
					width / 2,
					height / 2,
					((val / maxVal) * Math.min(width, height)) / 2,
					pos * itemWidth,
					(pos + 1) * itemWidth
				);
			else if (type == 8)
				context.arc(
					width / 2,
					height / 2,
					Math.min(width, height) / 2,
					pos * itemWidth,
					(pos + 1 + Number(pos + 1 < size)) * itemWidth
				);
			context.moveTo(width / 2, height / 2);
			context.fill();
		} else if (type == 9) {
			context.beginPath();
			context.moveTo(0, val * itemHeight);
			context.lineTo((pos + 1) * itemWidth, 0);
			context.stroke();
		} else if (type == 10) {
			itemWidth = (1 / size) * 2 * Math.PI;
			context.beginPath();
			context.arc(
				width / 2 +
					(Math.min(width, height) / 2) * Math.sin(pos * itemWidth),
				height / 2 +
					(Math.min(width, height) / 2) * Math.cos(pos * itemWidth),
				2,
				0,
				2 * Math.PI
			);
			context.fill();
			context.beginPath();
			context.moveTo(
				width / 2 +
					(Math.min(width, height) / 2) * Math.sin(pos * itemWidth),
				height / 2 +
					(Math.min(width, height) / 2) * Math.cos(pos * itemWidth)
			);
			context.lineTo(
				width / 2 +
					(Math.min(width, height) / 2) *
						Math.sin((val - 1) * itemWidth),
				height / 2 +
					(Math.min(width, height) / 2) *
						Math.cos((val - 1) * itemWidth)
			);
			context.stroke();
		} else {
			let x1, y1, x2, y2;
			if (type == 3) {
				x1 = pos * itemWidth;
				x2 = Math.max(3, itemWidth);
				y1 = height - val * itemHeight;
				y2 = Math.max(3, itemHeight);
			} else if (type == 7) {
				itemWidth = (1 / size) * 2 * Math.PI;
				x1 =
					width / 2 +
					(((val / maxVal) * Math.min(width, height)) / 2) *
						Math.sin(pos * itemWidth);
				y1 =
					height / 2 +
					(((val / maxVal) * Math.min(width, height)) / 2) *
						Math.cos(pos * itemWidth);
				x2 = 5;
				y2 = 5;
			} else {
				x1 = pos * itemWidth;
				x2 = itemWidth;
				if (type == 4 || size < 3000) {
					x1 = Math.floor(x1);
					x2 = Math.floor(x1 + x2) - Math.floor(x1) + 2;
				}
				if (type == 4) {
					y1 = 0;
					y2 = height;
				} else if (type == 1) {
					y1 = height - itemHeight * val;
					y2 = itemHeight * val;
				} else if (type == 2) {
					y1 = 0;
					y2 = itemHeight * val;
				}
			}
			context.fillRect(x1, y1, x2, y2);
		}
	};
</script>

<Layer {render} />
