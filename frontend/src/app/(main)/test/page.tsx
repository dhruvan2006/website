import { customFetch } from "@/api";

export default async function Test() {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/hello`)
  const data = await res.text()
  return <div>{data}</div>
}