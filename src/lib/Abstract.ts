import { SeriesOptionsType } from "highcharts";

export type StdOpts = {
	yAxis: undefined;
	title: string;
	subtitle: string;
	legend: boolean;
}

type Props = {
	data: number[][]|number[][][];
	targetId: string;
	xAxis?: string[]|string;
	seriesName?: string[];
	colorSet?: string[];
	title?: string;
	subtitle?: string;
	legend?: boolean;
}

export default abstract class Abstract {
	protected abstract data:number[][]|number[][][];
	protected targetId:string = '';
	protected seriesName:string[] = [];
	protected colorSet:string[] = [];
	protected title:string|undefined = undefined;
	protected subtitle:string|undefined = undefined;
	protected legend:boolean|undefined = undefined;
	protected abstract xAxis:string[]|string|undefined;

	constructor(props:Props) {
		this.targetId = props.targetId;
		this.seriesName = (!!props.seriesName) ? props.seriesName:[];
		this.colorSet = (!!props.colorSet) ? props.colorSet:[];
		this.title = props.title;
		this.subtitle = props.subtitle;
		this.legend = props.legend;
	}

	// protected abstract init(): void;
	protected abstract getSeries(data:number[]|number[][]|number[][][]): void;
	protected getOptions():StdOpts {
		const yAxis = undefined;
		const title = (!!this.title) ? this.title:"";
		const subtitle = (!!this.subtitle) ? this.subtitle:"";
		const legend = (this.legend === true);

		return {
			yAxis,
			title,
			subtitle,
			legend
		}
	};

	protected getConfigs(series:SeriesOptionsType[], options:StdOpts) {
		return {
			series: series,
			tooltip: { enabled: true, animation: true },
			credits: { enabled: false },
			exporting: { enabled: false },
			yAxis: {
				categories: options.yAxis,
				title: {
					style: {
						display: (!!options.yAxis) ? "block":"none",
					}
				},
				// tickColor: 'currentColor',
				// lineColor: 'currentColor',
				// labels: {
				// 	style: {
				// 		color: 'currentColor'
				// 	}
				// }
			},
			title: {
				text: options.title,
				style: {
					display: options.title.length === 0 ? "none":"block",
				}
			},
			subtitle: {
				text: options.subtitle,
				style: {
					display: options.subtitle.length === 0 ? "none":"block",
				}
			},
			legend: {
				enabled: options.legend
			},
		}
	}
	public abstract show(): void;
	// public abstract clear(): void;
}