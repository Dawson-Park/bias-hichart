import React from "react";
import { StandardProps } from "../../lib/types";
import useCommonConfig from "../../hooks/useCommonConfig";
import Container from "../Container/Container";
import Highcharts from "highcharts";

export default function Polar(props:StandardProps) {
	const { xAxis } = props;
	const { tId, config } = useCommonConfig(props, "Polar");

	React.useEffect(() => {
		Highcharts.chart({
			...config,
			series: config.series,
			chart: {
				polar: true,
				renderTo: tId
			},
			xAxis: {
				categories: (xAxis as string[]),
				tickmarkPlacement: 'on',
				lineWidth: 0,
			},
			yAxis: { min: 0 },
			legend: {
				align: 'right',
				verticalAlign: 'middle',
				layout: 'vertical'
			},
			pane: {
				startAngle: 0,
				endAngle: 360
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
		<Container id={tId} className="bias-polarchart-container" />
	)
}