import makeFfnnChart, { NetworkConfig } from "../lib/makeNetworkChart";

type NetworkNodeType = {
	input: number;
	hidden: number;
	output: number;
}

type NetworkProps = {
	node: NetworkNodeType;
	targetId: string;
	layer?: number;
	accent?: number[];
	colorSet?: string[];
}

export default class Network {
	private readonly targetId:string = '';
	private readonly input:number = 1;
	private readonly hidden:number = 1;
	private readonly output:number = 1;
	private readonly layer:number = 1;
	private readonly accent:number[] = [];
	private colorSet:string[]|undefined = undefined;

	constructor(props:NetworkProps) {
		this.targetId = props.targetId;
		this.input = (!!props.node.input) ? props.node.input:1;
		this.hidden = (!!props.node.hidden) ? props.node.hidden:1;
		this.output = (!!props.node.output) ? props.node.output:1;
		this.layer = (!!props.layer) ? props.layer:1;
		this.accent = (!!props.accent) ? props.accent:[];
		this.colorSet = props.colorSet;
	}

	private getConfigs():NetworkConfig {
		return {
			target: this.targetId,
			input: this.input,
			hidden: this.hidden,
			output: this.output,
			layer: this.layer,
			accent: this.accent,
			option: { colorFix: true }
		}
	}

	public show() {
		const config = this.getConfigs();
		makeFfnnChart(config);
	}
}