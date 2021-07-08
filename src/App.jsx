import { Sigma } from "react-sigma"
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

  console.log("aaaa", JSON.stringify(routes, null, 2))

  const nodes = Object.keys(costMatrix).map((vertex, i) => ({
    id: vertex,
    label: vertex,
    size: 100,
    x: Math.cos(i),
    y: Math.sin(i),
  }))

  const edges = routes.flatMap(route => {
    const color = randomHexColor()

    return route.path.map(edge => ({
      id: `${edge.from} -> ${edge.to}`,
      label: `${edge.from} -> ${edge.to}`,
      source: edge.from,
      target: edge.to,
      color,
    }))
  })
  console.log(edges)
  const graph = {
    nodes,
    edges, // : [{ id: "e1", source: "A", target: "B", label: "SEES" }],
  }

  console.log("graph", JSON.stringify(graph, null, 2))

  return (
    <Sigma
      style={{ width: "1000px", height: "1000px" }}
      graph={graph}
      settings={{
        drawLabels: true,
        drawEdgeLabels: true,
        drawEdges: true,
        clone: true,
      }}
    />
  )
}

export default App
