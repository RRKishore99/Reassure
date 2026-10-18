/**
 * Application Services Singleton Container
 */

import { CantonLedgerClient } from '@resure-nexus/ledger-client';
import { SecureDocumentStore } from '@resure-nexus/document-store';
import { ProjectionDatabase, ProjectionRepository, ProjectionReconciler } from '@resure-nexus/projections';

export class ServiceContainer {
  public readonly ledgerClient: CantonLedgerClient;
  public readonly documentStore: SecureDocumentStore;
  public readonly projectionDb: ProjectionDatabase;
  public readonly repository: ProjectionRepository;
  public readonly reconciler: ProjectionReconciler;

  constructor() {
    this.ledgerClient = new CantonLedgerClient();
    this.documentStore = new SecureDocumentStore();
    this.projectionDb = new ProjectionDatabase();
    this.repository = new ProjectionRepository(this.projectionDb);
    this.reconciler = new ProjectionReconciler(this.ledgerClient, this.repository);
  }
}

export const services = new ServiceContainer();
