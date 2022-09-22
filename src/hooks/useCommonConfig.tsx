import * as React from "react";
import { SeriesOptionsType } from "highcharts";
import { ChartProps, ChartType } from "../lib/types";
import Random from "../lib/random";

export default function useCommonConfig(props:ChartProps, type:ChartType) {
	const { data, id, seriesName, yAxis=undefined, colorSet, title, legend=false, subtitle } = props;

	const tId = React.useMemo(() => {
		return (!!id && id.length > 0) ? id:`${type}_${Random.string(8)}`;
	}, [id, type])

	const series = React.useMemo<SeriesOptionsType[]|any>(() => {
		if(type === "Bar" || type === "3dBar") {
			return (data as number[][]).map((v, i) => (
				{
					type: 'column',
					color: (!!colorSet && colorSet.length > 0 && colorSet[i]) ? colorSet[i]:undefined,
					data: v,
					name: (!!seriesName && seriesName.length > 0 && !!seriesName[i]) ? seriesName[i]:undefined
				}
			));
		}
		else if(type === "Spider") {
			return (data as number[][]).map((v, i) => (
				{
					type: 'line',
					color: (!!colorSet && colorSet.length > 0 && colorSet[i]) ? colorSet[i]:undefined,
					data: v,
					name: (!!seriesName && seriesName.length > 0 && !!seriesName[i]) ? seriesName[i]:undefined,
					pointPlacement: 'on'
				}
			));
		}
		else if(type === "Polar") {
			return (data as number[][]).map((v, i) => (
				{
					type: 'area',
					color: (!!colorSet && colorSet.length > 0 && colorSet[i]) ? colorSet[i]:undefined,
					data: v,
					name: (!!seriesName && seriesName.length > 0 && !!seriesName[i]) ? seriesName[i]:undefined
				}
			));
		}
		else if(type === "Scatter") {
			return (data as number[][][]).map((v, i) => (
				{
					color: (!!colorSet && colorSet.length > 0 && colorSet[i]) ? colorSet[i]:undefined,
					data: v,
					name: (!!seriesName && seriesName.length > 0 && !!seriesName[i]) ? seriesName[i]:undefined
				}
			))
		}
		return [];
	}, [type, data, colorSet, seriesName])

	const options = React.useMemo(() => {
		return {
			yAxis: /*(!!yAxis && yAxis.length > 0) ? yAxis:*/undefined,
			title: (!!title) ? title:"",
			subtitle: (!!subtitle) ? subtitle:"",
			legend
		}
	}, [title, subtitle, legend, /*yAxis*/])

	const config = React.useMemo(() => {
		return {
			series,
			tooltip: {enabled: true, animation: true},
			credits: {enabled: false},
			exporting: {enabled: false},
			yAxis: {
				categories: options.yAxis,
				title: { style: { display: (!!options.yAxis) ? "block":"none" } },
			},
			title: {
				text: options.title,
				style: {display: options.title.length === 0 ? "none":"block"}
			},
			subtitle: {
				text: options.subtitle,
				style: {display: options.subtitle.length === 0 ? "none":"block"}
			},
			legend: {enabled: options.legend}
		}
	}, [series, options])

	return { tId, config }
}