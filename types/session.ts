export interface Speaker {
  id: string
  name: string
  imageUrl?: string
}

export interface SessionLocation {
  centerName: string
  roomName: string
  streetAddress: string
  postalCode: string
  city: string
  country: string
}

export interface Session {
  id: string
  title: string
  introduction: string
  subtitle: string
  description: string
  categories: string[]
  location: SessionLocation
  startTime: string
  endTime: string
  maxAttendees: number
  speakers: Speaker[]
  imageUrl?: string
}

