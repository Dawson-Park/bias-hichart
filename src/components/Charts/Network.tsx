import React from "react";
import { NetworkProps } from "../../lib/types";
import styled from "styled-components";
import Random from "../../lib/random";
import makeNetworkChart from "../../lib/makeNetworkChart";

const Container = styled.section`
  display: flex;
  flex-flow: row nowrap;
  width: fit-content;
  height: fit-content;

  .ffnn-node { stroke: #fff; stroke-width: 2px; }
  .ffnn-link { stroke: #999; stroke-width: 2px; }
  .ffnn-accent { stroke: #666; stroke-width: 6px; }
`

export default function Network(props:NetworkProps) {
	const { id, node, layer=1, accent=[] } = props;

	const config = React.useMemo(() => {
		return {
			target: (!!id && id.length > 0) ? id:`Network_${Random.string(8)}`,
			input: !!node.input ? node.input:1,
			hidden: !!node.hidden ? node.hidden:1,
			output: !!node.output ? node.output:1,
			layer,
			accent,
			option: { colorFix: true }
		}
	}, [props])

	React.useEffect(() => {
		makeNetworkChart(config)
	}, [config, props])

	return (
		<Container className="bias-networkchart-container">
			<svg id={config.target} width="100%" height="100%" />
		</Container>
	)
}