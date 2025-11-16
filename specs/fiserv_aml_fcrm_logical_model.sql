
-- AML / Financial Crime Risk Management (vendor-agnostic) Logical Data Model
-- Aligned to capabilities commonly present in Fiserv's Financial Crime Risk Management / AML Risk Manager,
-- but NOT using any proprietary table names or internal schemas.
-- Dialect: PostgreSQL-compatible (adjust types/identities as needed).

CREATE SCHEMA IF NOT EXISTS aml;

-- ============================
-- Reference & Governance
-- ============================
CREATE TABLE aml.ref_country (
    country_code CHAR(2) PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE aml.ref_currency (
    currency_code CHAR(3) PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE aml.ref_channel (
    channel_code TEXT PRIMARY KEY,  -- ATM, BRANCH, ONLINE, MOBILE, WIRE, ACH, SWIFT, POS, etc.
    description TEXT
);

CREATE TABLE aml.ref_txn_type (
    txn_type_code TEXT PRIMARY KEY, -- CASH_DEPOSIT, CASH_WITHDRAWAL, WIRE_IN, WIRE_OUT, ACH_IN, ACH_OUT, POS_PURCHASE, etc.
    description TEXT
);

CREATE TABLE aml.ref_product_type (
    product_type_code TEXT PRIMARY KEY, -- CHECKING, SAVINGS, CREDIT_CARD, WIRE_ONLY, LOAN, MORTGAGE, INVESTMENT
    description TEXT
);

CREATE TABLE aml.ref_risk_factor (
    factor_code TEXT PRIMARY KEY,  -- e.g., GEOGRAPHY, OCCUPATION, PEP, PRODUCT_RISK, CHANNEL_RISK, VELOCITY
    description TEXT
);

CREATE TABLE aml.ref_sanctions_list (
    list_code TEXT PRIMARY KEY,    -- OFAC, UN, EU, HMT, INTERPOL, Local-List
    name TEXT NOT NULL,
    publisher TEXT,
    version TEXT,
    fetched_at TIMESTAMPTZ
);

CREATE TABLE aml.ref_pep_source (
    source_code TEXT PRIMARY KEY,  -- e.g., DowJones, World-Check (example values; data providers not bundled)
    name TEXT NOT NULL
);

CREATE TABLE aml.source_system (
    source_system_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE aml.data_ingestion_run (
    run_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_system_id BIGINT NOT NULL REFERENCES aml.source_system(source_system_id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    status TEXT CHECK (status IN ('RUNNING','SUCCESS','FAILED')) NOT NULL,
    stats JSONB
);

CREATE TABLE aml.data_quality_issue (
    issue_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    run_id BIGINT NOT NULL REFERENCES aml.data_ingestion_run(run_id),
    table_name TEXT NOT NULL,
    record_pk TEXT,
    issue_type TEXT,              -- NULL_VALUE, INVALID_CODE, DUPLICATE, REFERENTIAL, RANGE
    severity TEXT,                -- LOW, MEDIUM, HIGH, CRITICAL
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================
-- Party & Organization
-- ============================
CREATE TABLE aml.party (
    party_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    party_type TEXT NOT NULL CHECK (party_type IN ('PERSON','ORGANIZATION')),
    external_ref TEXT,                               -- source system key
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    org_name TEXT,
    date_of_birth DATE,
    incorporation_date DATE,
    nationality_country_code CHAR(2),
    tin_tax_id TEXT,
    pep_flag BOOLEAN DEFAULT FALSE,
    risk_category TEXT,                               -- LOW/MEDIUM/HIGH or institution-specific
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX ON aml.party(pep_flag);
CREATE INDEX ON aml.party(nationality_country_code);

CREATE TABLE aml.party_identifier (
    party_identifier_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    id_type TEXT NOT NULL,         -- PASSPORT, NATIONAL_ID, DL, LEI, TAX_ID, REGISTRATION_NO
    id_value TEXT NOT NULL,
    issued_by TEXT,
    issued_at DATE,
    expires_at DATE,
    is_current BOOLEAN DEFAULT TRUE
);

CREATE UNIQUE INDEX ON aml.party_identifier(party_id, id_type, id_value);

CREATE TABLE aml.party_address (
    address_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    line1 TEXT, line2 TEXT, line3 TEXT, line4 TEXT,
    city TEXT, state_province TEXT, postal_code TEXT,
    country_code CHAR(2) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT TRUE
);

CREATE INDEX ON aml.party_address(party_id, is_current);

CREATE TABLE aml.party_contact (
    contact_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    contact_type TEXT NOT NULL,    -- EMAIL, PHONE, FAX
    contact_value TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);

CREATE TABLE aml.party_role (
    party_role_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    role_type TEXT NOT NULL,       -- CUSTOMER, BENEFICIAL_OWNER, EMPLOYEE, AGENT, MERCHANT, COUNTERPARTY
    start_date DATE,
    end_date DATE
);

CREATE INDEX ON aml.party_role(party_id, role_type);

CREATE TABLE aml.relationship (
    relationship_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    from_party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    to_party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    relationship_type TEXT NOT NULL,  -- SIGNATORY_OF, OWNS, DIRECTOR_OF, CONTROLS, FAMILY_OF, SAME_ADDRESS_AS
    start_date DATE,
    end_date DATE,
    strength_score NUMERIC(5,2)       -- optional heuristic
);

CREATE UNIQUE INDEX ON aml.relationship(from_party_id, to_party_id, relationship_type);

-- Beneficial ownership (aligns with "Beneficial Owner Module")
CREATE TABLE aml.beneficial_ownership (
    bo_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    owner_party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    ownership_pct NUMERIC(7,4) CHECK (ownership_pct >= 0 AND ownership_pct <= 100),
    control_type TEXT,                 -- DIRECT, INDIRECT, TRUSTEE, SIGNIFICANT_CONTROL
    start_date DATE,
    end_date DATE
);

CREATE INDEX ON aml.beneficial_ownership(customer_party_id);
CREATE INDEX ON aml.beneficial_ownership(owner_party_id);

CREATE TABLE aml.party_risk_assessment (
    assessment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    as_of_date DATE NOT NULL,
    risk_score NUMERIC(9,4) NOT NULL,
    risk_level TEXT NOT NULL,                 -- LOW/MEDIUM/HIGH/CRITICAL
    method TEXT,                              -- RULES, SCORECARD, MODEL
    method_version TEXT,
    details JSONB
);

CREATE UNIQUE INDEX ON aml.party_risk_assessment(party_id, as_of_date);

CREATE TABLE aml.party_risk_factor (
    assessment_id BIGINT NOT NULL REFERENCES aml.party_risk_assessment(assessment_id) ON DELETE CASCADE,
    factor_code TEXT NOT NULL REFERENCES aml.ref_risk_factor(factor_code),
    value_text TEXT,
    value_numeric NUMERIC(18,6),
    weight NUMERIC(9,4),
    contribution NUMERIC(9,4),
    PRIMARY KEY (assessment_id, factor_code)
);

CREATE TABLE aml.kyc_profile (
    kyc_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    kyc_level TEXT,                           -- SIMPLIFIED, STANDARD, ENHANCED
    status TEXT,                              -- PENDING, APPROVED, REJECTED, EXPIRED
    review_date DATE,
    next_review_due DATE,
    risk_level TEXT
);

CREATE TABLE aml.kyc_document (
    doc_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kyc_id BIGINT NOT NULL REFERENCES aml.kyc_profile(kyc_id),
    doc_type TEXT,                            -- PASSPORT, ID_CARD, UTILITY_BILL, INCORP_DOCS
    doc_number TEXT,
    issued_by TEXT,
    issued_date DATE,
    expiry_date DATE,
    file_hash TEXT,
    storage_uri TEXT
);

CREATE TABLE aml.kyc_event (
    event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    event_type TEXT,                          -- ONBOARDING, PERIODIC_REVIEW, TRIGGERED_REVIEW, CHANGE_IN_CIRCUMSTANCE
    event_ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT
);

-- ============================
-- Account & Product
-- ============================
CREATE TABLE aml.account (
    account_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_ref TEXT,
    account_number_hash TEXT NOT NULL,         -- store hashed/last4 only; do not store clear PAN/IBAN in analytics
    product_type_code TEXT NOT NULL REFERENCES aml.ref_product_type(product_type_code),
    open_date DATE,
    close_date DATE,
    status TEXT,                               -- OPEN, DORMANT, CLOSED, BLOCKED
    currency_code CHAR(3) REFERENCES aml.ref_currency(currency_code),
    institution_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON aml.account(product_type_code);
CREATE INDEX ON aml.account(status);

CREATE TABLE aml.account_holder (
    account_holder_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES aml.account(account_id),
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    relationship_type TEXT NOT NULL,           -- PRIMARY, JOINT, AUTHORIZED_SIGNER, POWER_OF_ATTORNEY
    start_date DATE,
    end_date DATE
);

CREATE UNIQUE INDEX ON aml.account_holder(account_id, party_id, relationship_type);

CREATE TABLE aml.product (
    product_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_type_code TEXT NOT NULL REFERENCES aml.ref_product_type(product_type_code),
    name TEXT,
    description TEXT
);

CREATE TABLE aml.instrument (
    instrument_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    instrument_type TEXT NOT NULL,             -- CARD, IBAN, WALLET, CHECKBOOK
    token_hash TEXT,                           -- hashed PAN/IBAN/etc.
    issuer TEXT,
    status TEXT
);

-- ============================
-- Transactions
-- ============================
CREATE TABLE aml.txn_location (
    location_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    line1 TEXT, line2 TEXT, city TEXT, state_province TEXT, postal_code TEXT,
    country_code CHAR(2), latitude NUMERIC(9,6), longitude NUMERIC(9,6)
);

CREATE TABLE aml.transaction (
    txn_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_txn_id TEXT,
    account_id BIGINT NOT NULL REFERENCES aml.account(account_id),
    amount NUMERIC(18,2) NOT NULL,
    currency_code CHAR(3) REFERENCES aml.ref_currency(currency_code),
    txn_type_code TEXT NOT NULL REFERENCES aml.ref_txn_type(txn_type_code),
    txn_ts TIMESTAMPTZ NOT NULL,
    channel_code TEXT REFERENCES aml.ref_channel(channel_code),
    description TEXT,
    merchant_category_code TEXT,
    location_id BIGINT REFERENCES aml.txn_location(location_id),
    counterparty_account_hash TEXT,
    counterparty_party_id BIGINT REFERENCES aml.party(party_id),
    source_system_id BIGINT REFERENCES aml.source_system(source_system_id),
    attributes JSONB
);

CREATE INDEX ON aml.transaction(account_id);
CREATE INDEX ON aml.transaction(txn_ts);
CREATE INDEX ON aml.transaction(txn_type_code);
CREATE INDEX ON aml.transaction(counterparty_party_id);

CREATE TABLE aml.txn_party (
    txn_party_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    txn_id BIGINT NOT NULL REFERENCES aml.transaction(txn_id) ON DELETE CASCADE,
    party_id BIGINT NOT NULL REFERENCES aml.party(party_id),
    role_type TEXT NOT NULL                -- ORIGINATOR, BENEFICIARY, INTERMEDIARY
);

CREATE UNIQUE INDEX ON aml.txn_party(txn_id, party_id, role_type);

CREATE TABLE aml.txn_link (
    link_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    txn_id BIGINT NOT NULL REFERENCES aml.transaction(txn_id) ON DELETE CASCADE,
    linked_txn_id BIGINT NOT NULL REFERENCES aml.transaction(txn_id) ON DELETE CASCADE,
    link_type TEXT NOT NULL               -- SAME_COUNTERPARTY, SAME_DEVICE, SAME_IP, SPLIT_DEPOSIT, REVERSAL
);

CREATE UNIQUE INDEX ON aml.txn_link(txn_id, linked_txn_id, link_type);

CREATE TABLE aml.txn_attribute (
    attribute_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    txn_id BIGINT NOT NULL REFERENCES aml.transaction(txn_id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT
);

CREATE INDEX ON aml.txn_attribute(txn_id, key);

CREATE TABLE aml.cash_aggregation (
    agg_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id BIGINT REFERENCES aml.account(account_id),
    party_id BIGINT REFERENCES aml.party(party_id),
    window_start TIMESTAMPTZ NOT NULL,
    window_end TIMESTAMPTZ NOT NULL,
    total_amount NUMERIC(18,2) NOT NULL,
    txn_count INT NOT NULL
);

-- ============================
-- Screening
-- ============================
CREATE TABLE aml.screening_job (
    job_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    list_code TEXT NOT NULL REFERENCES aml.ref_sanctions_list(list_code),
    entity_type TEXT NOT NULL,                 -- PARTY, TRANSACTION, ACCOUNT
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('PENDING','RUNNING','COMPLETED','FAILED'))
);

CREATE TABLE aml.screening_name (
    name_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES aml.screening_job(job_id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,                 -- PARTY, TRANSACTION, ACCOUNT
    entity_id BIGINT NOT NULL,
    name_text TEXT NOT NULL
);

CREATE TABLE aml.ref_list_entity (
    list_entity_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    list_code TEXT NOT NULL REFERENCES aml.ref_sanctions_list(list_code),
    name TEXT NOT NULL,
    entity_type TEXT,                          -- PERSON, ORGANIZATION, VESSEL, AIRCRAFT
    uid TEXT,
    country_code CHAR(2)
);

CREATE INDEX ON aml.ref_list_entity(list_code, name);

CREATE TABLE aml.screening_hit (
    hit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES aml.screening_job(job_id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,                 -- PARTY, TRANSACTION, ACCOUNT
    entity_id BIGINT NOT NULL,
    list_entity_id BIGINT NOT NULL REFERENCES aml.ref_list_entity(list_entity_id),
    match_score NUMERIC(9,4) NOT NULL,
    hit_status TEXT NOT NULL CHECK (hit_status IN ('NEW','UNDER_REVIEW','FALSE_POSITIVE','TRUE_MATCH','ESCALATED')),
    disposition TEXT,
    analyst_user_id BIGINT,
    decided_at TIMESTAMPTZ
);

CREATE INDEX ON aml.screening_hit(entity_type, entity_id);
CREATE INDEX ON aml.screening_hit(hit_status);

-- ============================
-- Detection (Scenarios & Models)
-- ============================
CREATE TABLE aml.scenario (
    scenario_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT TRUE,
    severity TEXT,                              -- LOW/MEDIUM/HIGH/CRITICAL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE aml.scenario_parameter (
    param_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    scenario_id BIGINT NOT NULL REFERENCES aml.scenario(scenario_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value_text TEXT,
    value_numeric NUMERIC(18,6),
    value_json JSONB
);

CREATE UNIQUE INDEX ON aml.scenario_parameter(scenario_id, name);

CREATE TABLE aml.model (
    model_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    model_type TEXT NOT NULL,                   -- RULES, ML_SUPERVISED, ML_UNSUPERVISED, GRAPH
    trained_at TIMESTAMPTZ,
    metrics JSONB
);

CREATE UNIQUE INDEX ON aml.model(name, version);

CREATE TABLE aml.model_score (
    score_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_type TEXT NOT NULL,                  -- PARTY, ACCOUNT, TRANSACTION
    entity_id BIGINT NOT NULL,
    model_id BIGINT NOT NULL REFERENCES aml.model(model_id),
    score NUMERIC(9,4) NOT NULL,
    scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    details JSONB
);

CREATE INDEX ON aml.model_score(entity_type, entity_id);
CREATE INDEX ON aml.model_score(model_id);

CREATE TABLE aml.alert (
    alert_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    scenario_id BIGINT REFERENCES aml.scenario(scenario_id),
    model_id BIGINT REFERENCES aml.model(model_id),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    priority TEXT,                               -- LOW, MEDIUM, HIGH, CRITICAL
    status TEXT NOT NULL CHECK (status IN ('NEW','QUEUED','ASSIGNED','UNDER_INVESTIGATION','CLOSED')),
    reason_code TEXT,
    notes TEXT
);

CREATE INDEX ON aml.alert(status);

CREATE TABLE aml.alert_entity (
    alert_id BIGINT NOT NULL REFERENCES aml.alert(alert_id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,                   -- PARTY, ACCOUNT, TRANSACTION
    entity_id BIGINT NOT NULL,
    PRIMARY KEY (alert_id, entity_type, entity_id)
);

CREATE TABLE aml.alert_score (
    alert_id BIGINT NOT NULL REFERENCES aml.alert(alert_id) ON DELETE CASCADE,
    score_type TEXT NOT NULL,                    -- SCENARIO_SCORE, MODEL_SCORE, RISK_SCORE
    score NUMERIC(9,4) NOT NULL,
    details JSONB,
    PRIMARY KEY (alert_id, score_type)
);

CREATE TABLE aml.alert_disposition (
    disposition_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    alert_id BIGINT NOT NULL REFERENCES aml.alert(alert_id) ON DELETE CASCADE,
    analyst_user_id BIGINT,
    disposition TEXT NOT NULL,                   -- TRUE_POSITIVE, FALSE_POSITIVE, ESCALATED
    reason TEXT,
    disposition_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================
-- Case Management & Investigations
-- ============================
CREATE TABLE aml."user" (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    email TEXT,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE aml.team (
    team_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE aml."role" (
    role_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE aml.user_role (
    user_id BIGINT NOT NULL REFERENCES aml."user"(user_id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES aml."role"(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE aml.case (
    case_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_number TEXT UNIQUE,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('OPEN','IN_PROGRESS','ESCALATED','CLOSED','FILED')),
    case_type TEXT NOT NULL,                     -- AML_ALERT, SANCTIONS, KYC_REVIEW, INTERNAL_FRAUD
    owner_user_id BIGINT REFERENCES aml."user"(user_id),
    priority TEXT,                               -- LOW/MEDIUM/HIGH/CRITICAL
    summary TEXT,
    source TEXT                                  -- ALERT, MANUAL, IMPORT
);

CREATE INDEX ON aml.case(status);
CREATE INDEX ON aml.case(case_type);

CREATE TABLE aml.case_alert (
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id) ON DELETE CASCADE,
    alert_id BIGINT NOT NULL REFERENCES aml.alert(alert_id) ON DELETE CASCADE,
    PRIMARY KEY (case_id, alert_id)
);

CREATE TABLE aml.case_entity (
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,                   -- PARTY, ACCOUNT, TRANSACTION
    entity_id BIGINT NOT NULL,
    PRIMARY KEY (case_id, entity_type, entity_id)
);

CREATE TABLE aml.case_note (
    note_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id) ON DELETE CASCADE,
    author_user_id BIGINT REFERENCES aml."user"(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    note_text TEXT NOT NULL
);

CREATE TABLE aml.case_attachment (
    attachment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_hash TEXT,
    storage_uri TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE aml.task (
    task_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,                      -- DOCUMENT_REQUEST, CUSTOMER_OUTREACH, SAR_PREP, QA_REVIEW
    assignee_user_id BIGINT REFERENCES aml."user"(user_id),
    due_date DATE,
    status TEXT NOT NULL CHECK (status IN ('PENDING','IN_PROGRESS','BLOCKED','DONE','CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE aml.escalation (
    escalation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id) ON DELETE CASCADE,
    from_user_id BIGINT REFERENCES aml."user"(user_id),
    to_user_id BIGINT REFERENCES aml."user"(user_id),
    escalated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason TEXT
);

-- ============================
-- Regulatory Reporting (SAR/CTR/DOEP)
-- ============================
CREATE TABLE aml.regulatory_batch (
    batch_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_type TEXT NOT NULL,                   -- SAR, CTR, DOEP
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('PENDING','GENERATED','SUBMITTED','ACKNOWLEDGED','REJECTED')),
    submission_reference TEXT
);

CREATE TABLE aml.sar_report (
    sar_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id),
    batch_id BIGINT REFERENCES aml.regulatory_batch(batch_id),
    filed_at TIMESTAMPTZ,
    ack_id TEXT,
    status TEXT CHECK (status IN ('DRAFT','FILED','ACKNOWLEDGED','REJECTED')),
    filing_payload_uri TEXT,
    metadata JSONB
);

CREATE TABLE aml.ctr_report (
    ctr_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id),
    batch_id BIGINT REFERENCES aml.regulatory_batch(batch_id),
    aggregation_window_start TIMESTAMPTZ,
    aggregation_window_end TIMESTAMPTZ,
    filed_at TIMESTAMPTZ,
    ack_id TEXT,
    status TEXT CHECK (status IN ('DRAFT','FILED','ACKNOWLEDGED','REJECTED')),
    filing_payload_uri TEXT,
    metadata JSONB
);

CREATE TABLE aml.doep_report (
    doep_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES aml.case(case_id),
    batch_id BIGINT REFERENCES aml.regulatory_batch(batch_id),
    filed_at TIMESTAMPTZ,
    status TEXT CHECK (status IN ('DRAFT','FILED','ACKNOWLEDGED','REJECTED')),
    filing_payload_uri TEXT,
    metadata JSONB
);

-- ============================
-- Audit & Lineage
-- ============================
CREATE TABLE aml.audit_log (
    audit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_user_id BIGINT REFERENCES aml."user"(user_id),
    action TEXT NOT NULL,                         -- CREATE_CASE, UPDATE_ALERT, FILE_SAR, LOGIN, etc.
    entity_type TEXT NOT NULL,
    entity_id BIGINT,
    event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    details JSONB
);

-- Recommended indexes (not exhaustive)
CREATE INDEX ON aml.transaction(account_id, txn_ts DESC);
CREATE INDEX ON aml.alert_entity(entity_type, entity_id);
CREATE INDEX ON aml.case_entity(entity_type, entity_id);
CREATE INDEX ON aml.sar_report(case_id);
CREATE INDEX ON aml.ctr_report(case_id);
CREATE INDEX ON aml.screening_hit(list_entity_id);
