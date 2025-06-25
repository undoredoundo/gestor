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

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "16%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "16%",
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
});

function StockDocument({
  client,
  stocks,
}: {
  client: string;
  stocks: Stock[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Stock {client}</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "16%" }}>
              <Text style={styles.tableCellHeader}>Descripción</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "16%" }}>
              <Text style={styles.tableCellHeader}>Código</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "12%" }}>
              <Text style={styles.tableCellHeader}>Fecha</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "12%" }}>
              <Text style={styles.tableCellHeader}>Cantidad</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "12%" }}>
              <Text style={styles.tableCellHeader}>Estado</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "32%" }}>
              <Text style={styles.tableCellHeader}>Nota</Text>
            </View>
          </View>

          {/* Table Rows */}
          {stocks.map((row) => (
            <View style={styles.tableRow} key={row.id}>
              <View style={{ ...styles.tableCol, width: "16%" }}>
                <Text style={styles.tableCell}>{row.description?.name}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "16%" }}>
                <Text style={styles.tableCell}>{row.code?.name}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "12%" }}>
                <Text style={styles.tableCell}>
                  {format(row.date, "dd/MM/yyyy")}
                </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "12%" }}>
                <Text style={styles.tableCell}>{row.quantity}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "12%" }}>
                <Text style={styles.tableCell}>
                  {row.status === "ingreso" ? "Ingreso" : "Egreso"}
                </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "32%" }}>
                <Text style={styles.tableCell}>{row.note}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

// export function PDFDownloadButton({
//   client,
//   rows,
// }: {
//   client: string;
//   rows: Stock[];
// }) {
//   return (
//     <PDFDownloadLink
//       document={<StockDocument client={client} stocks={rows} />}
//       fileName="stock.pdf"
//     >
//       <Button>PDF</Button>
//     </PDFDownloadLink>
//   );
// }

export function PDFDownloadButton({
  client,
  rows,
  disabled,
  className,
}: {
  client: string;
  rows: Stock[];
  disabled: boolean;
  className?: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // Generate PDF only when clicked
      const blob = await pdf(
        <StockDocument client={client} stocks={rows} />,
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stock-${client}-${format(new Date(), "dd-MM-yyyy")}.pdf`;

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
      disabled={disabled || isGenerating}
      className={className}
    >
      {isGenerating ? "Generando PDF..." : "Descargar PDF"}
    </Button>
  );
}
