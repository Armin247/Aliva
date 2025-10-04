/*
  # User Request Tracking and Subscription System

  1. New Tables
    - `user_profiles`
      - `user_id` (uuid, primary key) - Firebase auth user ID
      - `email` (text) - User email
      - `is_pro` (boolean) - Whether user has pro subscription
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `chat_requests`
      - `id` (uuid, primary key) - Request ID
      - `user_id` (uuid, foreign key) - References user_profiles
      - `request_date` (date) - Date of the request
      - `request_count` (integer) - Number of requests made on this date
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    
  3. Important Notes
    - Free users are limited to 3 requests per day
    - Pro users have unlimited requests
    - Request counts are tracked per day and reset daily
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY,
  email text NOT NULL,
  is_pro boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  request_date date DEFAULT CURRENT_DATE,
  request_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, request_date)
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view own requests"
  ON chat_requests FOR SELECT
  TO authenticated
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own requests"
  ON chat_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own requests"
  ON chat_requests FOR UPDATE
  TO authenticated
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE INDEX IF NOT EXISTS idx_chat_requests_user_date ON chat_requests(user_id, request_date);