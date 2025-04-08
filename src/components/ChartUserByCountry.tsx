import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { BarChart } from '@mui/x-charts/BarChart';
import { Grid } from '@mui/material';
import { rows } from '../internals/data/gridData'; // Import your product data

// Utility function to aggregate data by category
const getCategoryData = (products: typeof rows) => {
  const categoryMap = new Map<string, number>();
  
  products.forEach(product => {
    const current = categoryMap.get(product.category) || 0;
    categoryMap.set(product.category, current + 1);
  });

  return Array.from(categoryMap.entries()).map(([label, value]) => ({
    label,
    value,
    id: label
  }));
};

// Utility function to create price distribution data
const getPriceDistributionData = (products: typeof rows) => {
  const ranges = [
    { label: '$0 - $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200+', min: 200, max: Infinity }
  ];

  return ranges.map(range => {
    const count = products.filter(p => 
      p.price >= range.min && p.price < range.max
    ).length;
    return { ...range, value: count };
  });
};

// Utility function to get stock status data
const getStockStatusData = (products: typeof rows) => {
  const inStock = products.filter(p => p.status === 'In Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
  
  return [
    { label: 'In Stock', value: inStock, id: 'in-stock' },
    { label: 'Out of Stock', value: outOfStock, id: 'out-of-stock' }
  ];
};

// Utility function to get top products by sales
const getTopProducts = (products: typeof rows, count = 5) => {
  return [...products]
    .sort((a, b) => Math.max(...b.sales) - Math.max(...a.sales))
    .slice(0, count)
    .map(product => ({
      name: product.name,
      value: Math.max(...product.sales),
      category: product.category
    }));
};

interface StyledTextProps {
  variant: 'primary' | 'secondary';
}

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<StyledTextProps>(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

interface PieCenterLabelProps {
  primaryText: string;
  secondaryText: string;
}

function PieCenterLabel({ primaryText, secondaryText }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

export default function ProductAnalyticsDashboard() {
  const categoryData = getCategoryData(rows);
  const priceData = getPriceDistributionData(rows);
  const stockData = getStockStatusData(rows);
  const topProducts = getTopProducts(rows);

  const categoryColors = [
    'hsl(210, 70%, 60%)',
    'hsl(210, 70%, 50%)',
    'hsl(210, 70%, 40%)',
    'hsl(210, 70%, 30%)',
    'hsl(210, 70%, 20%)'
  ];

  const priceColors = [
    'hsl(120, 70%, 60%)',
    'hsl(120, 70%, 50%)',
    'hsl(120, 70%, 40%)',
    'hsl(120, 70%, 30%)'
  ];

  const stockColors = [
    'hsl(90, 70%, 50%)',
    'hsl(0, 70%, 50%)'
  ];

  return (
    <Grid container spacing={2}>
      {/* Category Distribution Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              Product Categories
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart
                colors={categoryColors}
                margin={{ left: 80, right: 80, top: 80, bottom: 80 }}
                series={[{
                  data: categoryData,
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 2,
                }]}
                height={300}
                width={400}
              >
                <PieCenterLabel 
                  primaryText={`${rows.length}`} 
                  secondaryText="Total Products" 
                />
              </PieChart>
            </Box>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {categoryData.map((category, index) => (
                <Stack key={category.id} direction="row" alignItems="center" gap={2}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: categoryColors[index % categoryColors.length],
                    borderRadius: '2px'
                  }} />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {category.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.value} ({Math.round((category.value / rows.length) * 100)}%)
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Price Distribution Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              Price Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <BarChart
                xAxis={[{
                  scaleType: 'band',
                  data: priceData.map(item => item.label),
                }]}
                series={[{
                  data: priceData.map(item => item.value),
                  color: priceColors[0]
                }]}
                height={300}
              />
            </Box>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {priceData.map((range, index) => (
                <Stack key={range.label} direction="row" alignItems="center" gap={2}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: priceColors[index % priceColors.length],
                    borderRadius: '2px'
                  }} />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {range.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {range.value} products
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Stock Status */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              Stock Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart
                colors={stockColors}
                margin={{ left: 80, right: 80, top: 80, bottom: 80 }}
                series={[{
                  data: stockData,
                  innerRadius: 60,
                  outerRadius: 100,
                }]}
                height={300}
                width={400}
              />
            </Box>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {stockData.map((status, index) => (
                <Stack key={status.id} direction="row" alignItems="center" gap={2}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: stockColors[index % stockColors.length],
                    borderRadius: '2px'
                  }} />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {status.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {status.value} ({Math.round((status.value / rows.length) * 100)}%)
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Selling Products */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              Top Selling Products (Max Daily Sales)
            </Typography>
            <Stack spacing={2}>
              {topProducts.map((product, index) => (
                <div key={index}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={500}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.value} sales
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {product.category}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(product.value / Math.max(...topProducts.map(p => p.value))) * 100}
                    sx={{
                      height: 8,
                      mt: 1,
                      [`& .${linearProgressClasses.bar}`]: {
                        backgroundColor: 'hsl(210, 70%, 50%)',
                      },
                    }}
                  />
                </div>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}