import ReactFlow from "react-flow-renderer"
import * as savings from "./Savings"

const randomHexColor = () => `#${Math.random().toString(16).substr(2, 6)}`

function App() {
  const costMatrix = {
    A: {
      B: 10,
      C: 12,
      D: 18,
      E: 10,
      O: 10,
    },
    B: {
      A: 10,
      C: 7,
      D: 12,
      E: 12,
      O: 5,
    },
    C: {
      A: 12,
      B: 7,
      D: 8,
      E: 12,
      O: 5,
    },
    D: {
      A: 18,
      B: 12,
      C: 8,
      E: 10,
      O: 10,
    },
    E: {
      A: 10,
      B: 12,
      C: 12,
      D: 10,
      O: 10,
    },
    O: {
      A: 10,
      B: 5,
      C: 5,
      D: 10,
      E: 10,
    },
  }

  const routes = savings.calculateRoutes(costMatrix, {
    startingPoint: "O",
    dailyVehicleDistance: 30,
  })

  const nodes = Object.keys(costMatrix).map((vertex, i) => ({
    id: vertex,
    data: { label: vertex },
    position: {
      x: Math.cos(i) * 300,
      y: Math.sin(i) * 300,
    },
  }))

  const edges = routes.flatMap(route => {
    const color = randomHexColor()

    if (route.path.length === 2) {
      const [fromEdge, toEdge] = route.path

      return [
        {
          id: `${fromEdge.from} -> ${fromEdge.to}`,
          label: `${fromEdge.from} -> ${fromEdge.to} - Cost: ${fromEdge.cost} | ${toEdge.from} -> ${toEdge.to} - Cost ${toEdge.cost}`,
          type: "straight",
          source: fromEdge.from,
          target: fromEdge.to,
          style: {
            stroke: color,
          },
        },
      ]
    }

    return route.path.map(edge => ({
      id: `${edge.from} -> ${edge.to}`,
      label: `${edge.from} -> ${edge.to} - Cost: ${edge.cost}`,
      type: "straight",
      source: edge.from,
      target: edge.to,
      style: {
        stroke: color,
      },
    }))
  })

  const graph = [...nodes, ...edges]

  return (
    <ReactFlow elements={graph} style={{ width: "100%", height: "100vh" }} />
  )
}

export default App
