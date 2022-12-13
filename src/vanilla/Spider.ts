import { SeriesOptionsType } from "highcharts";
import Abstract from "../lib/Abstract";
import Highcharts from "highcharts";
import factory from "highcharts/highcharts-more";

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
				type: 'line',
				color: colorSet,
				data: v,
				name: name,
				pointPlacement: 'on',
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
				polar: true,
				renderTo: this.targetId,
				type: 'line'
			},
			xAxis: {
				categories: this.xAxis,
				tickmarkPlacement: 'on',
				lineWidth: 0
			},
			yAxis: {
				gridLineInterpolation: 'polygon',
				lineWidth: 0,
				min: 0
			},
			legend: {
				align: 'right',
				verticalAlign: 'middle',
				layout: 'vertical'
			},
			tooltip: {
				shared: true,
				pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
			},
			pane: {
				size: '80%'
			},
			responsive: {
				rules: [{
					condition: {
						maxWidth: 500
					},
					chartOptions: {
						legend: {
							align: 'center',
							verticalAlign: 'bottom',
							layout: 'horizontal'
						},
						pane: {
							size: '70%'
						}
					}
				}]
			}
		})
	}
}