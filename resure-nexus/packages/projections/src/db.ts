/**
 * ReSure Nexus — Projection Database & Schema Management
 * SQLite storage engine for query projections, idempotency, and audit trails.
 */

import Database from 'better-sqlite3';
import * as path from 'node:path';
import * as fs from 'node:fs';

export class ProjectionDatabase {
  private db: Database.Database;

  constructor(dbPath: string = './.data/resure-projections.db') {
    const dir = path.dirname(path.resolve(dbPath));
    fs.mkdirSync(dir, { recursive: true });
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initSchema();
  }

  getRawDb(): Database.Database {
    return this.db;
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS treaties (
        treaty_ref TEXT NOT NULL,
        version INTEGER NOT NULL,
        cedant TEXT NOT NULL,
        broker TEXT NOT NULL,
        treaty_type TEXT NOT NULL,
        inception_date TEXT NOT NULL,
        expiration_date TEXT NOT NULL,
        covered_business TEXT NOT NULL,
        loss_basis TEXT NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        raw_json TEXT NOT NULL,
        contract_id TEXT,
        updated_at TEXT NOT NULL,
        PRIMARY KEY(treaty_ref, version)
      );

      CREATE TABLE IF NOT EXISTS treaty_participations (
        treaty_ref TEXT NOT NULL,
        version INTEGER NOT NULL,
        reinsurer TEXT NOT NULL,
        line_percentage TEXT NOT NULL,
        status TEXT NOT NULL,
        contract_id TEXT,
        updated_at TEXT NOT NULL,
        PRIMARY KEY(treaty_ref, version, reinsurer)
      );

      CREATE TABLE IF NOT EXISTS claims (
        claim_ref TEXT PRIMARY KEY,
        policy_ref TEXT NOT NULL,
        cedant TEXT NOT NULL,
        date_of_loss TEXT NOT NULL,
        occurrence_ref TEXT,
        gross_amount TEXT NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        raw_json TEXT NOT NULL,
        contract_id TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS claim_evidence (
        document_id TEXT NOT NULL,
        claim_ref TEXT NOT NULL,
        document_type TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        version INTEGER NOT NULL,
        uploaded_at TEXT NOT NULL,
        uploaded_by TEXT NOT NULL,
        PRIMARY KEY(document_id, claim_ref)
      );

      CREATE TABLE IF NOT EXISTS occurrences (
        occurrence_ref TEXT PRIMARY KEY,
        cedant TEXT NOT NULL,
        title TEXT NOT NULL,
        commencement_date TEXT NOT NULL,
        expiration_date TEXT NOT NULL,
        is_frozen INTEGER NOT NULL DEFAULT 0,
        is_closed INTEGER NOT NULL DEFAULT 0,
        contract_id TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS occurrence_claims (
        occurrence_ref TEXT NOT NULL,
        claim_ref TEXT NOT NULL,
        PRIMARY KEY(occurrence_ref, claim_ref)
      );

      CREATE TABLE IF NOT EXISTS assessments (
        assessment_ref TEXT NOT NULL,
        claim_ref TEXT NOT NULL,
        adjuster TEXT NOT NULL,
        version INTEGER NOT NULL,
        assessed_amount TEXT NOT NULL,
        deductible_amount TEXT NOT NULL,
        eligible_amount TEXT NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        methodology TEXT NOT NULL,
        contract_id TEXT,
        updated_at TEXT NOT NULL,
        PRIMARY KEY(assessment_ref, version)
      );

      CREATE TABLE IF NOT EXISTS allocation_cycles (
        cycle_ref TEXT PRIMARY KEY,
        treaty_ref TEXT NOT NULL,
        treaty_version INTEGER NOT NULL,
        occurrence_ref TEXT,
        treaty_type TEXT NOT NULL,
        eligible_subject_loss TEXT NOT NULL,
        total_gross_recovery TEXT NOT NULL,
        total_allocated TEXT NOT NULL,
        unplaced_recovery TEXT NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        calculation_methodology TEXT NOT NULL,
        contract_id TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS recoverable_allocations (
        allocation_ref TEXT PRIMARY KEY,
        cycle_ref TEXT NOT NULL,
        claim_ref TEXT NOT NULL,
        treaty_ref TEXT NOT NULL,
        reinsurer TEXT NOT NULL,
        allocated_amount TEXT NOT NULL,
        currency TEXT NOT NULL,
        line_percentage TEXT NOT NULL,
        status TEXT NOT NULL,
        contract_id TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reinsurer_decisions (
        decision_ref TEXT PRIMARY KEY,
        allocation_ref TEXT NOT NULL,
        reinsurer TEXT NOT NULL,
        decision_type TEXT NOT NULL,
        reason TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        contract_id TEXT
      );

      CREATE TABLE IF NOT EXISTS disputes (
        dispute_ref TEXT PRIMARY KEY,
        allocation_ref TEXT NOT NULL,
        reinsurer TEXT NOT NULL,
        disputed_amount TEXT NOT NULL,
        currency TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL,
        resolution_summary TEXT,
        contract_id TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS recovery_adjustments (
        adjustment_ref TEXT PRIMARY KEY,
        original_cycle_ref TEXT NOT NULL,
        claim_ref TEXT NOT NULL,
        adjustment_type TEXT NOT NULL,
        adjustment_amount TEXT NOT NULL,
        prior_recovery TEXT NOT NULL,
        revised_recovery TEXT NOT NULL,
        currency TEXT NOT NULL,
        approved_by TEXT NOT NULL,
        contract_id TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settlements (
        settlement_ref TEXT PRIMARY KEY,
        allocation_ref TEXT NOT NULL,
        reinsurer TEXT NOT NULL,
        cedant TEXT NOT NULL,
        amount_due TEXT NOT NULL,
        amount_settled TEXT NOT NULL,
        outstanding_balance TEXT NOT NULL,
        currency TEXT NOT NULL,
        due_date TEXT NOT NULL,
        status TEXT NOT NULL,
        permit_partial INTEGER NOT NULL DEFAULT 0,
        contract_id TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settlement_reconciliations (
        reconciliation_ref TEXT PRIMARY KEY,
        settlement_ref TEXT NOT NULL,
        confirmed_amount TEXT NOT NULL,
        currency TEXT NOT NULL,
        reconciliation_source TEXT NOT NULL,
        confirmed_by TEXT NOT NULL,
        confirmation_time TEXT NOT NULL,
        payment_document_id TEXT NOT NULL,
        contract_id TEXT
      );

      CREATE TABLE IF NOT EXISTS audit_events (
        event_id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        party TEXT NOT NULL,
        role TEXT NOT NULL,
        action TEXT NOT NULL,
        contract_id TEXT,
        update_id TEXT,
        claim_ref TEXT,
        treaty_ref TEXT,
        allocation_ref TEXT,
        details_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS idempotency_records (
        idempotency_key TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL,
        result_json TEXT
      );

      CREATE TABLE IF NOT EXISTS projection_checkpoints (
        component TEXT PRIMARY KEY,
        last_offset TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  }

  close(): void {
    this.db.close();
  }
}
