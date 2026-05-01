export interface CostBreakdownItem {
    label: string
    value: string | number
}

export interface RFQAttachment {
    name: string
    type: string
    remarks: string
}

export interface RFQDetails {
    vertical: 'PF' | 'CC'
    documentName: string
    scopeOfRequirement: string
    projectDetails: string
    createdBy: string
    department: string
    priority: 'Low' | 'Medium' | 'High' | 'Critical'
    responseDeadline: string
    
    // Technical Specs
    technicalSpecs: {
        material: string
        thickness: string
        dimensions: string
        finish: string
        tolerance: string
        standards: string
        notes: string
    }
    
    // Commercial / Cost
    costBreakdown: CostBreakdownItem[]
    totalQuoteValue: string | number
    gstPercentage: string | number
    paymentTerms: string
    validity: string
    
    // Delivery
    delivery: {
        location: string
        packaging: string
        transport: string
        expectedDate: string
    }
    
    // Quality
    quality: {
        assurance: string
        inspection: string
        warranty: string
        replacement: string
    }
    
    attachments: RFQAttachment[]
    reference: string
}
