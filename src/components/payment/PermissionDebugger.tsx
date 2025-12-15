import { useState, useEffect } from "react";
import {
  checkItemPermissions,
  getItemWithAllFields,
} from "../../api/checkPermissions";
import type { PaymentType } from "../../api/getData";

interface PermissionDebuggerProps {
  payment: PaymentType;
}

export function PermissionDebugger({ payment }: PermissionDebuggerProps) {
  const [permissions, setPermissions] = useState<any>(null);
  const [fullItemData, setFullItemData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [permData, itemData] = await Promise.all([
          checkItemPermissions(payment.ID),
          getItemWithAllFields(payment.ID),
        ]);
        setPermissions(permData);
        setFullItemData(itemData);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات مجوزها:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [payment.ID]);

  if (loading) {
    return <div className="text-xs text-gray-500">در حال بررسی مجوزها...</div>;
  }

  return (
    <div className="text-xs space-y-1 p-2 bg-gray-100 rounded">
      <div className="font-semibold">🔐 Debug Info:</div>

      {permissions && (
        <div>
          <div>Read: {permissions.hasRead ? "✅" : "❌"}</div>
          <div>Edit: {permissions.hasEdit ? "✅" : "❌"}</div>
          <div>Delete: {permissions.hasDelete ? "✅" : "❌"}</div>
        </div>
      )}

      {fullItemData && (
        <div className="mt-2">
          <div className="font-semibold">📊 Full Item Data:</div>
          <div>Status: {fullItemData.status}</div>
          <div>ModerationStatus: {fullItemData.OData__ModerationStatus}</div>
          <div>UIVersion: {fullItemData.OData__UIVersionString}</div>
          <div>Modified: {fullItemData.Modified}</div>
          <div>EditorId: {fullItemData.EditorId}</div>
        </div>
      )}
    </div>
  );
}

