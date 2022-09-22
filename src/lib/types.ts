export interface ChartProps {
	data: number[]|number[][]|number[][][];
	id?: string;
	xAxis?: string[]|string;
	yAxis?: string[]|string;
	seriesName?: string[];
	colorSet?: string[];
	title?: string;
	subtitle?: string;
	legend?: boolean;
}

export interface StandardProps extends ChartProps {
	data: number[][];
}

export interface ScatterProps extends ChartProps {
	data: number[][][];
	xAxis?: string;
	yAxis?: string;
}

export type ChartType = "Bar"|"3dBar"|"Polar"|"Scatter"|"Spider"|"Network";

export type NetworkProps = {
	node: NetworkNodeType;
	layer?: number;
	accent?: number[];
	id?: string;
	colorSet?: string[];
}

export type NetworkNodeType = {
	input: number;
	hidden: number;
	output: number;
}