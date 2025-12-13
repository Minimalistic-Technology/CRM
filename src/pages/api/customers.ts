import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This stops 304 spam in dev — you’ll see clean 200 OK
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const customers = [
    { id: "1", name: "Alexander Johnson", contact: { email: "alex@example.com", phone: "+15550101" }, status: "Active", lastActivity: "2025-12-02T10:30:00Z", dob: "1985-03-15" },
    { id: "2", name: "Maria Garcia", contact: { email: "maria@company.com", phone: "+15550102" }, status: "Lead", lastActivity: "2025-12-01T14:20:00Z", dob: "1990-07-22" },
    { id: "3", name: "James Chen", contact: { email: "james@tech.io", phone: "+15550103" }, status: "Active", lastActivity: "2025-11-30T09:15:00Z", dob: "1988-11-05" },
    { id: "4", name: "Sarah Williams", contact: { email: "sarah@startup.co", phone: "+15550104" }, status: "Inactive", lastActivity: "2025-10-10T11:00:00Z" }
  ];

  res.status(200).json(customers);
}