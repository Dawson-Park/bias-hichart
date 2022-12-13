import { SeriesOptionsType } from "highcharts";
import Abstract from "../lib/Abstract";
import Highcharts from "highcharts";
import factory from "highcharts/highcharts-3d";

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

export default class Bar3d extends Abstract {
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
		factory(Highcharts);

		const series = this.getSeries(this.data);
		const options = this.getOptions();
		const config = this.getConfigs(series, options);

		Highcharts.chart({
			...config,
			chart: {
				renderTo: this.targetId,
				type: 'column',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 20,
					depth: 200,
					viewDistance: 100
				},
			},
			xAxis: {
				categories: this.xAxis,
				offset: 20,
			},
			plotOptions: {
				column: { depth: 75, groupZPadding: 0, grouping: false, pointPadding: 0.2 },
			},
			yAxis: {
				tickInterval: 10
			},
		})
	}
}