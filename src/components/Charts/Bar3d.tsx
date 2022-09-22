import React from "react";
import { StandardProps } from "../../lib/types";
import useCommonConfig from "../../hooks/useCommonConfig";
import Container from "../Container/Container";
import Highcharts from "highcharts";
import factory from "highcharts/highcharts-3d";

factory(Highcharts);

export default function Bar3d(props:StandardProps) {
	const { xAxis } = props;
	const { tId, config } = useCommonConfig(props, "3dBar");

	React.useEffect(() => {
		Highcharts.chart({
			...config,
			chart: {
				renderTo: tId,
				type: 'column',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 20,
					depth: 200,
					viewDistance: 100
				}
			},
			xAxis: {
				categories: (xAxis as string[]),
				offset: 20
			},
			plotOptions: {
				column: { depth: 75, groupZPadding: 0, grouping: false, pointPadding: 0.2 },
				// series: { pointPadding: 0, groupPadding: 0 },
			},
			yAxis: {
				tickInterval: 10
			},
		})
	}, [config, tId, props])

	return (
		<Container id={tId} className="bias-bar3dchart-container" />
	)
}