import config from "@/config";
import Major from "@/types/major";
import University from "@/types/university";

let universitiesCache: University[] | null = null;
let majorsCache: Map<number, Major[]> = new Map();

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
  async getMajors(uniId: number = -1, noCache = false): Promise<Major[]> {
    if (uniId != -1 && majorsCache.has(uniId) && !noCache) {
      return majorsCache.get(uniId) as Major[];
    }
    const queryString = uniId == -1 ? "" : `?uniId=${uniId}`;
    const res: Major[] = await (await fetch(`${config.api}/api/majors${queryString}`, {
      credentials: "include",
    })).json();
    if (uniId != -1) {
      majorsCache.set(uniId, res);
    }
    return res;
  },
  async sendPost(url: string, data: object) {
    return (await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data)
    })).json();
  },
  async checkAdmin(): Promise<boolean> {
    const applications = await (await fetch(`${config.api}/api/applications`, {
      credentials: "include",
    })).json();
    return applications.data[0].comment !== undefined
  },
  async getUniversities(): Promise<University[]> {
    if (universitiesCache != null) {
      return universitiesCache;
    }
    universitiesCache = await (await fetch(`${config.api}/api/universities`, {
      credentials: "include",
    })).json();
    if (universitiesCache == null) {
      throw "Universities cannot be null";
    }
    return universitiesCache;
  }
}
