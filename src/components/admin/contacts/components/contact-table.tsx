import { motion } from "framer-motion";
import { Card, Title, Pagination } from "@mantine/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, Trash2 } from "lucide-react";
import type { Contact } from "@/services/api/contactsService";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ContactTableProps {
  items: Contact[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onView: (contact: Contact) => void;
  onConfirm: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContactTable({
  items,
  total,
  page,
  limit,
  onPageChange,
  onView,
  onConfirm,
  onDelete,
}: ContactTableProps) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(total / limit);

  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <div className="flex items-center justify-between">
          <Title order={4}>{t("contacts.listTitle")}</Title>
          <div className="text-sm text-muted-foreground">
            {t("contacts.totalContacts", { count: total })}
          </div>
        </div>
      </Card.Section>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("contacts.name")}</TableHead>
            <TableHead>{t("contacts.subject")}</TableHead>
            <TableHead>{t("contacts.email")}</TableHead>
            <TableHead>{t("contacts.phone")}</TableHead>
            <TableHead>{t("contacts.status")}</TableHead>
            <TableHead>{t("contacts.createdAt")}</TableHead>
            <TableHead className="text-right">
              {t("contacts.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                {t("contacts.noData")}
              </TableCell>
            </TableRow>
          ) : (
            items?.map((contact, index) => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {contact.title}
                </TableCell>
                <TableCell>{contact.email || "-"}</TableCell>
                <TableCell>{contact.phone || "-"}</TableCell>
                <TableCell>
                  {contact.isConfirmed ? (
                    <Badge variant="default" className="bg-green-600">
                      {t("contacts.confirmed")}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{t("contacts.pending")}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(contact.createdAt), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(contact)}
                      title={t("contacts.viewDetail")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!contact.isConfirmed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onConfirm(contact.id)}
                        title={t("contacts.confirmContact")}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(contact.id)}
                      title={t("contacts.deleteContact")}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Card.Section withBorder inheritPadding py="sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("contacts.showing", {
                from: (page - 1) * limit + 1,
                to: Math.min(page * limit, total),
                total: total,
              })}
            </div>
            <Pagination
              total={totalPages}
              value={page}
              onChange={onPageChange}
              size="sm"
            />
          </div>
        </Card.Section>
      )}
    </Card>
  );
}
