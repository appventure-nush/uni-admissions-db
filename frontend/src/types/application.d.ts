export default interface Application {
  id: number,
  studentId: string,
  majorId: number,
  uniId: number,
  status: string,
  informant: string,
  dateInformed: string | null,
  comment: string
}

export interface ApplicationTableRow {
  id: number,
  studentId: string,
  majorName: string,
  category: string,
  uniName: string,
  country: string,
  status: string,
}
