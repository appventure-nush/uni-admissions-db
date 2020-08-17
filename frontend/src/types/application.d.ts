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
