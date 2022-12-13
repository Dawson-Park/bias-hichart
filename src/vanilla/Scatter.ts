import Abstract from "../lib/Abstract";
import Highcharts, { SeriesOptionsType } from "highcharts";

type Props = {
	data: number[][][];
	targetId: string;
	xAxis?: string;
	yAxis?: string;
	seriesName?: string[];
	colorSet?: string[];
	title?: string;
	subtitle?: string;
	legend?: boolean;
}

export default class Scatter extends Abstract {
	protected data: number[][][] = [];
	protected xAxis:string|undefined = undefined;
	private readonly yAxis:string|undefined = undefined;

	constructor(props:Props) {
		super(props);
		this.data = props.data;
		this.xAxis = props.xAxis;
		this.yAxis = props.yAxis;
	}

	protected getSeries(data: number[][][]):any {
		return data.map((v, i) => {
			const colorSet = (this.colorSet.length > 0 && this.colorSet[i]) ? this.colorSet[i]:undefined;
			const name = (!!this.seriesName && this.seriesName.length > 0 && !!this.seriesName[i]) ? this.seriesName[i]:undefined;

			return {
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
			series: series,
			chart: {
				renderTo: this.targetId,
				type: 'scatter',
				zooming: {
					type: "xy"
				}
			},
			xAxis: {
				title: { text: undefined },
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true
			},
			yAxis: {
				title: { text: undefined },
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				verticalAlign: 'top',
				x: 100,
				y: 70,
				floating: true,
				borderWidth: 1
			},
			plotOptions: {
				scatter: {
					marker: {
						radius: 5,
						states: {
							hover: {
								enabled: true,
								lineColor: 'rgb(100,100,100)'
							}
						}
					},
					tooltip: {
						headerFormat: '<b>{series.name}</b><br>',
						pointFormat: `${this.xAxis||"x"}: {point.x}</br>${this.yAxis||"y"}: {point.y}`
					}
				}
			},
		})
	}
}