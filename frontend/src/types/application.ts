import Student from "@/types/student";
import Major from "@/types/major";
import University from "@/types/university";

export default class Application {
  id!: number;
  Student!: Student;
  Major!: Major;
  University!: University;
  status!: string;
  informant!: string;
  dateInformed!: string | null;
  comment!: string;
}

export interface ApplicationTableRow {
  id: number,
  studentId: string,
  majorName: string,
  category: string[],
  uniName: string,
  country: string,
  status: string,
}
