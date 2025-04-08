import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

type SparkLineData = number[];

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
  const data = getDaysInMonth(4, 2024);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        colors={['hsl(210, 98%, 42%)']}
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  );
}

function renderStatus(status: 'In Stock' | 'Out of Stock') {
  const colors: { [index: string]: 'success' | 'error' } = {
    'In Stock': 'success',
    'Out of Stock': 'error',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(
  params: GridCellParams<{ name: string; color: string }, any, any>,
) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns: GridColDef[] = [
  { field: 'name', headerName: 'Product Name', flex: 1.5, minWidth: 200 },
  {
    field: 'category',
    headerName: 'Category',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value as any),
  },
  {
    field: 'price',
    headerName: 'Price',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => `$${params.toFixed(2)}`,
  },
  {
    field: 'stock',
    headerName: 'Stock',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
  },
  {
    field: 'sales',
    headerName: 'Daily Sales',
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

export const rows: GridRowsProp = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    status: 'In Stock',
    price: 89.99,
    stock: 150,
    sales: [12, 15, 18, 22, 25, 30, 28, 32, 35, 40, 38, 42, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130],
  },
  {
    id: 2,
    name: 'Smartphone X Pro',
    category: 'Electronics',
    status: 'In Stock',
    price: 999.99,
    stock: 75,
    sales: [5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120],
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    status: 'Out of Stock',
    price: 24.99,
    stock: 0,
    sales: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165],
  },
  {
    id: 4,
    name: 'Stainless Steel Water Bottle',
    category: 'Home',
    status: 'In Stock',
    price: 19.99,
    stock: 200,
    sales: [8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125],
  },
  {
    id: 5,
    name: 'Premium Coffee Beans',
    category: 'Food',
    status: 'In Stock',
    price: 14.99,
    stock: 300,
    sales: [15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140],
  },
  {
    id: 6,
    name: 'Yoga Mat',
    category: 'Fitness',
    status: 'In Stock',
    price: 29.99,
    stock: 90,
    sales: [5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120],
  },
  {
    id: 7,
    name: 'Wireless Charger',
    category: 'Electronics',
    status: 'Out of Stock',
    price: 34.99,
    stock: 0,
    sales: [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130],
  },
  {
    id: 8,
    name: 'Leather Wallet',
    category: 'Accessories',
    status: 'In Stock',
    price: 49.99,
    stock: 60,
    sales: [3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
  },
  {
    id: 9,
    name: 'Smart Watch',
    category: 'Electronics',
    status: 'In Stock',
    price: 199.99,
    stock: 45,
    sales: [2, 3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110],
  },
  {
    id: 10,
    name: 'Desk Lamp',
    category: 'Home',
    status: 'In Stock',
    price: 39.99,
    stock: 120,
    sales: [4, 6, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
  },
  {
    id: 11,
    name: 'Running Shoes',
    category: 'Footwear',
    status: 'In Stock',
    price: 79.99,
    stock: 85,
    sales: [7, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125],
  },
  {
    id: 12,
    name: 'Backpack',
    category: 'Accessories',
    status: 'In Stock',
    price: 59.99,
    stock: 110,
    sales: [5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120],
  },
  {
    id: 13,
    name: 'Blender',
    category: 'Kitchen',
    status: 'Out of Stock',
    price: 89.99,
    stock: 0,
    sales: [3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
  },
  {
    id: 14,
    name: 'Sunglasses',
    category: 'Accessories',
    status: 'In Stock',
    price: 129.99,
    stock: 65,
    sales: [4, 6, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
  },
];