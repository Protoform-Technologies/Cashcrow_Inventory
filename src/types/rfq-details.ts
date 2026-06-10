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
    rfqType: string
    
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
    commercial: {
        unitPrice: string | number
        totalPrice: string | number
        gstPercentage: string | number
        freightCharges: string | number
        installationCharges: string | number
        paymentTerms: string
        validity: string
        warrantyPeriod: string
        productionLeadTime: string
        // Phase 3 Cost Breakdown
        materialCost: string | number
        labourCost: string | number
        assemblyTestingCost: string | number
        packagingCost: string | number
        logisticsCost: string | number
        vendorMargin: string | number
        otherCharges: string | number
        totalQuoteValue: string | number
    }
    
    // Delivery
    delivery: {
        location: string
        packaging: string
        transport: string
        expectedDate: string
        vendorProposedDate: string
    }
    
    // Quality
    quality: {
        assurance: string
        inspection: string
        warranty: string
        replacement: string
        complianceDocuments: string
    }
    
    attachments: RFQAttachment[]
    reference: string
    // Authorization (Phase 4)
    authorizedPersonName?: string
    authorizedPersonDesignation?: string
    authorizationDate?: string
}
