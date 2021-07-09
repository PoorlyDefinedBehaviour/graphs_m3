import { uniqBy, equals } from "ramda"

const calculateSavings = (costMatrix, routes, startingPoint) => {
  const savings = []

  const customers = uniqBy(
    route => route.customer,
    routes.flatMap(route =>
      route.path.map(edge => ({
        customer: edge.to,
        routeIndex: edge.routeIndex,
      }))
    )
  )

  for (let i = 0; i < customers.length; i += 1) {
    for (let j = i + 1; j < customers.length; j += 1) {
      const from = customers[i]
      const to = customers[j]

      savings.push({
        from,
        to,
        cost:
          (costMatrix[from.customer][startingPoint] ?? 0) +
          (costMatrix[startingPoint][to.customer] ?? 0) -
          costMatrix[from.customer][to.customer],
      })
    }
  }

  return savings.sort(
    (a, b) => b.cost - a.cost
  )
}

const buildInitialRoutes = (costMatrix, startingPoint) => {
  const routes = []

  const customers = Object.keys(costMatrix)

  for (let i = 0; i < customers.length; i += 1) {
    const customer = customers[i]

    if (customer === startingPoint) {
      continue
    }

    const route = {
      cost:
        costMatrix[startingPoint][customer] +
        costMatrix[customer][startingPoint],
      path: [
        {
          from: startingPoint,
          to: customer,
          cost: costMatrix[startingPoint][customer],
          routeIndex: i,
        },
        {
          from: customer,
          to: startingPoint,
          cost: costMatrix[customer][startingPoint],
          routeIndex: i,
        },
      ],
    }

    routes.push(route)
  }

  return routes
}

export const calculateRoutes = (
  costMatrix,
  { startingPoint, dailyVehicleDistance }
) => {
  const routes = buildInitialRoutes(costMatrix, startingPoint)
  const savings = calculateSavings(costMatrix, routes, startingPoint)

  const visitedCustomers = new Set()

  for (const { from, to } of savings) {
    const fromRoute = routes[from.routeIndex]
    const toRoute = routes[to.routeIndex]

    if (visitedCustomers.has(to.customer) && to.customer !== startingPoint) {
      continue
    }

    visitedCustomers.add(to.customer)

    const newConnection = {
      from: from.customer,
      to: to.customer,
      cost: costMatrix[from.customer][to.customer],
      routeIndex: from.routeIndex,
    }

    const routePath = [
      ...fromRoute.path.filter(edge => edge.to !== startingPoint),
      newConnection,
      ...toRoute.path.filter(edge => edge.from !== startingPoint),
    ]

    const routeCost = routePath.reduce((cost, edge) => cost + edge.cost, 0)

    if (routeCost > dailyVehicleDistance || equals(fromRoute, toRoute)) {
      continue
    }

    routes[from.routeIndex] = {
      cost: routeCost,
      path: routePath,
    }
    routes.splice(to.routeIndex, 1)
  }

  return routes
}
