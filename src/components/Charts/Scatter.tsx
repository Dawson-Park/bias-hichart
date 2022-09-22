import React from "react";
import { ScatterProps } from "../../lib/types";
import useCommonConfig from "../../hooks/useCommonConfig";
import Container from "../Container/Container";
import Highcharts from "highcharts";

export default function Scatter(props:ScatterProps) {
	const { xAxis, yAxis } = props;
	const { tId, config } = useCommonConfig(props, "Scatter");

	React.useEffect(() => {
		Highcharts.chart({
			...config,
			series: config.series,
			chart: {
				renderTo: tId,
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
						pointFormat: `${xAxis||"x"}: {point.x}</br>${yAxis||"y"}: {point.y}`
					}
				}
			},
		});
	}, [config, tId, props])

	return (
		<Container id={tId} className="bias-scatterchart-container" />
	)
}