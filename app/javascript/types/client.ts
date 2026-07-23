export interface ClientSummary {
  id: number
  name: string
  instagram_handle: string | null
  last_visit: string
  total_spent: number
  visit_count: number
}

export interface ClientOption {
  id: number
  name: string
}
