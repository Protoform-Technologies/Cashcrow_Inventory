import { jsPDF } from 'jspdf'
import { RFQDetails } from '@/types/rfq-details'
import { BUYER_DETAILS, DEFAULT_TERMS } from '@/config/rfq-config'

export interface RFQPDFData {
    requestId: string
    date: string
    supplierName: string
    contactName?: string
    email?: string
    phone?: string
    gstin?: string
    address?: string
    details: RFQDetails
    authorizedPersonName?: string
    authorizedPersonDesignation?: string
    authorizationDate?: string
}

export const generateRFQPDF = async (data: RFQPDFData) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    })

    const primaryColor = '#111827'
    const secondaryColor = '#265035'
    const mutedColor = '#6B7280'
    const borderColor = '#E5E7EB'
    const lightBg = '#F9FAFB'

    let y = 15

    // --- HEADER ---
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('PROTOFORM', 20, y + 10)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('TECHNOLOGIES PVT LTD', 20, y + 15)
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(mutedColor)
    doc.text('Where ideas take form.', 20, y + 20)
    doc.setFont('helvetica', 'normal')
    doc.text('Engineering • Hardware • Software Solutions', 20, y + 24)

    // Title Block (Right)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('REQUEST FOR QUOTATION', 190, y + 8, { align: 'right' })
    
    doc.setFontSize(9)
    doc.setTextColor(mutedColor)
    const metaX = 145
    doc.text('RFQ No:', metaX, y + 15)
    doc.text('RFQ Date:', metaX, y + 20)
    doc.text('Response Deadline:', metaX, y + 25)
    doc.text('Vertical:', metaX, y + 30)

    doc.setTextColor(primaryColor)
    doc.setFont('helvetica', 'bold')
    doc.text(data.requestId, 190, y + 15, { align: 'right' })
    doc.text(new Date(data.date).toLocaleDateString('en-IN'), 190, y + 20, { align: 'right' })
    doc.text(data.details.responseDeadline || 'N/A', 190, y + 25, { align: 'right' })
    doc.text('Protoform', 190, y + 30, { align: 'right' })

    y += 40
    doc.setDrawColor(primaryColor)
    doc.setLineWidth(0.8)
    doc.line(20, y, 190, y)
    y += 10

    // --- PARTIES SECTION ---
    const cardWidth = 82
    const cardHeight = 45

    // Issued By (Buyer)
    doc.setDrawColor(borderColor)
    doc.setLineWidth(0.2)
    doc.setFillColor(lightBg)
    doc.roundedRect(20, y, cardWidth, cardHeight, 2, 2, 'FD')
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('ISSUED BY — BUYER', 25, y + 7)
    doc.line(20, y + 10, 20 + cardWidth, y + 10)

    doc.setFontSize(10)
    doc.text(BUYER_DETAILS.companyName, 25, y + 16)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(mutedColor)
    doc.text('GSTIN', 25, y + 22)
    doc.text('Address', 25, y + 27)
    doc.text('Email', 25, y + 32)
    doc.text('Phone', 25, y + 37)
    doc.text('Website', 25, y + 42)

    doc.setTextColor(primaryColor)
    doc.text(BUYER_DETAILS.gstin, 45, y + 22)
    doc.text(BUYER_DETAILS.address, 45, y + 27, { maxWidth: 55 })
    doc.text(BUYER_DETAILS.email, 45, y + 32)
    doc.text(BUYER_DETAILS.phone, 45, y + 37)
    doc.text(BUYER_DETAILS.website, 45, y + 42)

    // Addressed To (Supplier)
    doc.setFillColor(lightBg)
    doc.roundedRect(108, y, cardWidth, cardHeight, 2, 2, 'FD')
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('ADDRESSED TO — SUPPLIER', 113, y + 7)
    doc.line(108, y + 10, 108 + cardWidth, y + 10)

    doc.setFontSize(10)
    doc.text(data.supplierName, 113, y + 16)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(mutedColor)
    doc.text('Contact', 113, y + 22)
    doc.text('GSTIN', 113, y + 27)
    doc.text('Email', 113, y + 32)
    doc.text('Phone', 113, y + 37)
    doc.text('Address', 113, y + 42)

    doc.setTextColor(primaryColor)
    doc.text(data.contactName || 'N/A', 133, y + 22)
    doc.text(data.gstin || 'N/A', 133, y + 27)
    doc.text(data.email || 'N/A', 133, y + 32)
    doc.text(data.phone || 'N/A', 133, y + 37)
    doc.text(data.address || 'N/A', 133, y + 42, { maxWidth: 55 })

    y += cardHeight + 10

    // --- RFQ SUMMARY ---
    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('RFQ SUMMARY', 25, y + 5.5)
    y += 8

    const rowH = 7
    const col1 = 20, col2 = 55, col3 = 105, col4 = 140
    
    doc.setDrawColor(borderColor)
    doc.setTextColor(primaryColor)
    doc.setFontSize(8)

    // Helper to draw table rows
    const drawRow = (yPos: number, label1: string, val1: string, label2: string, val2: string) => {
        doc.setFillColor(lightBg)
        doc.rect(col1, yPos, col2 - col1, rowH, 'F')
        doc.rect(col3, yPos, col4 - col3, rowH, 'F')
        doc.rect(col1, yPos, 170, rowH, 'D')
        doc.line(col2, yPos, col2, yPos + rowH)
        doc.line(col3, yPos, col3, yPos + rowH)
        doc.line(col4, yPos, col4, yPos + rowH)
        
        doc.setFont('helvetica', 'bold')
        doc.text(label1, col1 + 2, yPos + 4.5)
        doc.text(label2, col3 + 2, yPos + 4.5)
        
        doc.setFont('helvetica', 'normal')
        doc.text(val1, col2 + 2, yPos + 4.5, { maxWidth: col3 - col2 - 4 })
        doc.text(val2, col4 + 2, yPos + 4.5, { maxWidth: 190 - col4 - 4 })
    }

    drawRow(y, 'Project Name', data.details.documentName || 'N/A', 'RFQ Type', data.details.rfqType || 'N/A')
    y += rowH
    
    // Project Details (spanning)
    doc.setFillColor(lightBg)
    doc.rect(col1, y, col2 - col1, rowH, 'F')
    doc.rect(col1, y, 170, rowH, 'D')
    doc.line(col2, y, col2, y + rowH)
    doc.setFont('helvetica', 'bold')
    doc.text('Project Details', col1 + 2, y + 4.5)
    doc.setFont('helvetica', 'normal')
    doc.text(data.details.projectDetails || 'N/A', col2 + 2, y + 4.5, { maxWidth: 130 })
    y += rowH

    drawRow(y, 'Selected Vertical', 'Protoform', 'Priority', data.details.priority || 'N/A')
    y += rowH
    drawRow(y, 'Created By', data.details.createdBy || 'N/A', 'Department', data.details.department || 'N/A')
    y += rowH
    
    // Response Deadline (spanning)
    doc.setFillColor(lightBg)
    doc.rect(col1, y, col2 - col1, rowH, 'F')
    doc.rect(col1, y, 170, rowH, 'D')
    doc.line(col2, y, col2, y + rowH)
    doc.setFont('helvetica', 'bold')
    doc.text('Response Deadline', col1 + 2, y + 4.5)
    doc.setFont('helvetica', 'normal')
    doc.text(data.details.responseDeadline || 'N/A', col2 + 2, y + 4.5)
    y += rowH + 10

    // --- ITEM DETAILS ---
    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('ITEM DETAILS', 25, y + 5.5)
    y += 8

    // Table Header
    const headerH = 10
    doc.setFillColor(primaryColor)
    doc.rect(20, y, 170, headerH, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFontSize(7)
    const cols = [20, 32, 65, 100, 125, 145, 165, 190]
    const labels = ['SL NO.', 'ITEM NAME', 'DESCRIPTION', 'CATEGORY', 'QTY', 'UNIT', 'EXPECTED DELIVERY']
    
    labels.forEach((label, i) => {
        doc.text(label, cols[i] + 2, y + 6)
    })
    y += headerH

    // Table Row (Single item for now)
    const rowH2 = 12
    doc.setDrawColor(borderColor)
    doc.setTextColor(primaryColor)
    doc.setFont('helvetica', 'normal')
    doc.rect(20, y, 170, rowH2, 'D')
    
    doc.text('01', cols[0] + 2, y + 7)
    doc.text(data.requestId.substring(0, 8), cols[1] + 2, y + 7, { maxWidth: cols[2] - cols[1] - 4 }) // Mocking item name
    doc.text(data.details.scopeOfRequirement?.substring(0, 50) || 'N/A', cols[2] + 2, y + 7, { maxWidth: cols[3] - cols[2] - 4 })
    doc.text('Hardware', cols[3] + 2, y + 7)
    doc.text(String(data.details.commercial.totalQuoteValue || '1'), cols[4] + 2, y + 7) // Using totalQuoteValue as qty proxy for now
    doc.text('Nos', cols[5] + 2, y + 7)
    doc.text(data.details.delivery.expectedDate || 'N/A', cols[6] + 2, y + 7)
    
    y += rowH2 + 10

    // --- TECHNICAL SPECIFICATIONS ---
    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('TECHNICAL SPECIFICATIONS', 25, y + 5.5)
    y += 8

    const techFields = [
        ['Material', data.details.technicalSpecs.material],
        ['Thickness / Rating / Capacity', data.details.technicalSpecs.thickness],
        ['Dimensions', data.details.technicalSpecs.dimensions],
        ['Finish / Color / Coating', data.details.technicalSpecs.finish],
        ['Tolerance', data.details.technicalSpecs.tolerance],
        ['Required Standards / Certifications', data.details.technicalSpecs.standards],
        ['Technical Notes', data.details.technicalSpecs.notes]
    ]

    techFields.forEach(([label, value]) => {
        doc.setFillColor(lightBg)
        doc.rect(20, y, 50, rowH, 'F')
        doc.rect(20, y, 170, rowH, 'D')
        doc.line(70, y, 70, y + rowH)
        doc.setTextColor(primaryColor)
        doc.setFont('helvetica', 'bold')
        doc.text(label, 22, y + 4.5)
        doc.setFont('helvetica', 'normal')
        doc.text(value || 'N/A', 72, y + 4.5, { maxWidth: 115 })
        y += rowH
    })

    y += 10

    // --- COMMERCIAL REQUIREMENTS ---
    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('COMMERCIAL REQUIREMENTS', 25, y + 5.5)
    y += 8

    const commData = data.details.commercial || {
        unitPrice: '0',
        totalPrice: '0',
        gstPercentage: '18',
        freightCharges: '0',
        installationCharges: '0',
        paymentTerms: 'N/A',
        validity: '30 Days',
        warrantyPeriod: 'N/A',
        productionLeadTime: 'N/A'
    }

    const commRows = [
        ['Unit Price', `Rs. ${commData.unitPrice}`, 'Total Price', `Rs. ${commData.totalPrice}`],
        ['GST %', `${commData.gstPercentage}%`, 'Freight Charges', `Rs. ${commData.freightCharges}`],
        ['Installation Charges', `Rs. ${commData.installationCharges}`, 'Payment Terms', commData.paymentTerms],
        ['Quotation Validity', commData.validity, 'Warranty Period', commData.warrantyPeriod],
        ['Production Lead Time', commData.productionLeadTime, '', '']
    ]

    commRows.forEach(row => {
        drawRow(y, row[0], row[1], row[2], row[3])
        y += rowH
    })

    y += 10

    // Check for page break
    if (y > 220) {
        doc.addPage()
        y = 20
    }

    // --- COST BREAKDOWN REQUIRED (Phase 3) ---
    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('COST BREAKDOWN REQUIRED', 25, y + 5.5)
    y += 8

    const breakdownRows = [
        ['Material Cost', `Rs. ${commData.materialCost || '0'}`, 'Labour / Fabrication', `Rs. ${commData.labourCost || '0'}`],
        ['Assembly / Testing', `Rs. ${commData.assemblyTestingCost || '0'}`, 'Packaging Cost', `Rs. ${commData.packagingCost || '0'}`],
        ['Logistics Cost', `Rs. ${commData.logisticsCost || '0'}`, 'Vendor Margin', `Rs. ${commData.vendorMargin || '0'}`],
        ['Other Charges', `Rs. ${commData.otherCharges || '0'}`, 'Total Quote Value', `Rs. ${commData.totalQuoteValue || '0'}`]
    ]

    breakdownRows.forEach((row, idx) => {
        if (idx === 3) {
            // Highlight Total Quote Value
            doc.setFillColor(lightBg)
            doc.rect(col1, y, col2 - col1, rowH, 'F')
            doc.setFillColor(primaryColor)
            doc.rect(col3, y, col4 - col3, rowH, 'F')
            doc.rect(col1, y, 170, rowH, 'D')
            doc.line(col2, y, col2, y + rowH)
            doc.line(col3, y, col3, y + rowH)
            doc.line(col4, y, col4, y + rowH)
            
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(primaryColor)
            doc.text(row[0], col1 + 2, y + 4.5)
            doc.setTextColor('#FFFFFF')
            doc.text(row[2], col3 + 2, y + 4.5)
            
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(primaryColor)
            doc.text(row[1], col2 + 2, y + 4.5)
            doc.setFont('helvetica', 'bold')
            doc.text(row[3], col4 + 2, y + 4.5)
        } else {
            drawRow(y, row[0], row[1], row[2], row[3])
        }
        y += rowH
    })

    y += 10

    // --- DELIVERY & LOGISTICS ---
    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('DELIVERY & LOGISTICS', 25, y + 5.5)
    y += 8

    const del = data.details.delivery
    drawRow(y, 'Delivery Location', del.location || 'N/A', '', '')
    y += rowH
    drawRow(y, 'Required Delivery Date', del.expectedDate || 'N/A', 'Vendor Proposed Date', del.vendorProposedDate || 'N/A')
    y += rowH
    drawRow(y, 'Packaging Requirements', del.packaging || 'N/A', 'Transport Responsibility', del.transport || 'N/A')
    y += rowH + 10

    // --- QUALITY, WARRANTY & COMPLIANCE ---
    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('QUALITY, WARRANTY & COMPLIANCE', 25, y + 5.5)
    y += 8

    const q = data.details.quality
    const qualityFields = [
        ['Quality Assurance Process', q.assurance],
        ['Inspection Method', q.inspection],
        ['Warranty Terms', q.warranty],
        ['Replacement / Repair Terms', q.replacement],
        ['Compliance Docs Required', q.complianceDocuments]
    ]

    qualityFields.forEach(([label, value]) => {
        doc.setFillColor(lightBg)
        doc.rect(20, y, 50, rowH, 'F')
        doc.rect(20, y, 170, rowH, 'D')
        doc.line(70, y, 70, y + rowH)
        doc.setTextColor(primaryColor)
        doc.setFont('helvetica', 'bold')
        doc.text(label, 22, y + 4.5)
        doc.setFont('helvetica', 'normal')
        doc.text(value || 'N/A', 72, y + 4.5, { maxWidth: 115 })
        y += rowH
    })

    // --- ATTACHMENTS / REFERENCES ---
    if (y > 230) {
        doc.addPage()
        y = 20
    }

    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('ATTACHMENTS / REFERENCES', 25, y + 5.5)
    y += 8

    // Attachments Table Header
    doc.setFillColor(primaryColor)
    doc.rect(20, y, 170, 8, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFontSize(7)
    const attCols = [20, 35, 80, 130, 190]
    const attLabels = ['SL. NO.', 'DOCUMENT NAME', 'DOCUMENT TYPE', 'REMARKS']
    
    attLabels.forEach((label, i) => {
        doc.text(label, attCols[i] + 2, y + 5.5)
    })
    y += 8

    doc.setTextColor(primaryColor)
    doc.setFont('helvetica', 'normal')
    
    if (data.details.attachments && data.details.attachments.length > 0) {
        data.details.attachments.forEach((att, idx) => {
            doc.rect(20, y, 170, rowH, 'D')
            doc.line(attCols[1], y, attCols[1], y + rowH)
            doc.line(attCols[2], y, attCols[2], y + rowH)
            doc.line(attCols[3], y, attCols[3], y + rowH)
            
            doc.text(String(idx + 1).padStart(2, '0'), attCols[0] + 2, y + 4.5)
            doc.text(att.name || 'N/A', attCols[1] + 2, y + 4.5, { maxWidth: attCols[2] - attCols[1] - 4 })
            doc.text(att.type || 'N/A', attCols[2] + 2, y + 4.5)
            doc.text(att.remarks || 'N/A', attCols[3] + 2, y + 4.5, { maxWidth: 55 })
            y += rowH
        })
    } else {
        doc.rect(20, y, 170, rowH, 'D')
        doc.text('No attachments provided.', 25, y + 4.5)
        y += rowH
    }

    // Reference Row
    doc.setFillColor(lightBg)
    doc.rect(20, y, attCols[1] - attCols[0], rowH, 'F')
    doc.rect(20, y, 170, rowH, 'D')
    doc.line(attCols[1], y, attCols[1], y + rowH)
    doc.setFont('helvetica', 'bold')
    doc.text('Ref', 22, y + 4.5)
    doc.setFont('helvetica', 'normal')
    doc.text('Reference Links / Notes', attCols[1] + 2, y + 4.5)
    doc.text(data.details.reference || 'N/A', attCols[2] + 2, y + 4.5, { maxWidth: 115 })
    y += rowH + 10

    // --- TERMS & CONDITIONS ---
    if (y > 230) {
        doc.addPage()
        y = 20
    }

    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('TERMS & CONDITIONS', 25, y + 5.5)
    y += 8

    doc.setDrawColor(borderColor)
    doc.rect(20, y, 170, (DEFAULT_TERMS.length * 5) + 5, 'D')
    doc.setTextColor(primaryColor)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    
    let termsY = y + 5
    DEFAULT_TERMS.forEach((term, idx) => {
        doc.text(`${idx + 1}. ${term}`, 25, termsY, { maxWidth: 160 })
        termsY += 5
    })
    y += (DEFAULT_TERMS.length * 5) + 15

    // --- DECLARATION ---
    doc.setFillColor(primaryColor)
    doc.roundedRect(20, y, 170, 8, 1, 1, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.text('DECLARATION', 25, y + 5.5)
    y += 8

    doc.setDrawColor(borderColor)
    doc.rect(20, y, 170, 15, 'D')
    doc.setTextColor(primaryColor)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.text('"We request you to submit your quotation as per the above specifications and commercial requirements. All details provided in the quotation must be accurate and complete. Any deviations, assumptions, or exclusions must be clearly stated."', 25, y + 6, { maxWidth: 160 })
    y += 25

    // --- AUTHORIZATION & VENDOR ACKNOWLEDGEMENT ---
    const authBoxW = 82
    const authBoxH = 45

    // Buyer Auth
    doc.setDrawColor(borderColor)
    doc.rect(20, y, authBoxW, authBoxH, 'D')
    doc.setFillColor(primaryColor)
    doc.rect(20, y, authBoxW, 7, 'F')
    doc.setTextColor('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(`FOR ${BUYER_DETAILS.companyName.toUpperCase()}`, 25, y + 4.5)
    
    doc.setTextColor(primaryColor)
    doc.setFontSize(7)
    doc.text('AUTHORIZED SIGNATORY', 25, y + 11)
    
    doc.line(25, y + 30, 75, y + 30) // Signature line
    
    doc.text('Name:', 25, y + 35)
    doc.text(data.authorizedPersonName || 'N/A', 45, y + 35)
    doc.text('Designation:', 25, y + 39)
    doc.text(data.authorizedPersonDesignation || 'N/A', 45, y + 39)
    doc.text('Date:', 25, y + 43)
    doc.text(data.authorizationDate || new Date().toLocaleDateString('en-IN'), 45, y + 43)

    // Vendor Auth
    doc.setDrawColor(borderColor)
    doc.rect(108, y, authBoxW, authBoxH, 'D')
    doc.setFillColor(primaryColor)
    doc.rect(108, y, authBoxW, 7, 'F')
    doc.setTextColor('#FFFFFF')
    doc.text('VENDOR ACKNOWLEDGEMENT', 113, y + 4.5)
    
    doc.setTextColor(primaryColor)
    doc.text('AUTHORIZED SIGNATORY', 113, y + 11)
    
    doc.line(113, y + 30, 163, y + 30) // Signature line
    
    doc.text('Name:', 113, y + 35)
    doc.text('Designation:', 113, y + 39)
    doc.text('Date:', 113, y + 43)
    doc.text('Company Seal:', 113, y + 47)

    y += authBoxH + 15

    // Footer
    doc.setDrawColor(primaryColor)
    doc.setLineWidth(0.5)
    doc.line(20, 275, 190, 275)
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text(BUYER_DETAILS.companyName, 105, 280, { align: 'center' })
    
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    const footerContact = `Website: ${BUYER_DETAILS.website} | Email: ${BUYER_DETAILS.email} | Phone: ${BUYER_DETAILS.phone}`
    doc.text(footerContact, 105, 284, { align: 'center' })
    
    doc.setFontSize(6)
    doc.setTextColor(mutedColor)
    doc.setFont('helvetica', 'italic')
    doc.text('This document is confidential and issued for the sole purpose of inviting a quotation. Unauthorized use, distribution, or reproduction is prohibited.', 105, 288, { align: 'center' })

    doc.save(`${data.requestId}_RFQ.pdf`)
}
