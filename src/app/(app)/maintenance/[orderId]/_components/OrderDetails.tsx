import {OrderResponse} from "@/lib/api/services/maintenanceServiceAPI";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import EditOrderDialog from "@/features/maintenance/components/EditOrderDialog";
import DeleteOrderDialog from "@/features/maintenance/components/DeleteOrderDialog";

export default function OrderDetails({order}: {
  order: OrderResponse;
}) {
  return (
    <Box
      component={Paper}
      sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 2}}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: {xs: 'column', md: 'row'},
        justifyContent: 'space-between',
        alignItems: {xs: 'flex-start', md: 'center'},
        gap: 1
      }}>
        <Typography variant="h2" fontSize="1.5rem" fontWeight="bold">
          Order Details
        </Typography>
        <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center'}}>
          <EditOrderDialog order={order}/>
          <DeleteOrderDialog order={order} />
        </Box>
      </Box>
      <Typography variant="body1">
        <strong>ID: </strong>{order.id}
      </Typography>
      <Typography variant="body1">
        <strong>Status: </strong>{order.status}
      </Typography>
      <Typography variant="body1">
        <strong>Priority: </strong>{order.priority}
      </Typography>
      <Typography variant="body1">
        <strong>Asset: </strong>
        <Link href={`/assets/${order.asset?.id}`} className="hover:underline">
          {order.asset?.id} - {order.asset?.name}
        </Link>
      </Typography>
      <Typography variant="body1">
        <strong>Placed By: </strong>
        <Link href={`/users/${order.placedBy?.id}`} className="hover:underline">
          {order.placedBy?.id} - {order.placedBy?.lastName}, {order.placedBy?.firstName}
        </Link>
      </Typography>
      {order.completedBy && (
        <Typography variant="body1">
          <strong>Completed By: </strong>
          <Link href={`/users/${order.completedBy?.id}`} className="hover:underline">
            {order.completedBy?.id} - {order.completedBy?.lastName}, {order.completedBy?.firstName}
          </Link>
        </Typography>
      )}
      <Typography variant="body1" flexWrap="wrap" width="100%">
        <strong>Description: </strong>{order.description}
      </Typography>

    </Box>
  )
}