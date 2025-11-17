// Mock FCRM Cases based on Fiserv AML/FCRM Logical Data Model
// Simulates data from aml.case, aml.alert, aml.party, aml.transaction, aml.account

const mockCases = [
  {
    case_id: 1001,
    case_number: 'FCRM-2025-001234',
    opened_at: '2025-01-10T09:15:00Z',
    status: 'IN_PROGRESS',
    case_type: 'AML_ALERT',
    priority: 'HIGH',
    summary: 'Unusual high-value cross-border wire transfers',

    // Alert data
    alert: {
      alert_id: 5001,
      scenario: {
        code: 'WIRE_VELOCITY_FOREIGN',
        name: 'Unusual Wire Transfer Activity - Foreign Countries',
        description: 'Multiple large wire transfers to high-risk jurisdictions within short timeframe'
      },
      generated_at: '2025-01-10T08:00:00Z',
      priority: 'HIGH',
      status: 'UNDER_INVESTIGATION'
    },

    // Party (Customer) data
    party: {
      party_id: 2001,
      party_type: 'ORGANIZATION',
      full_name: 'Global Innovations B.V.',
      org_name: 'Global Innovations B.V.',
      incorporation_date: '2018-03-15',
      nationality_country_code: 'NL',
      tin_tax_id: 'NL123456789B01',
      pep_flag: false,
      risk_category: 'MEDIUM',
      risk_score: 65.4,
      addresses: [
        {
          line1: 'Amstelplein 1',
          city: 'Amsterdam',
          postal_code: '1096 HA',
          country_code: 'NL',
          is_current: true
        }
      ]
    },

    // Account data
    account: {
      account_id: 3001,
      account_number_hash: '****8472',
      product_type_code: 'CHECKING',
      open_date: '2018-04-01',
      status: 'OPEN',
      currency_code: 'EUR'
    },

    // Transactions
    transactions: [
      {
        txn_id: 10001,
        amount: 45000.00,
        currency_code: 'EUR',
        txn_type_code: 'WIRE_OUT',
        txn_ts: '2025-01-08T14:23:00Z',
        channel_code: 'ONLINE',
        description: 'Wire transfer to UAE',
        counterparty_account_hash: '****2891',
        location: {
          country_code: 'AE',
          city: 'Dubai'
        }
      },
      {
        txn_id: 10002,
        amount: 52000.00,
        currency_code: 'EUR',
        txn_type_code: 'WIRE_OUT',
        txn_ts: '2025-01-09T10:15:00Z',
        channel_code: 'ONLINE',
        description: 'Wire transfer to Hong Kong',
        counterparty_account_hash: '****7654',
        location: {
          country_code: 'HK',
          city: 'Hong Kong'
        }
      },
      {
        txn_id: 10003,
        amount: 38000.00,
        currency_code: 'EUR',
        txn_type_code: 'WIRE_OUT',
        txn_ts: '2025-01-10T08:45:00Z',
        channel_code: 'ONLINE',
        description: 'Wire transfer to Singapore',
        counterparty_account_hash: '****4521',
        location: {
          country_code: 'SG',
          city: 'Singapore'
        }
      }
    ],

    // Risk Assessment
    risk_assessment: {
      as_of_date: '2025-01-10',
      risk_score: 78.5,
      risk_level: 'HIGH',
      method: 'SCORECARD',
      risk_factors: [
        { factor_code: 'GEOGRAPHY', value_text: 'High-risk jurisdictions', contribution: 25.0 },
        { factor_code: 'VELOCITY', value_text: 'Unusual transaction frequency', contribution: 30.0 },
        { factor_code: 'CHANNEL_RISK', value_text: 'Online banking', contribution: 10.5 },
        { factor_code: 'PRODUCT_RISK', value_text: 'Wire transfers', contribution: 13.0 }
      ]
    },

    // Case notes
    case_notes: [
      {
        note_id: 1,
        author: 'L1 Analyst - Sarah Johnson',
        created_at: '2025-01-10T09:30:00Z',
        note_text: 'Initial review: Customer has legitimate import/export business but recent wire pattern is unusual. Requesting additional documentation.'
      }
    ],

    // KYC Profile
    kyc: {
      kyc_level: 'ENHANCED',
      status: 'APPROVED',
      review_date: '2024-06-15',
      next_review_due: '2025-06-15',
      risk_level: 'MEDIUM'
    }
  },

  {
    case_id: 1002,
    case_number: 'FCRM-2025-001189',
    opened_at: '2025-01-09T14:20:00Z',
    status: 'CLOSED',
    case_type: 'SANCTIONS',
    priority: 'CRITICAL',
    summary: 'Sanctions screening hit - potential match to OFAC list',

    alert: {
      alert_id: 5002,
      scenario: {
        code: 'SANCTIONS_HIT',
        name: 'Sanctions Screening Match',
        description: 'Name match against OFAC SDN list'
      },
      generated_at: '2025-01-09T14:00:00Z',
      priority: 'CRITICAL',
      status: 'CLOSED'
    },

    party: {
      party_id: 2002,
      party_type: 'PERSON',
      full_name: 'Alex M. Davidson',
      first_name: 'Alex',
      last_name: 'Davidson',
      date_of_birth: '1982-07-22',
      nationality_country_code: 'GB',
      pep_flag: false,
      risk_category: 'LOW',
      risk_score: 25.0,
      addresses: [
        {
          line1: '45 Baker Street',
          city: 'London',
          postal_code: 'W1U 8EW',
          country_code: 'GB',
          is_current: true
        }
      ]
    },

    account: {
      account_id: 3002,
      account_number_hash: '****1234',
      product_type_code: 'SAVINGS',
      open_date: '2020-02-10',
      status: 'OPEN',
      currency_code: 'GBP'
    },

    transactions: [],

    screening_hit: {
      hit_id: 7001,
      list_code: 'OFAC',
      match_score: 75.4,
      hit_status: 'FALSE_POSITIVE',
      disposition: 'False positive - different middle name and DOB. Customer cleared.',
      analyst_user_id: 101,
      decided_at: '2025-01-09T16:45:00Z'
    },

    risk_assessment: {
      as_of_date: '2024-11-01',
      risk_score: 25.0,
      risk_level: 'LOW',
      method: 'RULES'
    },

    case_notes: [
      {
        note_id: 2,
        author: 'L1 Analyst - Mark Peters',
        created_at: '2025-01-09T14:30:00Z',
        note_text: 'Screening hit on OFAC list. Reviewing customer documents.'
      },
      {
        note_id: 3,
        author: 'L1 Analyst - Mark Peters',
        created_at: '2025-01-09T16:40:00Z',
        note_text: 'Confirmed false positive. Customer DOB: 1982-07-22 vs. OFAC entry: 1979-03-15. Middle name also different. Case cleared.'
      }
    ],

    kyc: {
      kyc_level: 'STANDARD',
      status: 'APPROVED',
      review_date: '2024-02-10',
      next_review_due: '2027-02-10',
      risk_level: 'LOW'
    }
  },

  {
    case_id: 1003,
    case_number: 'FCRM-2025-001256',
    opened_at: '2025-01-11T11:05:00Z',
    status: 'NEW',
    case_type: 'AML_ALERT',
    priority: 'MEDIUM',
    summary: 'Structuring activity - multiple cash deposits below reporting threshold',

    alert: {
      alert_id: 5003,
      scenario: {
        code: 'CASH_STRUCTURING',
        name: 'Potential Structuring / Smurfing',
        description: 'Multiple cash deposits just below CTR threshold ($10,000)'
      },
      generated_at: '2025-01-11T10:00:00Z',
      priority: 'MEDIUM',
      status: 'NEW'
    },

    party: {
      party_id: 2003,
      party_type: 'PERSON',
      full_name: 'Maria Santos',
      first_name: 'Maria',
      last_name: 'Santos',
      date_of_birth: '1990-11-05',
      nationality_country_code: 'PT',
      pep_flag: false,
      risk_category: 'LOW',
      risk_score: 35.2,
      addresses: [
        {
          line1: 'Rua Augusta 123',
          city: 'Lisbon',
          postal_code: '1100-048',
          country_code: 'PT',
          is_current: true
        }
      ]
    },

    account: {
      account_id: 3003,
      account_number_hash: '****5678',
      product_type_code: 'CHECKING',
      open_date: '2022-05-15',
      status: 'OPEN',
      currency_code: 'EUR'
    },

    transactions: [
      {
        txn_id: 10004,
        amount: 9800.00,
        currency_code: 'EUR',
        txn_type_code: 'CASH_DEPOSIT',
        txn_ts: '2025-01-06T10:22:00Z',
        channel_code: 'BRANCH',
        description: 'Cash deposit',
        location: {
          country_code: 'PT',
          city: 'Lisbon'
        }
      },
      {
        txn_id: 10005,
        amount: 9900.00,
        currency_code: 'EUR',
        txn_type_code: 'CASH_DEPOSIT',
        txn_ts: '2025-01-08T14:15:00Z',
        channel_code: 'BRANCH',
        description: 'Cash deposit',
        location: {
          country_code: 'PT',
          city: 'Lisbon'
        }
      },
      {
        txn_id: 10006,
        amount: 9750.00,
        currency_code: 'EUR',
        txn_type_code: 'CASH_DEPOSIT',
        txn_ts: '2025-01-10T09:30:00Z',
        channel_code: 'BRANCH',
        description: 'Cash deposit',
        location: {
          country_code: 'PT',
          city: 'Lisbon'
        }
      },
      {
        txn_id: 10007,
        amount: 9850.00,
        currency_code: 'EUR',
        txn_type_code: 'CASH_DEPOSIT',
        txn_ts: '2025-01-11T11:00:00Z',
        channel_code: 'BRANCH',
        description: 'Cash deposit',
        location: {
          country_code: 'PT',
          city: 'Lisbon'
        }
      }
    ],

    risk_assessment: {
      as_of_date: '2025-01-11',
      risk_score: 62.3,
      risk_level: 'MEDIUM',
      method: 'SCORECARD',
      risk_factors: [
        { factor_code: 'VELOCITY', value_text: 'High cash deposit frequency', contribution: 35.0 },
        { factor_code: 'CHANNEL_RISK', value_text: 'In-person cash deposits', contribution: 15.3 },
        { factor_code: 'PRODUCT_RISK', value_text: 'Checking account', contribution: 12.0 }
      ]
    },

    case_notes: [],

    kyc: {
      kyc_level: 'STANDARD',
      status: 'APPROVED',
      review_date: '2023-05-15',
      next_review_due: '2026-05-15',
      risk_level: 'LOW'
    }
  }
];

export default mockCases;
