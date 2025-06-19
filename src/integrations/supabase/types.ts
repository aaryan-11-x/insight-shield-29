import { UUID } from "crypto"

export type Json =
  | string
  | number
  | boolean
  | null
  | UUID
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
          instance_id: string
          run_id: string
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
          instance_id: string
          run_id: string
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
          instance_id?: string
          run_id?: string
          name?: string
          plugin_id?: number
          risk?: string
        }
        Relationships: [
          {
            foreignKeyName: "ageing_of_vulnerability_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "ageing_of_vulnerability_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      cve_summary: {
        Row: {
          count: number | null
          cve: string
          description: string | null
          hosts: string | null
          instance_id: string
          run_id: string
          name: string | null
          severity: string | null
          solutions: string | null
        }
        Insert: {
          count?: number | null
          cve: string
          description?: string | null
          hosts?: string | null
          instance_id: string
          run_id: string
          name?: string | null
          severity?: string | null
          solutions?: string | null
        }
        Update: {
          count?: number | null
          cve?: string
          description?: string | null
          hosts?: string | null
          instance_id?: string
          run_id?: string
          name?: string | null
          severity?: string | null
          solutions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cve_summary_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "cve_summary_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      eol_components: {
        Row: {
          created_at: string
          software: string
          software_extraction_status: string
          instance_id: string
          run_id: string
          plugin_id: number
          risk: string
        }
        Insert: {
          created_at?: string
          software: string
          software_extraction_status: string
          instance_id: string
          run_id: string
          plugin_id: number
          risk: string
        }
        Update: {
          created_at?: string
          software?: string
          software_extraction_status?: string
          instance_id?: string
          run_id?: string
          plugin_id?: number
          risk?: string
        }
        Relationships: [
          {
            foreignKeyName: "eol_components_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "eol_components_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      eol_ip: {
        Row: {
          instance_id: string
          run_id: string
          ip_address: unknown
          risk_level: string
          unique_eol_vulnerabilities: number
        }
        Insert: {
          instance_id: string
          run_id: string
          ip_address: unknown
          risk_level: string
          unique_eol_vulnerabilities: number
        }
        Update: {
          instance_id?: string
          run_id?: string
          ip_address?: unknown
          risk_level?: string
          unique_eol_vulnerabilities?: number
        }
        Relationships: [
          {
            foreignKeyName: "eol_ip_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "eol_ip_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
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
          instance_id: string
          run_id: string
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
          instance_id: string
          run_id: string
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
          instance_id?: string
          run_id?: string
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
        Relationships: [
          {
            foreignKeyName: "eol_summary_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "eol_summary_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      eol_versions: {
        Row: {
          unique_vulnerability_count: number
          instance_id: string
          run_id: string
          software_type: string
          version: string
        }
        Insert: {
          unique_vulnerability_count: number
          instance_id: string
          run_id: string
          software_type: string
          version: string
        }
        Update: {
          unique_vulnerability_count?: number
          instance_id?: string
          run_id?: string
          software_type?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "eol_versions_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "eol_versions_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
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
          instance_id: string
          run_id: string
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
          instance_id: string
          run_id: string
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
          instance_id?: string
          run_id?: string
          kev_listed?: boolean | null
          name?: string | null
          plugin_id?: number
          plugin_output?: string | null
          risk?: string | null
          vpr_category?: string | null
          vpr_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exploitability_scoring_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "exploitability_scoring_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      host_summary: {
        Row: {
          critical: number
          high: number
          host: string
          instance_id: string
          run_id: string
          low: number
          medium: number
          vulnerabilities_with_cve: number
          vulnerability_count: number
        }
        Insert: {
          critical: number
          high: number
          host: string
          instance_id: string
          run_id: string
          low: number
          medium: number
          vulnerabilities_with_cve: number
          vulnerability_count: number
        }
        Update: {
          critical?: number
          high?: number
          host?: string
          instance_id?: string
          run_id?: string
          low?: number
          medium?: number
          vulnerabilities_with_cve?: number
          vulnerability_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "host_summary_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "host_summary_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      instances: {
        Row: {
          created_at: string
          description: string | null
          id: number
          instance_id: string
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          instance_id: string
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          instance_id?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      ip_insights: {
        Row: {
          critical: number
          exploitability_score: number
          high: number
          hostname: string | null
          instance_id: string
          run_id: string
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
          instance_id: string
          run_id: string
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
          instance_id?: string
          run_id?: string
          ip_address?: unknown
          kev_count?: number
          last_scan_date?: string | null
          low?: number
          medium?: number
          most_common_category?: string | null
          total_vulnerabilities?: number
        }
        Relationships: [
          {
            foreignKeyName: "ip_insights_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "ip_insights_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      most_exploitable: {
        Row: {
          critical_count: number
          cumulative_exploitability: number
          high_count: number
          host: string
          id: number
          instance_id: string
          run_id: string
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
          instance_id: string
          run_id: string
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
          instance_id?: string
          run_id?: string
          low_count?: number
          medium_count?: number
          total_vulnerabilities?: number
        }
        Relationships: [
          {
            foreignKeyName: "most_exploitable_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "most_exploitable_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      mttm_by_severity: {
        Row: {
          average_mttm_days: number
          id: number
          instance_id: string
          run_id: string
          risk_severity: string
          vulnerability_count: number
        }
        Insert: {
          average_mttm_days: number
          id?: number
          instance_id: string
          run_id: string
          risk_severity: string
          vulnerability_count: number
        }
        Update: {
          average_mttm_days?: number
          id?: number
          instance_id?: string
          run_id?: string
          risk_severity?: string
          vulnerability_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "mttm_by_severity_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "mttm_by_severity_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      patch_availability: {
        Row: {
          id: number
          instance_id: string
          run_id: string
          risk_severity: string
          total_patches_to_be_applied: number
          vulnerabilities_with_patch_available: number
          vulnerabilities_with_patch_not_available: number
        }
        Insert: {
          id?: number
          instance_id: string
          run_id: string
          risk_severity: string
          total_patches_to_be_applied: number
          vulnerabilities_with_patch_available: number
          vulnerabilities_with_patch_not_available: number
        }
        Update: {
          id?: number
          instance_id?: string
          run_id?: string
          risk_severity?: string
          total_patches_to_be_applied?: number
          vulnerabilities_with_patch_available?: number
          vulnerabilities_with_patch_not_available?: number
        }
        Relationships: [
          {
            foreignKeyName: "patch_availability_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "patch_availability_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      patch_details: {
        Row: {
          cve: string
          id: number
          instance_id: string
          run_id: string
          patch_status: string
          source: string | null
          tags: string | null
          url: string | null
        }
        Insert: {
          cve: string
          id?: number
          instance_id: string
          run_id: string
          patch_status: string
          source?: string | null
          tags?: string | null
          url?: string | null
        }
        Update: {
          cve?: string
          id?: number
          instance_id?: string
          run_id?: string
          patch_status?: string
          source?: string | null
          tags?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patch_details_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "patch_details_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      prioritization_insights: {
        Row: {
          critical_count: number
          high_count: number
          id: number
          instance_id: string
          run_id: string
          low_count: number
          medium_count: number
          metric: string
        }
        Insert: {
          critical_count: number
          high_count: number
          id?: number
          instance_id: string
          run_id: string
          low_count: number
          medium_count: number
          metric: string
        }
        Update: {
          critical_count?: number
          high_count?: number
          id?: number
          instance_id?: string
          run_id?: string
          low_count?: number
          medium_count?: number
          metric?: string
        }
        Relationships: [
          {
            foreignKeyName: "prioritization_insights_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "prioritization_insights_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      remediation_insights: {
        Row: {
          rank: number;
          remediation: string;
          critical: number;
          high: number;
          low: number;
          medium: number;
          none: number;
          total_vulnerabilities_closed: number;
          instance_id: string;
          run_id: string;
        }
        Insert: {
          rank: number;
          remediation: string;
          critical: number;
          high: number;
          low: number;
          medium: number;
          none: number;
          total_vulnerabilities_closed: number;
          instance_id: string;
          run_id: string;
        }
        Update: {
          rank?: number;
          remediation?: string;
          critical?: number;
          high?: number;
          low?: number;
          medium?: number;
          none?: number;
          total_vulnerabilties_closed?: number;
          instance_id?: string;
          run_id?: string;
        }
        Relationships: [
          {
            foreignKeyName: "remediation_insights_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "remediation_insights_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      remediation_to_unique_vulnerabilities: {
        Row: {
          id: number
          instance_id: string
          run_id: string
          remediation: string
          risk_rating: string
          unique_vulnerability: string
        }
        Insert: {
          id?: number
          instance_id: string
          run_id: string
          remediation: string
          risk_rating: string
          unique_vulnerability: string
        }
        Update: {
          id?: number
          instance_id?: string
          run_id?: string
          remediation?: string
          risk_rating?: string
          unique_vulnerability?: string
        }
        Relationships: [
          {
            foreignKeyName: "remediation_to_unique_vulnerabilities_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "remediation_to_unique_vulnerabilities_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      risk_summary: {
        Row: {
          count: number
          instance_id: string
          run_id: string
          severity: string
          vulnerabilities_with_cve: number
        }
        Insert: {
          count: number
          instance_id: string
          run_id: string
          severity: string
          vulnerabilities_with_cve: number
        }
        Update: {
          count?: number
          instance_id?: string
          run_id?: string
          severity?: string
          vulnerabilities_with_cve?: number
        }
        Relationships: [
          {
            foreignKeyName: "risk_summary_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "risk_summary_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      unique_assets: {
        Row: {
          count: number
          assets_type: string
          id: number
          instance_id: string
          run_id: string
        }
        Insert: {
          count: number
          assets_type: string
          id?: number
          instance_id: string
          run_id: string
        }
        Update: {
          count?: number
          assets_type?: string
          id?: number
          instance_id?: string
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unique_assets_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "unique_assets_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      unique_vulnerabilities: {
        Row: {
          affected_hosts: number
          cve: string | null
          cvss_score: string | null
          epss_score: string | null
          instance_count: number
          instance_id: string
          run_id: string
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
          instance_id: string
          run_id: string
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
          instance_id?: string
          run_id?: string
          kev_listed?: boolean
          remediation?: string | null
          severity?: string
          vulnerability_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "unique_vulnerabilities_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "unique_vulnerabilities_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      vulnerability_clustering: {
        Row: {
          affected_hosts: number
          common_vulnerabilities: string | null
          critical: number
          cve_count: number
          high: number
          instance_id: string
          run_id: string
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
          instance_id: string
          run_id: string
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
          instance_id?: string
          run_id?: string
          kev_count?: number
          low?: number
          medium?: number
          product_service?: string
          total_vulnerabilities?: number
        }
        Relationships: [
          {
            foreignKeyName: "vulnerability_clustering_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "vulnerability_clustering_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          }
        ]
      }
      runs: {
        Row: {
          id: number
          run_id: string
          instance_id: string
          scan_date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          run_id?: string
          instance_id: string
          scan_date?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: number
          run_id?: string
          instance_id?: string
          scan_date?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "runs_instance_id_fkey"
            columns: ["instance_id"]
            referencedRelation: "instances"
            referencedColumns: ["instance_id"]
          }
        ]
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
