import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    tasks: [{ _id: "1", subject: "Follow up with client", status: "Open", due: "2025-12-05", priority: "High" }],
    meetings: [{ _id: "1", name: "Q4 Planning", from: "2025-12-10T10:00:00Z", to: "2025-12-10T11:00:00Z", venue: "Zoom" }],
    leads: [{ _id: "1", firstName: "Tom", lastName: "Brown", phone: "+15550999", leadOwner: "You" }],
    deals: [{ _id: "1", name: "Enterprise Deal", company: "Acme Corp", stage: "Negotiation", dealValue: 50000 }]
  });
}