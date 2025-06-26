"use client";

import { Button } from "@/components/ui/button";
import type { Stock } from "./columns";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  pdf,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 12,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: "bold",
    borderRightWidth: 1,
    width: "100%",
    height: "100%",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "center",
    justifyContent: "center",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    height: "20px",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: "auto",
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    margin: "auto",
    padding: "1px",
    fontSize: 10,
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  footerCell: {
    margin: "auto",
    fontSize: 12,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    width: "100%",
    height: "100%",
    padding: "20px",
  },
});

function StockDocument({ stocks, count }: { stocks: Stock[]; count: number }) {
  const N = 30;
  const filledStocks = stocks.concat(
    Array(Math.max(N - stocks.length, 0))
      .fill({
        id: 0,
        quantity: "",
        description: { name: "" },
      })
      .map(
        (stock, index) =>
          ({
            ...stock,
            id: 100000 + index,
          }) as Stock,
      ),
  );
  const date = format(stocks[0]?.date ?? new Date(), "dd/MM/yyyy");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerCell}>
            <Text style={styles.title}>Titec</Text>
            <Text style={styles.paragraph}>Tecnología y Servicios</Text>
          </View>
          <View style={{ ...styles.headerCell, paddingTop: "20px" }}>
            <Text style={styles.title}>{date}</Text>
          </View>
        </View>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "80%" }}>
              <Text style={styles.tableCellHeader}>Detalle</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "20%" }}>
              <Text style={styles.tableCellHeader}>Cantidad</Text>
            </View>
          </View>

          {/* Table Rows */}
          {filledStocks.map((row) => (
            <View style={styles.tableRow} key={row.id}>
              <View style={{ ...styles.tableCol, width: "80%" }}>
                <Text style={styles.tableCell}>{row.description?.name}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{row.quantity}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <View style={styles.footerCell}>
            <Text style={styles.paragraph}>
              Remito N° {`${count}`.padStart(7, "0")}
            </Text>
          </View>
          <View style={styles.footerCell}>
            <Text style={styles.paragraph}>Fecha de Emisión</Text>
            <Text style={styles.paragraph}>
              {format(new Date(), "dd/MM/yyyy")}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function PDFDownloadButton({
  client,
  rows,
  disabled,
  className,
}: {
  client: {
    id: number;
    name: string;
  };
  rows: Stock[];
  disabled: boolean;
  className?: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const trpc = useTRPC();
  const mutation = useMutation(trpc.stock.createBill.mutationOptions());

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const count = await mutation.mutateAsync({ clientId: client.id });

      // Generate PDF only when clicked
      const blob = await pdf(
        <StockDocument stocks={rows} count={count} />,
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stock-${client.name}-${format(new Date(), "dd-MM-yyyy")}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error generando PDF. Por favor, intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled}
      loading={isGenerating}
      className={className}
    >
      Descargar PDF
    </Button>
  );
}
