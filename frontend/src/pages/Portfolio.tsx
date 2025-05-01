import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const mockHoldings = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, value: 1800, allocation: 12.4 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, value: 1900, allocation: 13.1 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 2, value: 2800, allocation: 19.3 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 3, value: 4500, allocation: 31.0 },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 5, value: 1500, allocation: 10.3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Portfolio: React.FC = () => {
  const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.value, 0);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Portfolio
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Change (24h)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No assets in portfolio
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Portfolio; 