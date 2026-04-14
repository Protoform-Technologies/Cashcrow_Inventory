import { jsPDF } from 'jspdf'

export interface QuotePDFData {
    requestId: string
    date: string
    productName: string
    sku: string
    supplierName: string
    contactName?: string
    email?: string
    quantity: number | string
    totalAmount: number | string
    expectedDate: string
    notes: string
}

export const generateQuotePDF = (data: QuotePDFData) => {
    const doc = new jsPDF()
    const primaryColor = '#059669' // Emerald-600
    const currencySymbol = 'Rs.'

    // Header & Branding
    doc.setFillColor(primaryColor)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('REQUEST FOR QUOTE', 20, 25)
    
    doc.setFontSize(10)
    doc.text(`ID: ${data.requestId}`, 150, 25)
    doc.text(`DATE: ${new Date(data.date).toLocaleDateString()}`, 150, 32)

    // Reset for content
    doc.setTextColor(50, 50, 50)
    
    // Partner Information
    doc.setFontSize(12)
    doc.text('PROVIDER DETAILS', 20, 55)
    doc.setDrawColor(230, 230, 230)
    doc.line(20, 57, 190, 57)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(data.supplierName, 20, 65)
    doc.setFont('helvetica', 'normal')
    if (data.contactName) doc.text(`Attn: ${data.contactName}`, 20, 71)
    if (data.email) doc.text(`Email: ${data.email}`, 20, 77)

    // Quote Specifications
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('ITEM SPECIFICATIONS', 20, 95)
    doc.line(20, 97, 190, 97)
    
    doc.setFontSize(10)
    // Table Header
    doc.setFillColor(245, 245, 245)
    doc.rect(20, 102, 170, 8, 'F')
    doc.text('Description / SKU', 25, 107)
    doc.text('Qty', 110, 107)
    doc.text('Target Arrival', 140, 107)
    doc.text('Value', 170, 107)

    // Table Data
    doc.text(`${data.productName} (${data.sku})`, 25, 118)
    doc.text(`${data.quantity}`, 110, 118)
    doc.text(`${data.expectedDate}`, 140, 118)
    doc.text(`${currencySymbol}${data.totalAmount}`, 170, 118)

    // Notes Section
    if (data.notes) {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('STRATEGIC NOTES', 20, 140)
        doc.line(20, 142, 190, 142)
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const splitNotes = doc.splitTextToSize(data.notes, 170)
        doc.text(splitNotes, 20, 150)
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Generated via Cashcrow Inventory Management System. All terms subject to final validation.', 105, 280, { align: 'center' })

    // Save
    doc.save(`${data.requestId}_Report.pdf`)
}
