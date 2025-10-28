"use client";

import { LoadingSpinnerMd } from "@/components/loading-spinner";
import { AssetResponse } from "@/lib/api/services/assetServiceAPI";
import { useGetAllOrders } from "@/lib/api/services/maintenanceServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function AssetMaintenanceOrders({ asset }: { asset: AssetResponse }) {
  const { data: orders, isLoading: loadingOrders, error: ordersError } = useGetAllOrders({ assetId: asset.id as string });
  return (
    <Box component={Paper}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, gridColumn: { md: "span 3" }, width: "100%" }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { md: 'row', xs: 'column' },
        justifyContent: 'space-between',
        alignItems: { md: 'center', xs: 'flex-start' },
        gap: 2,
        borderBottom: '1px solid primary.main',
        pb: 1
      }}>
        <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Maintenance Orders
        </Typography>
      </Box>
      <hr />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {loadingOrders && <LoadingSpinnerMd />}
        {ordersError && <Typography color="error">Error loading orders</Typography>}
        {!loadingOrders && !ordersError && orders && orders.length === 0 && (
          <Typography>No maintenance orders found for this asset.</Typography>
        )}
        {!loadingOrders && !ordersError && orders && orders.length > 0 && (
          orders.map((order) => (
            <Link key={order.id} href={`/maintenance/${order.id}`}>
              <Box sx={{ p: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Order ID: {order.id}
                </Typography>
                <Typography>
                  Status: {order.status}
                </Typography>
                <Typography>
                  Priority: {order.priority}
                </Typography>
                <Typography>
                  Created At: {new Date(order.createdAt as string).toLocaleDateString()}
                </Typography>
                <Typography>
                  Placed By: {order.placedBy?.lastName}, {order.placedBy?.firstName}
                </Typography>
                {order.completedBy && (
                  <Typography>
                    Completed By: {order.completedBy?.lastName}, {order.completedBy?.firstName}
                  </Typography>
                )}
              </Box>
            </Link>
          ))
        )}
      </Box>
    </Box>
  );
}
