type Order = {
  [item: string]: number;
};

type WarehouseInput = {
  name: string;
  inventory: Order;
};

type WarehouseOutput = {
  [warehouseName: string]: Order;
};

export function insufficientInventory(orderedValues: number[]) {
  for (let i = 0; i < orderedValues.length; i++) {
    if (orderedValues[i] > 0) {
      return true;
    }
  }

  return false;
}

export function allocateInventory(
  orderedItems: Order,
  warehouses: WarehouseInput[]
) {
  const warehouseOutputs: WarehouseOutput[] = [];

  warehouses.forEach((w) => {
    const tempOutput: WarehouseOutput = {};
    const itemsTaken: Order = {};

    Object.entries(w.inventory).forEach(
      ([itemInWarehouse, amountInWarehouse]) => {
        // Look at each item in the warehouse and adds to output if the order needs it
        // Going in sorted order so greedy approach tells us to take as many items at the current warehouse
        const amountNeeded = orderedItems[itemInWarehouse];

        if (
          amountInWarehouse > 0 &&
          amountNeeded > 0 &&
          Object.keys(orderedItems).indexOf(itemInWarehouse) !== -1
        ) {
          if (amountInWarehouse > amountNeeded) {
            itemsTaken[itemInWarehouse] = amountNeeded;
            orderedItems[itemInWarehouse] = 0;
          } else {
            itemsTaken[itemInWarehouse] = amountInWarehouse;
            orderedItems[itemInWarehouse] -= amountInWarehouse;
          }
        }
      }
    );

    tempOutput[w.name] = itemsTaken;

    if (Object.keys(itemsTaken).length > 0) {
      // ignore warehouses that we don't need anything from
      warehouseOutputs.push(tempOutput);
    }
  });

  // If non-zero items remain in the order, then insufficient inventory to meet the order
  if (insufficientInventory(Object.values(orderedItems))) {
    return [];
  }

  return warehouseOutputs;
}

/* Change the objects here to use your own custom tests
 * Note that the `name` field in the warehouse object needs to be in quotes in order to typecheck.
 * That's the only difference from the example input and the test input
 */
// const testOrder = { apple: 5, banana: 5, orange: 5 };
// const testWarehouses: WarehouseInput[] = [
//   { name: "owd", inventory: { apple: 5, orange: 10 } },
//   { name: "dm", inventory: { banana: 5, orange: 10 } },
// ];

// console.log(allocateInventory(testOrder, testWarehouses));
