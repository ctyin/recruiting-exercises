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

function allocateInventory(orderedItems: Order, warehouses: WarehouseInput[]) {
  const warehouseOutputs: WarehouseOutput[] = [];

  warehouses.forEach((w) => {
    const tempOutput: WarehouseOutput = {};
    Object.entries(w.inventory).forEach(
      ([itemInWarehouse, amountInWarehouse]) => {
        // Look at each item in the warehouse and checks if the order needs it
        // Going in sorted order so greedy approach tells us to maximize items we take at each warehouse

        if (
          amountInWarehouse > 0 &&
          Object.keys(orderedItems).indexOf(itemInWarehouse) !== -1
        ) {
          const tempOrder: Order = {};
          const amountNeeded = orderedItems[itemInWarehouse];
          if (amountInWarehouse > amountNeeded) {
            tempOrder[itemInWarehouse] = amountNeeded;
            orderedItems[itemInWarehouse] = 0;
          } else {
            tempOrder[itemInWarehouse] = amountInWarehouse;
            orderedItems[itemInWarehouse] -= amountInWarehouse;
          }

          tempOutput[w.name] = tempOrder;
        }
      }
    );

    warehouseOutputs.push(tempOutput);
  });

  // Checks for remaining (non-zero) items in the order
  for (let i = 0; i < Object.values(orderedItems).length; i++) {
    if (Object.values(orderedItems)[i] > 0) {
      return [];
    }
  }

  return warehouseOutputs;
}
// { apple: 1 }, [{ name: owd, inventory: { apple: 0 } }]
const testOrder = { apple: 1 };
const testWarehouses = [{ name: "owd", inventory: { apple: 0 } }];

console.log(allocateInventory(testOrder, testWarehouses));
