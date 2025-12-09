import { useContactCrud } from "@/components/admin/contacts/hooks/use-contact-crud";
import { ContactTable } from "@/components/admin/contacts/components/contact-table";
import { ContactDetailDialog } from "@/components/admin/contacts/components/contact-detail-dialog";
import { useTranslation } from "react-i18next";

export default function ContactManager() {
  const crud = useContactCrud();
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">{t("contacts.title")}</h1>
          <p className="text-muted-foreground">{t("contacts.subtitle")}</p>
        </div>
      </div>

      <ContactTable
        items={crud.items}
        total={crud.total}
        page={crud.page}
        limit={crud.limit}
        onPageChange={crud.setPage}
        onView={crud.openDetail}
        onConfirm={crud.confirm}
        onDelete={crud.remove}
      />

      <ContactDetailDialog
        isOpen={crud.isDetailOpen}
        onOpenChange={crud.closeDetail}
        contact={crud.selected}
        onConfirm={crud.confirm}
      />
    </div>
  );
}
