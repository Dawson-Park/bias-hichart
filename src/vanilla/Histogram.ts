import * as d3 from 'd3';

type Props = {
	data: number[][];
	targetId: string;
	xAxis: number[];
	width?: number;
	height?: number;
	padding?: number;
	innerHeight?: number;
	// colorSet?: [string, string];
	margin?: number[];
}

// start: '#ffa270',
// end: '#a32107',

export default class Histogram {
	// private readonly defaultColorScheme = [ '#ffa270', '#a32107' ];

	private readonly data:number[][] = [];
	private readonly targetId:string = '';
	private readonly xAxis:number[] = []
	private readonly width:number = 600;
	private readonly height:number = 400;
	private readonly innerHeight:number = 300;
	private readonly padding:number = 30;
	private readonly margin:number[] = [40, 40]; // t, r, b, l


	constructor(props:Props) {
		const { data, xAxis } = this.uniformization(props.data, props.xAxis)

		this.data = data;
		this.xAxis = xAxis;

		this.targetId = props.targetId;
		this.width = (!!props.width) ? props.width : 600;
		this.height = (!!props.height) ? props.height : 400;
		this.innerHeight = (!!props.innerHeight) ? props.innerHeight : 300;
		this.padding = (!!props.padding) ? props.padding : 30;
		this.margin = (!!props.margin && props.margin.length === 2) ? props.margin : [40, 40];

		this.init();
	}

	private uniformization(data:number[][], xAxis:number[]) {
		const minD = (d3.min(data, d => d.length) as number);
		const maxD = (d3.max(data, d => d.length) as number);
		const minX = xAxis.length;

		if(minD < maxD) {
			for (let i = 0; i < data.length; i++) {
				data[i].splice(minD);
			}
		}

		if(minD > minX) {
			for (let i = 0; i < data.length; i++) {
				data[i].splice(minX);
			}
		}
		else if(minD < minX) {
			xAxis.splice(minD);
		}

		return { data, xAxis }
	}

	private init() {
		const { y, yAxis, xAxis } = this.makeAxis();

		const div = d3.select(`#${this.targetId}`);
		div.selectAll('*').remove();

		const svg = div.append('svg');
	    svg.attr('class', 'histogram-body')
	       .style('width', this.width)
		   .style('height', this.height)
		   .style('background-color', '#fff');

		svg.append('g').call(xAxis);
		svg.append('g').call(yAxis);

		const shell = this.height - this.innerHeight;
		const intervalArray = (() => {
			let prev=0, now=0, interval=0;
			const intervalArray = [];

			for (let i = 0; i < this.data.length; i++) {
				if(prev !== 0) {
					now = y(i);
					interval += (prev - now);
				}

				prev = y(i);
				intervalArray.push(shell - interval);
			}

			return intervalArray
		})();

		this.loopSummaryChart(intervalArray);
	}

	private makeAxis() {
		const xSpectrum = (() => {
			const max = (d3.max(this.xAxis, x => x) as number);
			const min = (d3.min(this.xAxis, x => x) as number);
			return [min, max];
		})();

		const x = d3.scaleLinear()
		            .domain(xSpectrum)
		            .nice()
		            .range([this.padding, this.width - this.padding]);
		const xAxis = (g:any) => {
			g.attr("transform", `translate(0, ${ this.height - this.margin[1] })`)
			 .attr("class", "cnn-xAxis")
             .call(d3.axisBottom(x).ticks(this.width / 90).tickSizeOuter(0))
             .call((c: any) => c.select('.domain'))
             .call((c: any) => c.selectAll('line'))
			g.selectAll('path').style('stroke', '#CCD6EB')
			g.selectAll('line').style('stroke', '#CCD6EB')
			g.selectAll('text').style('color', '#666')
			return g
		}

		// rgb(204, 214, 235);

		const ySpectrum = (() => {
			const indexes = this.data.map((_, i) => i);
			const max = (d3.max(indexes) as number);
			const min = (d3.min(indexes) as number);
			return [min, max*2];
		})();

		const y = d3.scaleLinear()
		            .domain(ySpectrum)
		            .range([this.height - this.margin[1], this.margin[0]*4]);

		const yAxis = (g:any) => (
			g.attr("transform", `translate(${this.padding}, 0)`)
			 .attr("class", "cnn-yAxis")
			 .call(d3.axisLeft(y))
			 .call((c:any) => c.selectAll('text').remove())
			 .call((c:any) => c.select('.domain').remove())
			 .call((c:any) => c.selectAll('line').remove())
		);

		return { xAxis, yAxis, y }
	}

	private loopSummaryChart(intervalArray:number[]) {
		// const rvsXAxis = this.xAxis.reverse();
		// const rvsData = this.data.reverse();

		const rvsXSpectrum = (() => {
			const max = (d3.max(this.xAxis) as number);
			const min = (d3.min(this.xAxis) as number);
			return [min, max];
		})();
		const rvsYSpectrum = (() => {
			let max = Number.MIN_VALUE;
			let min = Number.MIN_VALUE;

			for (let i = 0; i < this.data.length; i++) {
				const mxx = (d3.max(this.data[i], d => d) as number);
				max = (max >= mxx) ? max:mxx;
				const mnx = (d3.min(this.data[i], d => d) as number);
				min = (min <= mnx) ? min:mnx;
			}
			return [min, max * 1.2]
		})();

		const colorScheme = d3.schemeYlOrRd[this.data.length];

		for (let i = 0; i < this.data.length; i++) {
			this.makeSummary(
				this.data[i],
				this.xAxis,
				intervalArray[intervalArray.length - (1+i)],
				rvsXSpectrum,
				rvsYSpectrum,
				colorScheme[this.data.length - (1+i)]
			)
		}
	}

	private makeSummary(data:number[], xAxis:number[], interval:number, spectrumX:number[], spectrumY:number[], color:string) {
		const functionX = d3.scaleLinear()
		                    .domain(spectrumX)
		                    .range([this.padding, this.width - this.padding]);

		const functionY = d3.scaleLinear()
		                    .domain(spectrumY)
		                    .nice()
		                    .range([this.innerHeight - this.margin[1], this.margin[0]]);

		const svg = d3.select(`#${this.targetId} > svg.histogram-body`)
		              .append('svg')
		              .attr('class', 'cnn-summary')
		              .style('width', this.width)
		              .style('height', this.innerHeight);

		const group = svg.append('g')
		                 .attr('class', 'cnn-group')
		                 .attr('transform', `translate(0, ${interval})`);

		const line = d3.line()
		               .defined((d:any) => !isNaN(d))
		               .x((d:any, i) => (functionX(xAxis[i]) as number))
		               .y((d:any) => (functionY(d) as number))
		group.append('path')
		     .datum(data)
			 // @ts-ignore
		     .attr('d', line)
		     .attr("class", "cnn-line")
		     .attr("fill", "none")
		     .attr("stroke-linejoin", "round")
		     .attr("stroke-linecap", "round")
		     .attr("stroke", "#ccc")
		     .attr("stroke-width", 1)

		const area = d3.area()
		               .x((d:any, i) => (functionX(xAxis[i]) as number))
		               .y0(functionY(0))
		               .y1((d:any) => (functionY(d) as number))
		group.append("path")
		     .datum(data)
			// @ts-ignore
		     .attr('d', area)
		     .attr("class", "cnn-area")
		     .attr("fill", color);

		const dot = (() => {
			let max = (d3.max(data) as number);
			const value = data.find(e => e === max) || 0;
			const ms = data.findIndex(e => e === max);
			return { value, ms }
		})();

		group.append('circle')
		     .attr("class", "cnn-dot")
		     .attr("cx", functionX(xAxis[dot.ms]))
		     .attr("cy", functionY(dot.value))
		     .attr("r", 3)
		     .attr("fill", color)
		     .attr("stroke", "#ccc")
		     .attr("stroke-width", 1)

		group.append('text')
		     .attr("class", "cnn-text")
		     .text(dot.value)
		     .attr("x", functionX(xAxis[dot.ms]))
		     .attr("y", functionY(dot.value) - 10)
		     .attr("text-anchor", "middle")
		     .attr("visibility", "hidden"/*"visible"*/) // base
		     .attr("font-family", "sans-serif") // base
		     .attr("font-size", "14px") // base
		     .attr("fill", "#666") // base
		     .attr("font-weight", "bold") // base

		group.on('mouseenter', () => {
			group.selectAll('.cnn-line')
			     .attr('stroke', '#333')
			     .attr('stroke-width', 4);
			group.selectAll('.cnn-dot')
			     .attr('fill', '#333')
			     .attr('stroke', '#333')
			     .attr('stroke-width', 2);
			group.selectAll('text.cnn-text')
			     .attr('visibility', 'visible');
		});

		group.on('mouseleave', () => {
			group.selectAll('.cnn-line')
			     .attr('stroke', '#ccc')
			     .attr('stroke-width', 1);
			group.selectAll('.cnn-dot')
			     .attr('fill', color)
			     .attr('stroke', '#ccc')
			     .attr('stroke-width', 1);
			group.selectAll('text.cnn-text')
			     .attr('visibility', 'hidden');
		})
	}
}