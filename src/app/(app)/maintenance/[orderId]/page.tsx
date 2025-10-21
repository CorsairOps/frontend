"use client";
import ValidateRolesPage from "@/features/auth/components/ValidateRolesPage";
import {useParams} from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import {LoadingSpinnerLg} from "@/components/loading-spinner";
import Box from "@mui/material/Box";
import {useGetOrderById} from "@/lib/api/services/maintenanceServiceAPI";
import OrderDetails from "@/app/(app)/maintenance/[orderId]/_components/OrderDetails";

export default function MaintenanceOrderPage() {
  const params = useParams();
  const orderId = params.orderId;

  const {
    data: order,
    isLoading: loadingOrder,
    error: orderError
  } = useGetOrderById(parseInt(orderId as string));

  if (loadingOrder) {
    return <LoadingSpinnerLg/>;
  }

  if (orderError) {
    return (
      <div className="pt-24 flex flex-col gap-4 items-center justify-center">
        <PageBreadcrumbs links={[{label: "Maintenance Orders", href: "/maintenance"}]} current={"Order Details"}/>
        <Typography variant="body1" color="error">
          {`Error loading order: ${orderError.message}`}
        </Typography>
      </div>
    );
  }

  if (order) {
    return (
      <ValidateRolesPage validRoles={["ADMIN", "PLANNER", "OPERATOR", "TECHNICIAN", "ANALYST"]}>
        <div className="pt-24 p-8 w-full">
          <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <PageBreadcrumbs links={[{label: "Maintenance Orders", href: "/maintenance"}]} current={`Order ${orderId as string}`}/>
            <Box>
              <Typography variant="h1" sx={{fontSize: '2rem', fontWeight: 'bold'}}>
                Order {order.id}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Manage order {order.id}&#39;s details and settings.
              </Typography>
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
              <OrderDetails order={order} />
            </Box>
          </Container>
        </div>

      </ValidateRolesPage>
    )
  }
  return null;
}