export interface Session {
  title: string
  description: string
  startTime: string
  endTime: string
}

export interface EventDetails {
  eventName: string
  eventDate: Date
  startTime: string
  endTime: string
  registrationStart: Date
  registrationEnd?: Date
  location: string
  description?: string
  backgroundImage?: string
  backgroundColor?: string // Added this line
  maxInvitations: number
}

export interface EventFormErrors {
  eventDate?: string
  registrationTime?: string
  endTime?: string
}

