BEGIN;

CREATE TYPE campaign_status AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ENDED');
CREATE TYPE campaign_reward_status AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');
CREATE TYPE campaign_identifier_type AS ENUM ('member', 'phone');
CREATE TYPE member_validation_status AS ENUM ('REGISTERED_IDENTIFIER', 'VERIFIED', 'REJECTED');
CREATE TYPE voucher_status AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED');
CREATE TYPE campaign_staff_role AS ENUM ('STAFF', 'MANAGER', 'ADMIN');
CREATE TYPE redemption_status AS ENUM ('SUCCESS', 'REJECTED');

CREATE TABLE campaigns (
  id serial CONSTRAINT campaigns_pkey PRIMARY KEY,
  campaign_id varchar(80) NOT NULL CONSTRAINT campaigns_campaign_id_unique UNIQUE,
  name varchar(180) NOT NULL,
  status campaign_status NOT NULL DEFAULT 'DRAFT'::campaign_status,
  claim_start_at timestamptz NOT NULL,
  claim_end_at timestamptz NOT NULL,
  redemption_end_at timestamptz NOT NULL,
  content_config text,
  terms text,
  eligibility_config text,
  page_source varchar(255),
  qr_base_url varchar(500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE campaign_rewards (
  id serial CONSTRAINT campaign_rewards_pkey PRIMARY KEY,
  reward_id varchar(80) NOT NULL CONSTRAINT campaign_rewards_reward_id_unique UNIQUE,
  campaign_pk integer NOT NULL,
  name varchar(180) NOT NULL,
  status campaign_reward_status NOT NULL DEFAULT 'DRAFT'::campaign_reward_status,
  reward_config text,
  marketing_copy text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campaign_rewards_campaign_pk_campaigns_id_fk
    FOREIGN KEY (campaign_pk) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX campaign_rewards_campaign_idx ON campaign_rewards (campaign_pk);

CREATE TABLE campaign_stores (
  id serial CONSTRAINT campaign_stores_pkey PRIMARY KEY,
  store_id varchar(64) NOT NULL CONSTRAINT campaign_stores_store_id_unique UNIQUE,
  name varchar(120) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  config text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE campaign_staff_credentials (
  id serial CONSTRAINT campaign_staff_credentials_pkey PRIMARY KEY,
  credential_id varchar(80) NOT NULL CONSTRAINT campaign_staff_credentials_credential_id_unique UNIQUE,
  display_name varchar(120) NOT NULL,
  pin_hash varchar(64) NOT NULL,
  store_pk integer,
  role campaign_staff_role NOT NULL DEFAULT 'STAFF'::campaign_staff_role,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campaign_staff_credentials_store_pk_campaign_stores_id_fk
    FOREIGN KEY (store_pk) REFERENCES campaign_stores(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX campaign_staff_store_idx ON campaign_staff_credentials (store_pk);

CREATE TABLE campaign_participations (
  id serial CONSTRAINT campaign_participations_pkey PRIMARY KEY,
  participation_id varchar(80) NOT NULL CONSTRAINT campaign_participations_participation_id_unique UNIQUE,
  campaign_pk integer NOT NULL,
  reward_pk integer NOT NULL,
  identifier_type campaign_identifier_type NOT NULL,
  identifier_hash varchar(64) NOT NULL,
  identifier_last4 varchar(4) NOT NULL,
  member_validation_status member_validation_status NOT NULL DEFAULT 'REGISTERED_IDENTIFIER'::member_validation_status,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campaign_participations_campaign_pk_campaigns_id_fk
    FOREIGN KEY (campaign_pk) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT campaign_participations_reward_pk_campaign_rewards_id_fk
    FOREIGN KEY (reward_pk) REFERENCES campaign_rewards(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE UNIQUE INDEX campaign_participations_campaign_member_unique
  ON campaign_participations (campaign_pk, identifier_hash);
CREATE INDEX campaign_participations_reward_idx ON campaign_participations (reward_pk);

CREATE TABLE vouchers (
  id serial CONSTRAINT vouchers_pkey PRIMARY KEY,
  voucher_id varchar(80) NOT NULL CONSTRAINT vouchers_voucher_id_unique UNIQUE,
  campaign_pk integer NOT NULL,
  reward_pk integer NOT NULL,
  participation_pk integer NOT NULL,
  display_code varchar(32) NOT NULL CONSTRAINT vouchers_display_code_unique UNIQUE,
  qr_token varchar(96) NOT NULL CONSTRAINT vouchers_qr_token_unique UNIQUE,
  status voucher_status NOT NULL DEFAULT 'ACTIVE'::voucher_status,
  issued_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT vouchers_campaign_pk_campaigns_id_fk
    FOREIGN KEY (campaign_pk) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT vouchers_reward_pk_campaign_rewards_id_fk
    FOREIGN KEY (reward_pk) REFERENCES campaign_rewards(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT vouchers_participation_pk_campaign_participations_id_fk
    FOREIGN KEY (participation_pk) REFERENCES campaign_participations(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX vouchers_campaign_status_idx ON vouchers (campaign_pk, status);
CREATE UNIQUE INDEX vouchers_participation_unique ON vouchers (participation_pk);

CREATE TABLE redemptions (
  id serial CONSTRAINT redemptions_pkey PRIMARY KEY,
  redemption_id varchar(80) NOT NULL CONSTRAINT redemptions_redemption_id_unique UNIQUE,
  voucher_pk integer NOT NULL,
  campaign_pk integer NOT NULL,
  store_pk integer NOT NULL,
  staff_credential_pk integer NOT NULL,
  status redemption_status NOT NULL DEFAULT 'SUCCESS'::redemption_status,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT redemptions_voucher_pk_vouchers_id_fk
    FOREIGN KEY (voucher_pk) REFERENCES vouchers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT redemptions_campaign_pk_campaigns_id_fk
    FOREIGN KEY (campaign_pk) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT redemptions_store_pk_campaign_stores_id_fk
    FOREIGN KEY (store_pk) REFERENCES campaign_stores(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT redemptions_staff_credential_pk_campaign_staff_credentials_id_f
    FOREIGN KEY (staff_credential_pk) REFERENCES campaign_staff_credentials(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX redemptions_campaign_idx ON redemptions (campaign_pk);
CREATE UNIQUE INDEX redemptions_voucher_success_unique ON redemptions (voucher_pk);

COMMIT;
