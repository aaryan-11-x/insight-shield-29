-- Enable Row Level Security on all tables
ALTER TABLE instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE most_exploitable ENABLE ROW LEVEL SECURITY;
ALTER TABLE ageing_of_vulnerability ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE mttm_by_severity ENABLE ROW LEVEL SECURITY;
ALTER TABLE prioritization_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE cve_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE eol_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE eol_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE eol_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exploitability_scoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE patch_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE patch_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_to_unique_vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vulnerability_clustering ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_summary ENABLE ROW LEVEL SECURITY;

-- Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.user_role', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'normaluser';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is superuser
CREATE OR REPLACE FUNCTION is_superuser()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() = 'superuser';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for instances table
CREATE POLICY "Superusers can do everything on instances" ON instances
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read instances" ON instances
  FOR SELECT USING (get_user_role() = 'normaluser');

-- RLS Policies for runs table
CREATE POLICY "Superusers can do everything on runs" ON runs
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read runs" ON runs
  FOR SELECT USING (get_user_role() = 'normaluser');

-- RLS Policies for all data tables (read-only for normal users, full access for superusers)
-- IP Insights
CREATE POLICY "Superusers can do everything on ip_insights" ON ip_insights
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read ip_insights" ON ip_insights
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Most Exploitable
CREATE POLICY "Superusers can do everything on most_exploitable" ON most_exploitable
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read most_exploitable" ON most_exploitable
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Ageing of Vulnerability
CREATE POLICY "Superusers can do everything on ageing_of_vulnerability" ON ageing_of_vulnerability
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read ageing_of_vulnerability" ON ageing_of_vulnerability
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Host Summary
CREATE POLICY "Superusers can do everything on host_summary" ON host_summary
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read host_summary" ON host_summary
  FOR SELECT USING (get_user_role() = 'normaluser');

-- MTTM by Severity
CREATE POLICY "Superusers can do everything on mttm_by_severity" ON mttm_by_severity
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read mttm_by_severity" ON mttm_by_severity
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Prioritization Insights
CREATE POLICY "Superusers can do everything on prioritization_insights" ON prioritization_insights
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read prioritization_insights" ON prioritization_insights
  FOR SELECT USING (get_user_role() = 'normaluser');

-- CVE Summary
CREATE POLICY "Superusers can do everything on cve_summary" ON cve_summary
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read cve_summary" ON cve_summary
  FOR SELECT USING (get_user_role() = 'normaluser');

-- EOL Components
CREATE POLICY "Superusers can do everything on eol_components" ON eol_components
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read eol_components" ON eol_components
  FOR SELECT USING (get_user_role() = 'normaluser');

-- EOL IPs
CREATE POLICY "Superusers can do everything on eol_ips" ON eol_ips
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read eol_ips" ON eol_ips
  FOR SELECT USING (get_user_role() = 'normaluser');

-- EOL Versions
CREATE POLICY "Superusers can do everything on eol_versions" ON eol_versions
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read eol_versions" ON eol_versions
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Exploitability Scoring
CREATE POLICY "Superusers can do everything on exploitability_scoring" ON exploitability_scoring
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read exploitability_scoring" ON exploitability_scoring
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Patch Availability
CREATE POLICY "Superusers can do everything on patch_availability" ON patch_availability
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read patch_availability" ON patch_availability
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Patch Details
CREATE POLICY "Superusers can do everything on patch_details" ON patch_details
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read patch_details" ON patch_details
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Remediation Insights
CREATE POLICY "Superusers can do everything on remediation_insights" ON remediation_insights
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read remediation_insights" ON remediation_insights
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Remediation to Unique Vulnerabilities
CREATE POLICY "Superusers can do everything on remediation_to_unique_vulnerabilities" ON remediation_to_unique_vulnerabilities
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read remediation_to_unique_vulnerabilities" ON remediation_to_unique_vulnerabilities
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Unique Assets
CREATE POLICY "Superusers can do everything on unique_assets" ON unique_assets
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read unique_assets" ON unique_assets
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Unique Vulnerabilities
CREATE POLICY "Superusers can do everything on unique_vulnerabilities" ON unique_vulnerabilities
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read unique_vulnerabilities" ON unique_vulnerabilities
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Vulnerability Clustering
CREATE POLICY "Superusers can do everything on vulnerability_clustering" ON vulnerability_clustering
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read vulnerability_clustering" ON vulnerability_clustering
  FOR SELECT USING (get_user_role() = 'normaluser');

-- Risk Summary
CREATE POLICY "Superusers can do everything on risk_summary" ON risk_summary
  FOR ALL USING (is_superuser());

CREATE POLICY "Normal users can only read risk_summary" ON risk_summary
  FOR SELECT USING (get_user_role() = 'normaluser'); 