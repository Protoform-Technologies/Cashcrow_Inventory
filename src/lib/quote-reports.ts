import { jsPDF } from 'jspdf'
import { getRFQTemplate } from '@/actions/quotes'
import { RFQDetails } from '@/types/rfq-details'
import { BUYER_DETAILS } from '@/config/rfq-config'

export interface QuotePDFData {
    requestId: string
    date: string
    productName: string
    sku: string
    supplierName: string
    contactName?: string
    email?: string
    phone?: string
    gstin?: string
    address?: string
    quantity: number | string
    unit: string
    category: string
    totalAmount: number | string
    expectedDate: string
    notes: string
    details: RFQDetails
}

export const generateQuotePDF = async (data: QuotePDFData) => {
    try {
        // 1. Fetch the correct template
        const htmlTemplate = await getRFQTemplate(data.details.vertical)
        
        // 2. Prepare Template Data
        const templateData: Record<string, string> = {
            rfqNumber: data.requestId,
            rfqDate: new Date(data.date).toLocaleDateString('en-IN'),
            responseDeadline: data.details.responseDeadline || 'N/A',
            selectedVertical: data.details.vertical === 'PF' ? 'Protoform' : 'Cashcrow',
            
            // Buyer Details (Fixed)
            companyGstin: BUYER_DETAILS.gstin,
            companyAddress: BUYER_DETAILS.address,
            companyEmail: BUYER_DETAILS.email,
            companyPhone: BUYER_DETAILS.phone,
            companyWebsite: BUYER_DETAILS.website,
            
            // Supplier Details
            supplierName: data.supplierName,
            supplierContactPerson: data.contactName || 'N/A',
            supplierGstin: data.gstin || 'N/A',
            supplierEmail: data.email || 'N/A',
            supplierPhone: data.phone || 'N/A',
            supplierAddress: data.address || 'N/A',
            
            // Summary
            projectName: data.details.documentName || 'N/A',
            projectDetails: data.details.projectDetails || 'N/A',
            rfqType: 'Standard Procurement',
            priority: data.details.priority,
            createdBy: data.details.createdBy || 'Authorized Agent',
            department: data.details.department,
            
            // Scope
            scopeOfRequirement: data.details.scopeOfRequirement || 'N/A',
            
            // Technical Specs
            material: data.details.technicalSpecs.material || 'N/A',
            thicknessOrRating: data.details.technicalSpecs.thickness || 'N/A',
            dimensions: data.details.technicalSpecs.dimensions || 'N/A',
            finish: data.details.technicalSpecs.finish || 'N/A',
            tolerance: data.details.technicalSpecs.tolerance || 'N/A',
            requiredCertifications: data.details.technicalSpecs.standards || 'N/A',
            technicalNotes: data.details.technicalSpecs.notes || 'N/A',
            
            // Commercial
            unitPrice: 'TBD',
            totalPrice: data.totalAmount.toString(),
            gstPercentage: data.details.gstPercentage.toString(),
            freightCharges: 'Extra as applicable',
            installationCharges: 'Extra as applicable',
            paymentTerms: data.details.paymentTerms || 'As per policy',
            quoteValidity: data.details.validity || '30 Days',
            warrantyPeriod: data.details.quality.warranty || '1 Year',
            productionLeadTime: 'TBD',
            
            // Cost Breakdown
            materialCost: 'Refer Annexure',
            labourCost: 'N/A',
            assemblyTestingCost: 'N/A',
            packagingCost: 'N/A',
            logisticsCost: 'N/A',
            vendorMargin: 'N/A',
            otherCharges: 'N/A',
            totalQuoteValue: data.totalAmount.toString(),
            
            // Delivery
            deliveryLocation: data.details.delivery.location,
            requiredDeliveryDate: data.expectedDate,
            vendorProposedDeliveryDate: 'TBD',
            packagingRequirements: data.details.delivery.packaging || 'Standard',
            transportResponsibility: data.details.delivery.transport || 'Vendor',
            
            // Quality
            qualityAssuranceProcess: data.details.quality.assurance || 'Standard',
            inspectionMethod: data.details.quality.inspection || 'Visual',
            warrantyTerms: data.details.quality.warranty || 'Standard',
            replacementTerms: data.details.quality.replacement || 'Within 7 days',
            complianceDocuments: 'Required',
            
            // Reference
            referenceLink: data.details.reference || 'N/A',

            // Authorization
            authorizedPersonName: data.details.createdBy || 'Procurement Head',
            authorizedPersonDesignation: 'Admin',
            authorizationDate: new Date().toLocaleDateString('en-IN')
        }

        // 3. Simple Placeholder Replacement
        let finalHtml = htmlTemplate
        Object.entries(templateData).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            const safeValue = (value === null || value === undefined) ? 'N/A' : String(value)
            finalHtml = finalHtml.replace(regex, safeValue)
        })

        // Handle the items loop
        const itemHtml = `
            <tr>
                <td>1</td>
                <td>${data.productName}</td>
                <td>${data.notes || 'N/A'} <br/><small>SKU: ${data.sku}</small></td>
                <td>${data.category}</td>
                <td>${data.quantity}</td>
                <td>${data.unit}</td>
                <td>${data.expectedDate}</td>
            </tr>
        `
        finalHtml = finalHtml.replace(/{{#items}}[\s\S]*?{{\/items}}/, itemHtml)
        
        // Handle attachments loop
        finalHtml = finalHtml.replace(/{{#attachments}}[\s\S]*?{{\/attachments}}/, '<tr><td colspan="4">Refer to reference link below</td></tr>')

        // 4. Render to PDF using a more robust method
        // We create a hidden iframe to render the full HTML correctly
        const iframe = document.createElement('iframe')
        iframe.style.position = 'fixed'
        iframe.style.top = '0'
        iframe.style.left = '0'
        iframe.style.width = '210mm'
        iframe.style.height = '1000mm' // Tall enough to avoid clipping
        iframe.style.visibility = 'visible'
        iframe.style.zIndex = '-1000'
        document.body.appendChild(iframe)

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (!iframeDoc) throw new Error('Could not create iframe document')

        iframeDoc.open()
        iframeDoc.write(finalHtml)
        iframeDoc.close()

        // Wait for images and styles to load
        await new Promise((resolve) => {
            if (iframeDoc.readyState === 'complete') {
                setTimeout(() => resolve(true), 500) // Small extra delay for good measure
            } else {
                iframe.onload = () => setTimeout(() => resolve(true), 500)
            }
            // Fallback timeout
            setTimeout(resolve, 3000)
        })

        // Inject logo if Cashcrow
        if (data.details.vertical === 'CC') {
            const logoImg = iframeDoc.querySelector('img[alt="Cashcrow logo"]') as HTMLImageElement
            if (logoImg) logoImg.src = '/Cashcrow_Logo_Branding.png'
        }

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true
        })

        const content = iframeDoc.body

        await doc.html(content, {
            x: 0,
            y: 0,
            width: 210,
            windowWidth: 794,
            autoPaging: 'text',
            html2canvas: {
                scale: 0.28, // 794px / 210mm ≈ 3.78, 1/3.78 ≈ 0.26. 0.28 is a safe scale for A4
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: true
            },
            callback: function (doc) {
                doc.save(`${data.requestId}_RFQ.pdf`)
                document.body.removeChild(iframe)
            }
        })

    } catch (error) {
        console.error('PDF Generation Error:', error)
        throw error
    }
}
