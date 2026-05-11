export interface Database {
  public: {
    Tables: {
      webinars: {
        Row: {
          id: string
          title: string
          date: string
          zoom_link: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          zoom_link?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          zoom_link?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          description: string | null
          webinar_id: string
          is_interested: boolean
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          description?: string | null
          webinar_id: string
          is_interested?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          description?: string | null
          webinar_id?: string
          is_interested?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscribers_webinar_id_fkey'
            columns: ['webinar_id']
            isOneToOne: false
            referencedRelation: 'webinars'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Webinar = Database['public']['Tables']['webinars']['Row']
export type WebinarInsert = Database['public']['Tables']['webinars']['Insert']
export type WebinarUpdate = Database['public']['Tables']['webinars']['Update']

export type Subscriber = Database['public']['Tables']['subscribers']['Row']
export type SubscriberInsert = Database['public']['Tables']['subscribers']['Insert']
export type SubscriberUpdate = Database['public']['Tables']['subscribers']['Update']
