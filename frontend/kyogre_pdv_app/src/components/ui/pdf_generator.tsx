import {
    Page,
    Text,
    View,
    Document,
    PDFViewer,
    PDFDownloadLink,
    StyleSheet,
} from "@react-pdf/renderer";
import {  useNavigate } from "react-router-dom";

// Estilos para o PDF
export const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        color: "#262626",
        fontFamily: "Helvetica",
        fontSize: "12px",
        padding: "30px 50px",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
    },
    textBold: {
        fontFamily: "Helvetica-Bold",
    },
    spaceY: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    billTo: {
        marginBottom: 10,
    },
    table: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#f3f4f6",
        marginVertical: 20,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHeader: {
        backgroundColor: "#e5e5e5",
        fontFamily: "Helvetica-Bold",
    },
    tableCell: {
        flex: 1,
        padding: 6,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    totals: {
        display: "flex",
        alignItems: "flex-end",
    },
});

// Dados da tabela
const tableData = [
    {
        description: "Web Design Service",
        quantity: 1,
        unitPrice: 1500.0,
        total: 1500.0,
    },
    {
        description: "Hosting Setup",
        quantity: 1,
        unitPrice: 250.0,
        total: 250.0,
    },
];

export const totalData = [
    {
        label: "Subtotal",
        value: "$1,750.00",
    },
    {
        label: "Tax (10%)",
        value: "$175.00",
    },
    {
        label: "Total",
        value: "$1,925.00",
    },
];

// Componente principal
export default function PDFGeneratorPage() {
    const navigate = useNavigate();

    const InvoicePDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, styles.textBold]}>INVOICE</Text>
                        <Text>Invoice #INV-2024-001</Text>
                    </View>
                    <View style={styles.spaceY}>
                        <Text style={styles.textBold}>Company Name</Text>
                        <Text>123 Business Street</Text>
                        <Text>City, State 12345</Text>
                    </View>
                </View>

                {/* Informações do cliente */}
                <View style={styles.spaceY}>
                    <Text style={[styles.billTo, styles.textBold]}>Bill To:</Text>
                    <Text>Client Name</Text>
                    <Text>Client Address</Text>
                    <Text>City, State ZIP</Text>
                </View>

                {/* Tabela */}
                <View style={styles.table}>
                    {/* Cabeçalho da tabela */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Description</Text>
                        <Text style={styles.tableCell}>Quantity</Text>
                        <Text style={styles.tableCell}>Unit Price</Text>
                        <Text style={styles.tableCell}>Total</Text>
                    </View>
                    {/* Linhas da tabela */}
                    {tableData.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{item.description}</Text>
                            <Text style={styles.tableCell}>{item.quantity}</Text>
                            <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
                            <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totais */}
                <View style={styles.totals}>
                    <View
                        style={{
                            minWidth: "256px",
                        }}
                    >
                        {totalData.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                }}
                            >
                                <Text style={item.label === "Total" ? styles.textBold : {}}>
                                    {item.label}
                                </Text>
                                <Text style={item.label === "Total" ? styles.textBold : {}}>
                                    {item.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="max-w-2xl mx-auto my-10">
            {/* Visualizador de PDF */}
            <div className="w-full h-[500px]">
                <PDFViewer width="100%" height="100%">
                    <InvoicePDF />
                </PDFViewer>
            </div>
            {/* Botão para download */}
            <div className="mt-6 flex justify-center">
                <PDFDownloadLink document={<InvoicePDF />} fileName="invoice.pdf">
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300" onClick={
                        () => {
                            alert("Arquvo PDF gerado") 
                            navigate("/")
                        }
                    }>
                        Baixar Pedido em PDF
                    </button>
                </PDFDownloadLink>
            </div>
        </div>
    );
}