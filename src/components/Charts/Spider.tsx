import React from "react";
import { StandardProps } from "../../lib/types";
import useCommonConfig from "../../hooks/useCommonConfig";
import Container from "../Container/Container";
import Highcharts from "highcharts";
import factory from "highcharts/highcharts-more";

factory(Highcharts);

export default function Spider(props:StandardProps) {
	const { xAxis } = props;
	const { tId, config } = useCommonConfig(props, "Spider");

	React.useEffect(() => {
		Highcharts.chart({
			...config,
			chart: {
				polar: true,
				renderTo: tId,
				type: 'line'
			},
			xAxis: {
				categories: (xAxis as string[]),
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
	}, [config, tId, props])

	return (
		<Container id={tId} className="bias-spiderchart-container" />
	)
}