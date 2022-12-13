import { SeriesOptionsType } from "highcharts";
import Abstract from "../lib/Abstract";
import Highcharts from "highcharts";

type Props = {
	data: number[][];
	targetId: string;
	xAxis?: string[];
	seriesName?: string[];
	colorSet?: string[];
	title?: string;
	subtitle?: string;
	legend?: boolean;
}

export default class Bar extends Abstract {
	protected data: number[][] = [];
	protected xAxis:string[]|undefined = undefined;

	constructor(props:Props) {
		super(props);
		this.data = props.data;
		this.xAxis = props.xAxis;
	}

	protected getSeries(data: number[][]):SeriesOptionsType[] {
		return data.map((v, i) => {
			const colorSet = (this.colorSet.length > 0 && this.colorSet[i]) ? this.colorSet[i]:undefined;
			const name = (!!this.seriesName && this.seriesName.length > 0 && !!this.seriesName[i]) ? this.seriesName[i]:undefined;

			return {
				type: 'column',
				color: colorSet,
				data: v,
				name: name,
			}
		})
	}

	public show() {
		const series = this.getSeries(this.data);
		const options = this.getOptions();
		const config = this.getConfigs(series, options);

		Highcharts.chart({
			...config,
			chart: {
				renderTo: this.targetId,
				type: 'column',
				// backgroundColor: 'transparent'
			},
			xAxis: {
				categories: this.xAxis,
				// tickColor: 'currentColor',
				// lineColor: 'currentColor',
				// labels: {
				// 	style: {
				// 		color: 'currentColor'
				// 	}
				// }
			},
		})
	}
}