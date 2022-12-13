import * as d3 from 'd3';
// import { NetworkNodeType, NetworkProps } from "./types";
// import Random from "./random";
// import { link } from "d3";

export type NetworkConfig = {
	target: string,
	input: number,
	hidden: number,
	output: number,
	layer: number,
	accent: number[],
	option: { colorFix: boolean }
}

export default function MakeFfnnChart(config:NetworkConfig) {
	let ADJUST = 42; // 간격의 크기
	let RADIUS = 10; // 원의 크기
	let svg:any;

	const tag = setUp();
	build(tag);

	/**
	 * svg의 설정값을 return하는 함수
	 */
	function setUp() {
		const div = d3.select(`#${config.target}`)
		              .style('background-color', '#fff');
		div.selectAll('*').remove();
		svg = div.append("svg");
		svg.selectAll('*').remove();

		// get d3 Color Scheme
		const color = __makeColor();

		// elements for data join
		const link = svg.append("g").selectAll('.link');
		const accent = config.accent.length > 0 ? svg.append('g').selectAll('.accent') : undefined;
		const node = svg.append("g").attr('class', 'ffnn-nodeBody').selectAll('.node');

		// simulation initialization
		const simulation = d3.forceSimulation()
		                     .force("link", d3.forceLink().id((d:any) => d.id))
		                     .force("charge", d3.forceManyBody().strength(0))
		const graph = make();

		return { color, link, accent, node, simulation, graph }



		function __makeColor() {
			const customSet = {
				input: d3.schemeCategory10[8],
				hidden: d3.schemeCategory10[5],
				output: d3.schemeCategory10[9]
			};

			return config.option.colorFix ? customSet : d3.scaleOrdinal(d3.schemeCategory10);
		} // function __makeColor()
	} // function setUp()

	/**
	 * 그래프에 사용될 정보를 생성하는 함수
	 */
	function make() {
		const layerLavel = config.layer + 2;
		const courseLength = config.accent.length;
		const maxCount = Math.max(config.input, config.hidden, config.output);

		// node에 사용될 최대 크기(svg의 크기)를 결정
		__initFactor();

		// create Node, Layer의 수에 따라 다르게 동작
		let arrayCount = 0; let groupIndex = 1;
		let layerArray:any[] = []; let sum = config.input;
		for(let i = 0; i<layerLavel; i++) {
			if(i === 0) { // case Input
				layerArray.push(__setNode(sum, String(groupIndex++), config.input, 'input'));
			}
			else if(i === layerLavel-1) { // case Output
				layerArray.push(__setNode(sum, String(groupIndex++), config.output, 'output'));
			}
			else { // case Hidden
				layerArray.push(__setNode(sum, String(groupIndex++), config.hidden, 'hidden'));
			}

			arrayCount++;

			if(i === layerLavel-2) {
				sum += config.output;
			}
			else {
				sum += config.hidden;
			}
		}

		// create Link
		const linkArray = __setLink();

		// create Nodes
		let nodeArray:any[] = [];
		for(let i=0; i<layerArray.length; i++) {
			nodeArray = nodeArray.concat(layerArray[i]);
		}

		// create Accent
		let accentArray = {};
		if(config.accent.length > 0) {
			accentArray = __setAccent(config.accent);
		}

		return {
			nodes: nodeArray,
			links: linkArray,
			accent: accentArray
		}



		/** @private - setup adjust & radius */
		function __initFactor() {
			if(maxCount < 6) {
				ADJUST = 50; RADIUS = 30;
			}
			else {
				ADJUST = 50 - ((maxCount - 5) * 4.7);
				RADIUS = 30 - ((maxCount - 5) * 4.7);
			}

			// limitation adjust
			if(ADJUST > 50) ADJUST = 50;
			else if(ADJUST < 10) ADJUST = 10;

			// limitation radius
			if(RADIUS > 30) RADIUS = 30;
			else if(RADIUS < 10) RADIUS = 10;
		} // function __initFactor()

		/** @private - setup Node Information */
		function __setNode(_sum:number, _group:string, _groupCount:number, type:string) {
			let _nodeArray = []; let s = 1;

			for(let i = arrayCount; i<_sum; i++) {
				arrayCount = i;
				_nodeArray.push({
					id: String(arrayCount),
					group: _group,
					sort: String(s++),
					type: type,
					groupCount: String(_groupCount),
					maxCount: String(maxCount)
				});
			}

			return _nodeArray;
		} // function __setNode(_sum, _group, _groupCount, type)

		/** @private - setup Link Information */
		function __setLink() {
			let _id = 0; const _linkArray:any[] = [];

			for(let i=1; i<layerArray.length; i++) {
				___makeLink(layerArray[i-1], layerArray[i]);
			}

			return _linkArray;

			function ___makeLink(start:any[], end:any[]) {
				for (let i=0; i<start.length; i++){
					const startNode = start[i];

					for(let j=0; j<end.length; j++) {
						const endNode = end[j];
						const link = {
							"source" : startNode['id'],
							"target" : endNode['id'],
							"id" : String(_id++)
						};
						_linkArray.push(link);
					}
				}
			} // function ___makeLink(start, end)
		} // function __setLink()

		/** @private - setup Accecnt Information */
		function __setAccent(_accent:any[]) {
			const _links = []; let _node = 0;

			for(let i=0; i<courseLength; i++) {
				if(i === 0) {
					_links.push(`${_accent[i] - 1}`);
					_node += config.input;
				}
				else {
					_links.push(`${_node + _accent[i]-1}`);
					_node += config.hidden;
				}
			}

			const _accentArray = [];
			for(let i=1; i<courseLength; i++) {
				_accentArray.push({
					source: String(_links[i-1]),
					target: String(_links[i]),
					id: String(i-1),
				});
			}

			return _accentArray;
		} // function __setAccent(_accent)
	} // function make()

	/**
	 * d3를 이용해 그래프를 그리는 메소드
	 */
	function build(tag:any) {
		const adjust = ADJUST;

		// Create Link Line
		tag.link = tag.link.data(tag.graph.links);
		tag.link.exit().remove();
		tag.link = tag.link.enter()
		              .append("line")
		              .attr("class", "ffnn-link")
		              .attr("stroke", "#999")
		              .attr("stroke-width", "2px")
		              .merge(tag.link);

		// Create Node Circle
		tag.node = tag.node.data(tag.graph.nodes);
		tag.node.exit().remove();
		tag.node.enter().append("circle")
		   .attr("class", "ffnn-node")
		   .attr("r", RADIUS)
		   .attr("stroke", "#fff")
		   .attr("stroke-width", "2px")
		   .attr("fill", (d:any) => { return config.option.colorFix ? tag.color[d.type] : tag.color(d.group);  } )
		   .attr("cx",   (d:any) => __getCx(d.group) )
		   .attr("cy",   (d:any) => __getCy(d.sort, d.maxCount, d.groupCount) )
		   .merge(tag.node);

		// Create Accent Line
		if(config.accent.length > 0) {
			tag.accent = tag.accent.data(tag.graph.accent);
			tag.accent.exit().remove();
			tag.accent = tag.accent.enter().append("line")
			                .attr("class", "ffnn-accent")
			                .attr("stroke", "#666")
			                .attr("stroke-width", "6px")
			                .merge(tag.accent);
		}

		// Set nodes, links, accent for simulation
		tag.simulation.nodes(tag.graph.nodes);
		tag.simulation.force("link").links(tag.graph.links);
		tag.simulation.force("link").links(tag.graph.accent);

		// Draw line
		setTimeout(() => {
			__drawLine(tag.link);
			if(config.accent.length > 0) {
				__drawLine(tag.accent);
			}
		}, 100)

		tag.simulation.alphaTarget(0.3).restart();
		__moveCenter(config.target, svg)



		/** 태그의 x 좌표를 지정하는 메소드 */
		function __getCx(group:number) {
			return group * 100;
		} // function __getCx(group)

		/** 각 태그의 y 좌표를 지정하는 메소드 */
		function __getCy(sort:number, maxCnt:number, groupCnt:number) {
			let cy = sort * (adjust*2);
			const minus = maxCnt - groupCnt;

			if(minus > 0) cy += (minus * adjust);
			return cy-70;
		} // function __getCy(sort, maxCnt, groupCnt)

		/** 각 노드를 연결하는 선을 그리는 메소드 */
		function __drawLine(target:any) {
			target.attr("x1", (d:any) => __getCx(d.source.group))
			      .attr("y1", (d:any) => __getCy(d.source.sort, d.source.maxCount, d.source.groupCount))
			      .attr("x2", (d:any) => __getCx(d.target.group))
			      .attr("y2", (d:any) => __getCy(d.target.sort, d.target.maxCount, d.target.groupCount));
		} // function __drawLine(target)

		/** 그래프가 가운데 위치하도록 ViewBox를 조정하는 메소드 */
		function __moveCenter(target:any, svg:any) {
			const body = svg.select('.ffnn-nodeBody');
			const pNode = svg.node()?.getBoundingClientRect();
			const rect = body.node()?.getBoundingClientRect();

			svg.attr("width", rect.width );
			svg.attr("height", rect.height );
			svg.attr("viewBox", [rect.x-pNode.x+2, rect.y-pNode.y-2, rect.width-4, rect.height+4]);
		} // function __moveCenter(target)
	} // function build(tag)
}

// type D3_SVG_SELECTION = d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
// type D3_NODE_SELECTION = d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>;
// type D3_SIMULATION = d3.Simulation<d3.SimulationNodeDatum, undefined>;
// type ChartDatum = { arrayCount: number; groupIndex: number; layerArray: any[]; sum: number; };
// type LayerType = "input"|"output"|"hidden";
// type LinkDatum = { source: any[], target: any[], id: string };
// type AccentDatum = { source: string, target: string, id: string };
// type BuildType = {interval: number, radius: number, nodes: any[], accent: AccentDatum[], links: LinkDatum[]};
//
// export class MakeNetworkChart {
// 	/* PRIVATE VARABLE AREA ----------------------------------------------------------------------------------------- */
// 	private readonly svg:D3_SVG_SELECTION|undefined = undefined;
// 	private readonly node:NetworkNodeType = { input:1, hidden:1, output:1 };
// 	private readonly accent:number[] = [];
// 	private readonly layer:number = 1;
// 	private readonly colorSet:string[] = [];
//
// 	private linkSelector:any = undefined;
// 	private accentSelector:any = undefined;
// 	private nodeBodySelector:any = undefined;
// 	private simulation:any = undefined;
//
// 	/* ----------------------------------------------------------------------------------------- PRIVATE VARABLE AREA */
//
//
// 	/* CONSTRUCTOR AREA --------------------------------------------------------------------------------------------- */
// 	constructor(tId:string, config:NetworkProps) {
// 		const { node, accent=[], layer=1, colorSet=[] } = config;
//
// 		this.node = {
// 			input:  (node.input > 0)  ? node.input : 1,
// 			hidden: (node.hidden > 0) ? node.hidden: 1,
// 			output: (node.output > 0) ? node.output: 1,
// 		};
//
// 		this.layer = (layer>0) ? layer:0;
// 		this.accent = this.__getAssent(accent);
// 		this.colorSet = this.__getColorSet(colorSet);
// 		this.svg = d3.select(`svg#${tId}`);
//
// 		this.__init();
// 	}
//
// 	private __getAssent(accent:number[]) {
// 		const output:number[] = [];
// 		for (let i = 0; i < this.layer+2; i++) {
// 			const o = (!!accent[i]) ? accent[i]:0;
// 			if(i === 0)	                output.push(getNumber(o, 0, this.node.input));
// 			else if(i === this.layer+1) output.push(getNumber(o, 0, this.node.output));
// 			else                        output.push(getNumber(o, 0, this.node.hidden));
// 		}
// 		return output;
//
// 		function getNumber(num:number, min:number, max:number):number {
// 			return (num > max) ? max : ((num < min) ? min : num);
// 		}
// 	}
//
// 	private __getColorSet(colorSet:string[]) {
// 		const output:string[] = [];
// 		for (let i = 0; i < this.layer+2; i++) {
// 			const c = (!!colorSet[i]) ? colorSet[i]:Random.color();
// 			output.push(c);
// 		}
// 		return output;
// 	}
//
// 	/* --------------------------------------------------------------------------------------------- CONSTRUCTOR AREA */
//
//
// 	/* METHOD AREA : Init ------------------------------------------------------------------------------------------- */
// 	private __init() {
// 		if(!this.svg) return;
// 		this.svg.selectAll('g').remove();
//
// 		// svg에 group 추가
// 		this.linkSelector = this.svg.append("g").selectAll('.link');
// 		this.accentSelector = (this.accent.length>0) ? this.svg.append("g").selectAll('.link'):undefined;
// 		this.nodeBodySelector = this.svg.append("g").selectAll('.node');
//
// 		//
// 		this.simulation = d3.forceSimulation()
// 		                     .force("link", d3.forceLink().id((d:any) => d.id))
// 		                     .force("charge", d3.forceManyBody().strength(0));
//
// 		const init = this.__makeGraphDatum();
// 		this.__build(init);
// 	}
// 	/* ------------------------------------------------------------------------------------------- METHOD AREA : init */
//
//
// 	/* METHOD AREA : Make Graph ------------------------------------------------------------------------------------- */
// 	private __makeGraphDatum() {
// 		const layerLevel = this.layer+2;
// 		const courseLength = this.accent.length;
// 		const maxCount = Math.max(this.node.input, this.node.hidden, this.node.output);
//
// 		const { interval, radius } = this.__getFactor(maxCount);
// 		const { nodes, accent, links } = this.__getDatum(layerLevel, maxCount, courseLength);
//
// 		return { interval, radius, nodes, accent, links };
// 	}
//
// 	private __getFactor(maxCount:number) {
// 		let interval:number; // 간격의 크기
// 		let radius:number; // 원의 크기
//
// 		if(maxCount < 6) {
// 			interval = 50; radius = 30;
// 		}
// 		else {
// 			interval = 50 - ((maxCount - 5) * 4.7);
// 			radius = 30 - ((maxCount - 5) * 4.7);
// 		}
//
//
// 		interval = (interval > 50) ? 50 : (interval < 10) ? 10 : interval;
// 		radius = (radius > 30) ? 30 : (radius < 10) ? 10 : radius;
//
// 		return { interval, radius };
// 	}
//
// 	private __getDatum(layerLavel:number, maxCount:number, courseLength:number) {
// 		const datum:ChartDatum = { arrayCount:0, groupIndex:1, layerArray:[], sum:this.node.input };
//
// 		for (let i = 0; i < layerLavel; i++) {
// 			const gidx = datum.groupIndex++;
//
// 			if(i===0)                   datum.layerArray.push(this._getNodeDatum(datum, gidx, this.node.input, 'input', maxCount))
// 			else if(i === layerLavel-1) datum.layerArray.push(this._getNodeDatum(datum, gidx, this.node.output, 'output', maxCount))
// 			else                        datum.layerArray.push(this._getNodeDatum(datum, gidx, this.node.hidden, 'hidden', maxCount))
//
// 			datum.arrayCount++;
//
// 			if(i === layerLavel-2) datum.sum += this.node.output;
// 			else                   datum.sum += this.node.hidden;
// 		}
//
// 		const linkArray = this.__getLinkDatum(datum);
// 		const nodeArray = datum.layerArray.map(v => (v));
// 		const accentArray = this.__getAccentDatum(courseLength);
//
// 		return {
// 			nodes: nodeArray,
// 			links: linkArray,
// 			accent: accentArray
// 		}
// 	}
//
// 	private _getNodeDatum(datum:ChartDatum, gidx:number, count:number, type:LayerType, maxCount:number) {
// 		const nodeArray:any[] = [];
// 		let sort = 1;
//
// 		for (let i = datum.arrayCount; i < datum.sum; i++) {
// 			datum.arrayCount = i;
// 			nodeArray.push({
// 				id: String(datum.arrayCount), group: String(gidx), sort: String(sort++),
// 				groupCount: String(count), maxCount: maxCount, type
// 			});
// 		}
//
// 		return nodeArray;
// 	}
//
// 	private __getLinkDatum(datum:ChartDatum) {
// 		let id = 0;
// 		const linkArray:LinkDatum[] = [];
//
// 		for (let i = 1; i < datum.layerArray.length; i++) {
// 			const start = datum.layerArray[i-1];
// 			const end = datum.layerArray[i];
//
// 			for (const snode of start) {
// 				for (const enode of end) {
// 					linkArray.push({ source: snode[id], target: enode[id], id: String(id++) })
// 				}
// 			}
// 		}
//
// 		return linkArray;
// 	}
//
// 	private __getAccentDatum(courseLength:number) {
// 		if(this.accent.length === 0) return [];
//
// 		const links:string[] = [];
// 		let node = 0;
//
// 		for (let i = 0; i < courseLength; i++) {
// 			if(i===0) {
// 				links.push(`${this.accent[i] - 1}`);
// 				node += this.node.input;
// 			}
// 			else {
// 				links.push(`${node + this.accent[i]-1}`);
// 				node += this.node.hidden;
// 			}
// 		}
//
// 		const accentArray:AccentDatum[] = [];
// 		for (let i = 0; i < courseLength; i++) {
// 			accentArray.push({
// 				source: String(links[i-1]),
// 				target: String(links[i]),
// 				id: String(i-1),
// 			})
// 		}
// 		return accentArray;
// 	}
// 	/* ------------------------------------------------------------------------------------- METHOD AREA : Make Graph */
//
//
// 	/* METHOD AREA : build ------------------------------------------------------------------------------------------ */
// 	private __build(props:BuildType) {
// 		const { interval, radius, nodes, accent, links } = props;
//
// 		this.linkSelector?.data(links).exit().remove()
// 		                  .enter().append("line")
// 		                  .attr("class", "ffnn-link").attr("stroke", "#999").attr("stroke-width", "2px")
// 	                      .merge(this.linkSelector);
//
// 		this.nodeBodySelector?.data(nodes).exit().remove()
// 		                      .enter().append("circle")
// 	                          .attr("stroke", "#fff")
// 	                          .attr("stroke-width", "2px") //stroke: #fff; stroke-width: 2px;
// 							  .attr("r", radius).attr("fill", (d:any) => )
// 	}
// 	/* ------------------------------------------------------------------------------------------ METHOD AREA : build */
// }