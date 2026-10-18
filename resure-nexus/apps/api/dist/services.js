"use strict";
/**
 * Application Services Singleton Container
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = exports.ServiceContainer = void 0;
const ledger_client_1 = require("@resure-nexus/ledger-client");
const document_store_1 = require("@resure-nexus/document-store");
const projections_1 = require("@resure-nexus/projections");
class ServiceContainer {
    ledgerClient;
    documentStore;
    projectionDb;
    repository;
    reconciler;
    constructor() {
        this.ledgerClient = new ledger_client_1.CantonLedgerClient();
        this.documentStore = new document_store_1.SecureDocumentStore();
        this.projectionDb = new projections_1.ProjectionDatabase();
        this.repository = new projections_1.ProjectionRepository(this.projectionDb);
        this.reconciler = new projections_1.ProjectionReconciler(this.ledgerClient, this.repository);
    }
}
exports.ServiceContainer = ServiceContainer;
exports.services = new ServiceContainer();
//# sourceMappingURL=services.js.map