export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ageing_of_vulnerability: {
        Row: {
          cve: string
          cve_published_date: string | null
          days_after_discovery: number | null
          host: string
          id: number
          name: string
          plugin_id: number
          risk: string
        }
        Insert: {
          cve: string
          cve_published_date?: string | null
          days_after_discovery?: number | null
          host: string
          id?: number
          name: string
          plugin_id: number
          risk: string
        }
        Update: {
          cve?: string
          cve_published_date?: string | null
          days_after_discovery?: number | null
          host?: string
          id?: number
          name?: string
          plugin_id?: number
          risk?: string
        }
        Relationships: []
      }
      cve_summary: {
        Row: {
          count: number | null
          cve: string
          description: string | null
          hosts: string | null
          name: string | null
          severity: string | null
          solutions: string | null
        }
        Insert: {
          count?: number | null
          cve: string
          description?: string | null
          hosts?: string | null
          name?: string | null
          severity?: string | null
          solutions?: string | null
        }
        Update: {
          count?: number | null
          cve?: string
          description?: string | null
          hosts?: string | null
          name?: string | null
          severity?: string | null
          solutions?: string | null
        }
        Relationships: []
      }
      eol_components: {
        Row: {
          created_at: string
          cve: string | null
          eol_duration_days: number | null
          name: string
          plugin_id: number
          risk: string
        }
        Insert: {
          created_at?: string
          cve?: string | null
          eol_duration_days?: number | null
          name: string
          plugin_id: number
          risk: string
        }
        Update: {
          created_at?: string
          cve?: string | null
          eol_duration_days?: number | null
          name?: string
          plugin_id?: number
          risk?: string
        }
        Relationships: []
      }
      eol_ip: {
        Row: {
          ip_address: unknown
          risk_level: string
          seol_component_count: number
        }
        Insert: {
          ip_address: unknown
          risk_level: string
          seol_component_count: number
        }
        Update: {
          ip_address?: unknown
          risk_level?: string
          seol_component_count?: number
        }
        Relationships: []
      }
      eol_summary: {
        Row: {
          apache_log4j_count: number
          asp_net_core_count: number
          created_at: string
          critical_count: number
          critical_pct: number
          dotnet_core_sdk_count: number
          high_count: number
          high_pct: number
          hosts_with_eol_components: number
          id: number
          low_count: number
          low_pct: number
          medium_count: number
          medium_pct: number
          microsoft_dotnet_core_count: number
          microsoft_silverlight_count: number
          software_types_affected: number
          total_count: number
          total_unique_components: number
          unique_eol_versions: number
        }
        Insert: {
          apache_log4j_count?: number
          asp_net_core_count?: number
          created_at?: string
          critical_count: number
          critical_pct: number
          dotnet_core_sdk_count?: number
          high_count: number
          high_pct: number
          hosts_with_eol_components: number
          id?: never
          low_count: number
          low_pct: number
          medium_count: number
          medium_pct: number
          microsoft_dotnet_core_count?: number
          microsoft_silverlight_count?: number
          software_types_affected: number
          total_count: number
          total_unique_components: number
          unique_eol_versions: number
        }
        Update: {
          apache_log4j_count?: number
          asp_net_core_count?: number
          created_at?: string
          critical_count?: number
          critical_pct?: number
          dotnet_core_sdk_count?: number
          high_count?: number
          high_pct?: number
          hosts_with_eol_components?: number
          id?: never
          low_count?: number
          low_pct?: number
          medium_count?: number
          medium_pct?: number
          microsoft_dotnet_core_count?: number
          microsoft_silverlight_count?: number
          software_types_affected?: number
          total_count?: number
          total_unique_components?: number
          unique_eol_versions?: number
        }
        Relationships: []
      }
      eol_versions: {
        Row: {
          instance_count: number
          software_type: string
          version: string
        }
        Insert: {
          instance_count: number
          software_type: string
          version: string
        }
        Update: {
          instance_count?: number
          software_type?: string
          version?: string
        }
        Relationships: []
      }
      exploitability_scoring: {
        Row: {
          cve: string
          cvss_category: string | null
          cvss_v3_base_score: number | null
          description: string | null
          epss_category: string | null
          epss_score: number | null
          exploitability_score: number | null
          host: string
          id: number
          kev_listed: boolean | null
          name: string | null
          plugin_id: number
          plugin_output: string | null
          risk: string | null
          vpr_category: string | null
          vpr_score: number | null
        }
        Insert: {
          cve: string
          cvss_category?: string | null
          cvss_v3_base_score?: number | null
          description?: string | null
          epss_category?: string | null
          epss_score?: number | null
          exploitability_score?: number | null
          host: string
          id?: number
          kev_listed?: boolean | null
          name?: string | null
          plugin_id: number
          plugin_output?: string | null
          risk?: string | null
          vpr_category?: string | null
          vpr_score?: number | null
        }
        Update: {
          cve?: string
          cvss_category?: string | null
          cvss_v3_base_score?: number | null
          description?: string | null
          epss_category?: string | null
          epss_score?: number | null
          exploitability_score?: number | null
          host?: string
          id?: number
          kev_listed?: boolean | null
          name?: string | null
          plugin_id?: number
          plugin_output?: string | null
          risk?: string | null
          vpr_category?: string | null
          vpr_score?: number | null
        }
        Relationships: []
      }
      host_summary: {
        Row: {
          critical: number
          high: number
          host: string
          low: number
          medium: number
          vulnerabilities_with_cve: number
          vulnerability_count: number
        }
        Insert: {
          critical: number
          high: number
          host: string
          low: number
          medium: number
          vulnerabilities_with_cve: number
          vulnerability_count: number
        }
        Update: {
          critical?: number
          high?: number
          host?: string
          low?: number
          medium?: number
          vulnerabilities_with_cve?: number
          vulnerability_count?: number
        }
        Relationships: []
      }
      instances: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ip_insights: {
        Row: {
          critical: number
          exploitability_score: number
          high: number
          hostname: string | null
          ip_address: unknown
          kev_count: number
          last_scan_date: string | null
          low: number
          medium: number
          most_common_category: string | null
          total_vulnerabilities: number
        }
        Insert: {
          critical: number
          exploitability_score: number
          high: number
          hostname?: string | null
          ip_address: unknown
          kev_count: number
          last_scan_date?: string | null
          low: number
          medium: number
          most_common_category?: string | null
          total_vulnerabilities: number
        }
        Update: {
          critical?: number
          exploitability_score?: number
          high?: number
          hostname?: string | null
          ip_address?: unknown
          kev_count?: number
          last_scan_date?: string | null
          low?: number
          medium?: number
          most_common_category?: string | null
          total_vulnerabilities?: number
        }
        Relationships: []
      }
      most_exploitable: {
        Row: {
          critical_count: number
          cumulative_exploitability: number
          high_count: number
          host: string
          id: number
          low_count: number
          medium_count: number
          total_vulnerabilities: number
        }
        Insert: {
          critical_count: number
          cumulative_exploitability: number
          high_count: number
          host: string
          id?: number
          low_count: number
          medium_count: number
          total_vulnerabilities: number
        }
        Update: {
          critical_count?: number
          cumulative_exploitability?: number
          high_count?: number
          host?: string
          id?: number
          low_count?: number
          medium_count?: number
          total_vulnerabilities?: number
        }
        Relationships: []
      }
      mttm_by_severity: {
        Row: {
          average_mttm_days: number
          id: number
          risk_severity: string
          vulnerability_count: number
        }
        Insert: {
          average_mttm_days: number
          id?: number
          risk_severity: string
          vulnerability_count: number
        }
        Update: {
          average_mttm_days?: number
          id?: number
          risk_severity?: string
          vulnerability_count?: number
        }
        Relationships: []
      }
      patch_availability: {
        Row: {
          id: number
          risk_severity: string
          total_patches_to_be_applied: number
          vulnerabilities_with_patch_available: number
          vulnerabilities_with_patch_not_available: number
        }
        Insert: {
          id?: number
          risk_severity: string
          total_patches_to_be_applied: number
          vulnerabilities_with_patch_available: number
          vulnerabilities_with_patch_not_available: number
        }
        Update: {
          id?: number
          risk_severity?: string
          total_patches_to_be_applied?: number
          vulnerabilities_with_patch_available?: number
          vulnerabilities_with_patch_not_available?: number
        }
        Relationships: []
      }
      patch_details: {
        Row: {
          cve: string
          id: number
          patch_status: string
          source: string | null
          tags: string | null
          url: string | null
        }
        Insert: {
          cve: string
          id?: number
          patch_status: string
          source?: string | null
          tags?: string | null
          url?: string | null
        }
        Update: {
          cve?: string
          id?: number
          patch_status?: string
          source?: string | null
          tags?: string | null
          url?: string | null
        }
        Relationships: []
      }
      prioritization_insights: {
        Row: {
          critical_count: number
          high_count: number
          id: number
          low_count: number
          medium_count: number
          metric: string
        }
        Insert: {
          critical_count: number
          high_count: number
          id?: number
          low_count: number
          medium_count: number
          metric: string
        }
        Update: {
          critical_count?: number
          high_count?: number
          id?: number
          low_count?: number
          medium_count?: number
          metric?: string
        }
        Relationships: []
      }
      remediation_insights: {
        Row: {
          id: number
          observations_impacted: number
          percentage: number | null
          remediation: string
        }
        Insert: {
          id?: number
          observations_impacted: number
          percentage?: number | null
          remediation: string
        }
        Update: {
          id?: number
          observations_impacted?: number
          percentage?: number | null
          remediation?: string
        }
        Relationships: []
      }
      remediation_to_unique_vulnerabilities: {
        Row: {
          id: number
          remediation: string
          risk_rating: string
          unique_vulnerability: string
        }
        Insert: {
          id?: number
          remediation: string
          risk_rating: string
          unique_vulnerability: string
        }
        Update: {
          id?: number
          remediation?: string
          risk_rating?: string
          unique_vulnerability?: string
        }
        Relationships: []
      }
      risk_summary: {
        Row: {
          count: number
          created_at: string
          severity: string
          vulnerabilities_with_cve: number
        }
        Insert: {
          count: number
          created_at?: string
          severity: string
          vulnerabilities_with_cve: number
        }
        Update: {
          count?: number
          created_at?: string
          severity?: string
          vulnerabilities_with_cve?: number
        }
        Relationships: []
      }
      runs: {
        Row: {
          created_at: string
          id: number
          instance_id: number
          run_number: number
        }
        Insert: {
          created_at?: string
          id?: number
          instance_id: number
          run_number: number
        }
        Update: {
          created_at?: string
          id?: number
          instance_id?: number
          run_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "runs_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["id"]
          },
        ]
      }
      unique_assets: {
        Row: {
          asset_count: number
          assets_type: string
          id: number
        }
        Insert: {
          asset_count: number
          assets_type: string
          id?: number
        }
        Update: {
          asset_count?: number
          assets_type?: string
          id?: number
        }
        Relationships: []
      }
      unique_vulnerabilities: {
        Row: {
          affected_hosts: number
          cve: string | null
          cvss_score: string | null
          epss_score: string | null
          instance_count: number
          kev_listed: boolean
          remediation: string | null
          severity: string
          vulnerability_name: string
        }
        Insert: {
          affected_hosts: number
          cve?: string | null
          cvss_score?: string | null
          epss_score?: string | null
          instance_count: number
          kev_listed: boolean
          remediation?: string | null
          severity: string
          vulnerability_name: string
        }
        Update: {
          affected_hosts?: number
          cve?: string | null
          cvss_score?: string | null
          epss_score?: string | null
          instance_count?: number
          kev_listed?: boolean
          remediation?: string | null
          severity?: string
          vulnerability_name?: string
        }
        Relationships: []
      }
      vulnerability_clustering: {
        Row: {
          affected_hosts: number
          common_vulnerabilities: string | null
          critical: number
          cve_count: number
          high: number
          kev_count: number
          low: number
          medium: number
          product_service: string
          total_vulnerabilities: number
        }
        Insert: {
          affected_hosts: number
          common_vulnerabilities?: string | null
          critical: number
          cve_count: number
          high: number
          kev_count: number
          low: number
          medium: number
          product_service: string
          total_vulnerabilities: number
        }
        Update: {
          affected_hosts?: number
          common_vulnerabilities?: string | null
          critical?: number
          cve_count?: number
          high?: number
          kev_count?: number
          low?: number
          medium?: number
          product_service?: string
          total_vulnerabilities?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
