import React from "react";
import { StandardProps } from "../../lib/types";
import useCommonConfig from "../../hooks/useCommonConfig";
import Container from "../Container/Container";
import Highcharts from "highcharts";

export default function Bar(props:StandardProps) {
	const { xAxis } = props;
	const { tId, config } = useCommonConfig(props, "Bar");

	React.useEffect(() => {
		Highcharts.chart({
			...config,
			chart: {
				renderTo: tId,
				type: 'column'
			},
			xAxis: {
				categories: (xAxis as string[])
			}
		})
	}, [config, tId, props])

	return (
		<Container id={tId} className="bias-barchart-container" />
	)
}