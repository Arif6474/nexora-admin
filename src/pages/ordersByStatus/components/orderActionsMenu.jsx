import { DataTableRowActions } from "@/components/layout/CRUD/dataTable/dataTableRowActions";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { useMemo } from "react";

function OrderActionsMenu({ row, setTargetID, setShowItem, setShowUpdateForm }) {
  const item = row.original;


  const actions = useMemo(() => {
    const baseActions = [
      {
        label: "View Order",
        onClick: () => {
          setTargetID(item._id);
          setShowItem(true);
        },
        icon: IconEye,
      },
    ];

    // ✅ Only show "Update Status" if NOT in these final statuses
    const restrictedStatuses = ["Cancelled", "Returned", "Delivered"];
    if (item && !restrictedStatuses.includes(item.orderStatus)) {
      baseActions.push({
        label: "Update Status",
        onClick: () => {
          setTargetID(item._id);
          setShowUpdateForm(true);
        },
        icon: IconEdit,
      });
    }

    return baseActions;
  }, [item, setTargetID, setShowItem, setShowUpdateForm]);

  return <DataTableRowActions actions={actions} />;
}

export default OrderActionsMenu;
