/**
 * ReSure Nexus — Zod Validation Schemas
 * Strict input validation for all API endpoints.
 */
import { z } from 'zod';
export declare const CurrencySchema: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
export declare const MonetaryAmountSchema: z.ZodObject<{
    amount: z.ZodString;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
}, "strip", z.ZodTypeAny, {
    currency: "USD" | "EUR" | "GBP" | "CHF";
    amount: string;
}, {
    currency: "USD" | "EUR" | "GBP" | "CHF";
    amount: string;
}>;
export declare const EvidenceRefSchema: z.ZodObject<{
    documentId: z.ZodString;
    documentType: z.ZodEnum<["PolicySchedule", "ClaimNotification", "AdjusterReport", "TreatySlip", "ProofOfLoss", "SalvageSubrogationReceipt", "PaymentReceipt"]>;
    contentHash: z.ZodString;
    version: z.ZodNumber;
    uploadedAt: z.ZodString;
    uploadedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    documentId: string;
    documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
    contentHash: string;
    version: number;
    uploadedAt: string;
    uploadedBy: string;
}, {
    documentId: string;
    documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
    contentHash: string;
    version: number;
    uploadedAt: string;
    uploadedBy: string;
}>;
export declare const QuotaShareTermsSchema: z.ZodObject<{
    cededPercentage: z.ZodString;
    contractualCap: z.ZodOptional<z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    cededPercentage: string;
    contractualCap?: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    } | undefined;
}, {
    cededPercentage: string;
    contractualCap?: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    } | undefined;
}>;
export declare const ExcessOfLossTermsSchema: z.ZodObject<{
    attachmentPoint: z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>;
    layerLimit: z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>;
    layerNumber: z.ZodNumber;
    aggregateLimit: z.ZodOptional<z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    attachmentPoint: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    layerLimit: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    layerNumber: number;
    aggregateLimit?: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    } | undefined;
}, {
    attachmentPoint: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    layerLimit: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    layerNumber: number;
    aggregateLimit?: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    } | undefined;
}>;
export declare const TreatyParticipationInputSchema: z.ZodObject<{
    reinsurer: z.ZodString;
    linePercentage: z.ZodString;
    participationRef: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reinsurer: string;
    linePercentage: string;
    participationRef: string;
}, {
    reinsurer: string;
    linePercentage: string;
    participationRef: string;
}>;
export declare const CreateTreatySchema: z.ZodObject<{
    treatyRef: z.ZodString;
    treatyType: z.ZodEnum<["QuotaShare", "ExcessOfLoss"]>;
    inceptionDate: z.ZodString;
    expirationDate: z.ZodString;
    coveredBusiness: z.ZodString;
    lossBasis: z.ZodEnum<["RiskAttaching", "LossOccurring", "ClaimsMade"]>;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    quotaShareTerms: z.ZodOptional<z.ZodObject<{
        cededPercentage: z.ZodString;
        contractualCap: z.ZodOptional<z.ZodObject<{
            amount: z.ZodString;
            currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
        }, "strip", z.ZodTypeAny, {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        }, {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        cededPercentage: string;
        contractualCap?: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        } | undefined;
    }, {
        cededPercentage: string;
        contractualCap?: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        } | undefined;
    }>>;
    excessOfLossTerms: z.ZodOptional<z.ZodObject<{
        attachmentPoint: z.ZodObject<{
            amount: z.ZodString;
            currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
        }, "strip", z.ZodTypeAny, {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        }, {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        }>;
        layerLimit: z.ZodObject<{
            amount: z.ZodString;
            currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
        }, "strip", z.ZodTypeAny, {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        }, {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        }>;
        layerNumber: z.ZodNumber;
        aggregateLimit: z.ZodOptional<z.ZodObject<{
            amount: z.ZodString;
            currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
        }, "strip", z.ZodTypeAny, {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        }, {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        attachmentPoint: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        };
        layerLimit: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        };
        layerNumber: number;
        aggregateLimit?: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        } | undefined;
    }, {
        attachmentPoint: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        };
        layerLimit: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        };
        layerNumber: number;
        aggregateLimit?: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        } | undefined;
    }>>;
    participatingReinsurers: z.ZodArray<z.ZodObject<{
        reinsurer: z.ZodString;
        linePercentage: z.ZodString;
        participationRef: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reinsurer: string;
        linePercentage: string;
        participationRef: string;
    }, {
        reinsurer: string;
        linePercentage: string;
        participationRef: string;
    }>, "many">;
    evidenceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        documentId: z.ZodString;
        documentType: z.ZodEnum<["PolicySchedule", "ClaimNotification", "AdjusterReport", "TreatySlip", "ProofOfLoss", "SalvageSubrogationReceipt", "PaymentReceipt"]>;
        contentHash: z.ZodString;
        version: z.ZodNumber;
        uploadedAt: z.ZodString;
        uploadedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    currency: "USD" | "EUR" | "GBP" | "CHF";
    treatyRef: string;
    treatyType: "QuotaShare" | "ExcessOfLoss";
    inceptionDate: string;
    expirationDate: string;
    coveredBusiness: string;
    lossBasis: "RiskAttaching" | "LossOccurring" | "ClaimsMade";
    participatingReinsurers: {
        reinsurer: string;
        linePercentage: string;
        participationRef: string;
    }[];
    evidenceRefs: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[];
    quotaShareTerms?: {
        cededPercentage: string;
        contractualCap?: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        } | undefined;
    } | undefined;
    excessOfLossTerms?: {
        attachmentPoint: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        };
        layerLimit: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        };
        layerNumber: number;
        aggregateLimit?: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        } | undefined;
    } | undefined;
}, {
    currency: "USD" | "EUR" | "GBP" | "CHF";
    treatyRef: string;
    treatyType: "QuotaShare" | "ExcessOfLoss";
    inceptionDate: string;
    expirationDate: string;
    coveredBusiness: string;
    lossBasis: "RiskAttaching" | "LossOccurring" | "ClaimsMade";
    participatingReinsurers: {
        reinsurer: string;
        linePercentage: string;
        participationRef: string;
    }[];
    quotaShareTerms?: {
        cededPercentage: string;
        contractualCap?: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        } | undefined;
    } | undefined;
    excessOfLossTerms?: {
        attachmentPoint: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        };
        layerLimit: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        };
        layerNumber: number;
        aggregateLimit?: {
            currency: "USD" | "EUR" | "GBP" | "CHF";
            amount: string;
        } | undefined;
    } | undefined;
    evidenceRefs?: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[] | undefined;
}>;
export declare const CreateClaimSchema: z.ZodObject<{
    claimRef: z.ZodString;
    policyRef: z.ZodString;
    dateOfLoss: z.ZodString;
    occurrenceRef: z.ZodOptional<z.ZodString>;
    grossLoss: z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>;
    applicableTreaties: z.ZodArray<z.ZodString, "many">;
    lossDescription: z.ZodString;
    claimantOpaqueId: z.ZodString;
    evidenceRefs: z.ZodArray<z.ZodObject<{
        documentId: z.ZodString;
        documentType: z.ZodEnum<["PolicySchedule", "ClaimNotification", "AdjusterReport", "TreatySlip", "ProofOfLoss", "SalvageSubrogationReceipt", "PaymentReceipt"]>;
        contentHash: z.ZodString;
        version: z.ZodNumber;
        uploadedAt: z.ZodString;
        uploadedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    evidenceRefs: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[];
    claimRef: string;
    policyRef: string;
    dateOfLoss: string;
    grossLoss: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    applicableTreaties: string[];
    lossDescription: string;
    claimantOpaqueId: string;
    occurrenceRef?: string | undefined;
}, {
    evidenceRefs: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[];
    claimRef: string;
    policyRef: string;
    dateOfLoss: string;
    grossLoss: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    applicableTreaties: string[];
    lossDescription: string;
    claimantOpaqueId: string;
    occurrenceRef?: string | undefined;
}>;
export declare const CreateOccurrenceSchema: z.ZodObject<{
    occurrenceRef: z.ZodString;
    title: z.ZodString;
    commencementDate: z.ZodString;
    expirationDate: z.ZodString;
    initialClaimRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    notes: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    expirationDate: string;
    occurrenceRef: string;
    title: string;
    commencementDate: string;
    initialClaimRefs: string[];
    notes: string;
}, {
    expirationDate: string;
    occurrenceRef: string;
    title: string;
    commencementDate: string;
    initialClaimRefs?: string[] | undefined;
    notes?: string | undefined;
}>;
export declare const SubmitAssessmentSchema: z.ZodObject<{
    assessmentRef: z.ZodString;
    claimRef: z.ZodString;
    assessedLoss: z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>;
    deductibleApplied: z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>;
    eligibleLoss: z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>;
    methodology: z.ZodString;
    notes: z.ZodDefault<z.ZodString>;
    evidenceRefs: z.ZodArray<z.ZodObject<{
        documentId: z.ZodString;
        documentType: z.ZodEnum<["PolicySchedule", "ClaimNotification", "AdjusterReport", "TreatySlip", "ProofOfLoss", "SalvageSubrogationReceipt", "PaymentReceipt"]>;
        contentHash: z.ZodString;
        version: z.ZodNumber;
        uploadedAt: z.ZodString;
        uploadedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    evidenceRefs: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[];
    claimRef: string;
    notes: string;
    assessmentRef: string;
    assessedLoss: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    deductibleApplied: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    eligibleLoss: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    methodology: string;
}, {
    evidenceRefs: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[];
    claimRef: string;
    assessmentRef: string;
    assessedLoss: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    deductibleApplied: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    eligibleLoss: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    methodology: string;
    notes?: string | undefined;
}>;
export declare const ProposeAllocationSchema: z.ZodObject<{
    cycleRef: z.ZodString;
    treatyRef: z.ZodString;
    treatyVersion: z.ZodNumber;
    claimRefs: z.ZodArray<z.ZodString, "many">;
    occurrenceRef: z.ZodOptional<z.ZodString>;
    calculationMethodology: z.ZodString;
}, "strip", z.ZodTypeAny, {
    treatyRef: string;
    cycleRef: string;
    treatyVersion: number;
    claimRefs: string[];
    calculationMethodology: string;
    occurrenceRef?: string | undefined;
}, {
    treatyRef: string;
    cycleRef: string;
    treatyVersion: number;
    claimRefs: string[];
    calculationMethodology: string;
    occurrenceRef?: string | undefined;
}>;
export declare const ReinsurerDecisionSchema: z.ZodObject<{
    decisionRef: z.ZodString;
    allocationRef: z.ZodString;
    decisionType: z.ZodEnum<["Accept", "Dispute", "RequestInformation"]>;
    reason: z.ZodString;
    evidenceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        documentId: z.ZodString;
        documentType: z.ZodEnum<["PolicySchedule", "ClaimNotification", "AdjusterReport", "TreatySlip", "ProofOfLoss", "SalvageSubrogationReceipt", "PaymentReceipt"]>;
        contentHash: z.ZodString;
        version: z.ZodNumber;
        uploadedAt: z.ZodString;
        uploadedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    evidenceRefs: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[];
    decisionRef: string;
    allocationRef: string;
    decisionType: "Accept" | "Dispute" | "RequestInformation";
    reason: string;
}, {
    decisionRef: string;
    allocationRef: string;
    decisionType: "Accept" | "Dispute" | "RequestInformation";
    reason: string;
    evidenceRefs?: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[] | undefined;
}>;
export declare const ResolveDisputeSchema: z.ZodObject<{
    disputeRef: z.ZodString;
    resolutionSummary: z.ZodString;
    adjustedAmount: z.ZodOptional<z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    disputeRef: string;
    resolutionSummary: string;
    adjustedAmount?: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    } | undefined;
}, {
    disputeRef: string;
    resolutionSummary: string;
    adjustedAmount?: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    } | undefined;
}>;
export declare const RecoveryAdjustmentSchema: z.ZodObject<{
    adjustmentRef: z.ZodString;
    originalCycleRef: z.ZodString;
    claimRef: z.ZodString;
    adjustmentType: z.ZodEnum<["Salvage", "Subrogation", "RevisedLoss", "ThirdPartyRecovery"]>;
    adjustmentAmount: z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>;
    effectiveDate: z.ZodString;
    evidenceRefs: z.ZodArray<z.ZodObject<{
        documentId: z.ZodString;
        documentType: z.ZodEnum<["PolicySchedule", "ClaimNotification", "AdjusterReport", "TreatySlip", "ProofOfLoss", "SalvageSubrogationReceipt", "PaymentReceipt"]>;
        contentHash: z.ZodString;
        version: z.ZodNumber;
        uploadedAt: z.ZodString;
        uploadedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    evidenceRefs: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[];
    claimRef: string;
    adjustmentRef: string;
    originalCycleRef: string;
    adjustmentType: "Salvage" | "Subrogation" | "RevisedLoss" | "ThirdPartyRecovery";
    adjustmentAmount: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    effectiveDate: string;
}, {
    evidenceRefs: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }[];
    claimRef: string;
    adjustmentRef: string;
    originalCycleRef: string;
    adjustmentType: "Salvage" | "Subrogation" | "RevisedLoss" | "ThirdPartyRecovery";
    adjustmentAmount: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    effectiveDate: string;
}>;
export declare const SettlementConfirmationSchema: z.ZodObject<{
    reconciliationRef: z.ZodString;
    settlementRef: z.ZodString;
    confirmedAmount: z.ZodObject<{
        amount: z.ZodString;
        currency: z.ZodEnum<["USD", "EUR", "GBP", "CHF"]>;
    }, "strip", z.ZodTypeAny, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }, {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    }>;
    reconciliationSource: z.ZodString;
    paymentEvidence: z.ZodObject<{
        documentId: z.ZodString;
        documentType: z.ZodEnum<["PolicySchedule", "ClaimNotification", "AdjusterReport", "TreatySlip", "ProofOfLoss", "SalvageSubrogationReceipt", "PaymentReceipt"]>;
        contentHash: z.ZodString;
        version: z.ZodNumber;
        uploadedAt: z.ZodString;
        uploadedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }, {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    }>;
}, "strip", z.ZodTypeAny, {
    reconciliationRef: string;
    settlementRef: string;
    confirmedAmount: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    reconciliationSource: string;
    paymentEvidence: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    };
}, {
    reconciliationRef: string;
    settlementRef: string;
    confirmedAmount: {
        currency: "USD" | "EUR" | "GBP" | "CHF";
        amount: string;
    };
    reconciliationSource: string;
    paymentEvidence: {
        documentId: string;
        documentType: "PolicySchedule" | "ClaimNotification" | "AdjusterReport" | "TreatySlip" | "ProofOfLoss" | "SalvageSubrogationReceipt" | "PaymentReceipt";
        contentHash: string;
        version: number;
        uploadedAt: string;
        uploadedBy: string;
    };
}>;
//# sourceMappingURL=schemas.d.ts.map