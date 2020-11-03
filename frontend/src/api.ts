import config from "@/config";
import Major from "@/types/major";

export default {
  async getSummary(fields: string[] = []) {
    let queryString = "full=true";
    for (let i = 0; i < fields.length; i++) {
      queryString += `&include[${i}]=${fields[i]}`
    }

    return (await fetch(`${config.api}/api/summary?${queryString}`, {
      credentials: "include",
    })).json()
  },
  async getMajors(uniId: number = -1): Promise<Major[]> {
    const queryString = uniId == -1 ? "" : `?uniId=${uniId}`;
    return (await fetch(`${config.api}/api/majors${queryString}`, {
      credentials: "include",
    })).json()
  },
  async sendPost(url: string, data: object){
    return (await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data)
      })).json();
  }
}
