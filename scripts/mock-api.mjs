/**
 * Local stand-in for jobpilot-backend so the UI can be reviewed without Java.
 * Field names match the Spring DTOs on `dev`.
 */
import http from "node:http";

const PORT = Number(process.env.MOCK_API_PORT || 8080);
const TOKEN = "mock.jwt.jobpilot";

const user = {
  id: "11111111-1111-1111-1111-111111111111",
  email: "parth@jobpilot.dev",
  name: "Parth",
  createdAt: "2026-01-12T10:00:00Z",
};

const applications = [
  {
    id: "aaaaaaaa-0001-0000-0000-000000000001",
    userId: user.id,
    company: "Linear",
    jobTitle: "Staff Frontend Engineer",
    jobUrl: "https://linear.app/careers",
    location: "Remote",
    employmentType: "FULL_TIME",
    source: "COMPANY_WEBSITE",
    status: "INTERVIEW",
    salaryMin: 210000,
    salaryMax: 260000,
    jobDescription:
      "TypeScript, React, system design, and a taste for product craft. Kafka optional.",
    notes: "Hiring manager liked the Sprinklr RN work.",
    appliedAt: "2026-08-02T15:00:00Z",
    resumeId: "bbbbbbbb-0001-0000-0000-000000000001",
    createdAt: "2026-07-20T12:00:00Z",
    updatedAt: "2026-09-01T18:00:00Z",
    version: 3,
  },
  {
    id: "aaaaaaaa-0001-0000-0000-000000000002",
    userId: user.id,
    company: "Vercel",
    jobTitle: "Product Engineer",
    jobUrl: "https://vercel.com/careers",
    location: "San Francisco",
    employmentType: "FULL_TIME",
    source: "LINKEDIN",
    status: "APPLIED",
    salaryMin: 180000,
    salaryMax: 230000,
    jobDescription: "React, TypeScript, Next.js, design systems, Docker.",
    notes: "Submitted last week.",
    appliedAt: "2026-09-04T09:30:00Z",
    resumeId: null,
    createdAt: "2026-09-01T09:00:00Z",
    updatedAt: "2026-09-04T09:30:00Z",
    version: 1,
  },
  {
    id: "aaaaaaaa-0001-0000-0000-000000000003",
    userId: user.id,
    company: "Stripe",
    jobTitle: "Software Engineer",
    jobUrl: null,
    location: "NYC",
    employmentType: "FULL_TIME",
    source: "REFERRAL",
    status: "SAVED",
    salaryMin: 190000,
    salaryMax: 250000,
    jobDescription: "Java, Kafka, PostgreSQL, Redis, AWS.",
    notes: "Need to tailor resume.",
    appliedAt: null,
    resumeId: null,
    createdAt: "2026-08-18T11:00:00Z",
    updatedAt: "2026-08-18T11:00:00Z",
    version: 0,
  },
];

let resumes = [
  {
    id: "bbbbbbbb-0001-0000-0000-000000000001",
    userId: user.id,
    name: "Frontend product",
    versionLabel: "V3",
    description: "Sprinklr + systems narrative",
    fileUrl: "https://files.example/parth-frontend.pdf",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-08-12T00:00:00Z",
  },
];

let skills = [
  { id: "s1", userId: user.id, name: "typescript", createdAt: "2026-01-01T00:00:00Z" },
  { id: "s2", userId: user.id, name: "react", createdAt: "2026-01-01T00:00:00Z" },
  { id: "s3", userId: user.id, name: "java", createdAt: "2026-01-01T00:00:00Z" },
];

let reminders = [
  {
    id: "r1",
    userId: user.id,
    applicationId: applications[1].id,
    type: "FOLLOW_UP",
    title: "Follow up with Vercel recruiter",
    description: "Polite check-in if no reply by Friday",
    scheduledAt: "2026-09-18T15:00:00Z",
    status: "PENDING",
    createdAt: "2026-09-10T12:00:00Z",
    completedAt: null,
  },
];

let notifications = [
  {
    id: "n1",
    userId: user.id,
    reminderId: "r0",
    type: "REMINDER",
    title: "Follow up with recruiter",
    message: "Linear interview prep reminder fired.",
    status: "SENT",
    createdAt: "2026-09-12T08:00:00Z",
    sentAt: "2026-09-12T08:00:00Z",
    retryCount: 0,
  },
];

const interviews = {
  [applications[0].id]: [
    {
      id: "i1",
      applicationId: applications[0].id,
      roundNumber: 1,
      type: "TECHNICAL",
      status: "COMPLETED",
      scheduledAt: "2026-08-20T16:00:00Z",
      interviewer: "Ada",
      meetingLink: "https://meet.example/r1",
      notes: null,
      feedback: "Strong product sense",
      createdAt: "2026-08-10T00:00:00Z",
      updatedAt: "2026-08-20T18:00:00Z",
      version: 1,
    },
    {
      id: "i2",
      applicationId: applications[0].id,
      roundNumber: 2,
      type: "SYSTEM_DESIGN",
      status: "SCHEDULED",
      scheduledAt: "2026-09-16T17:00:00Z",
      interviewer: "Grace",
      meetingLink: "https://meet.example/r2",
      notes: "Prep feed fanout",
      feedback: null,
      createdAt: "2026-09-02T00:00:00Z",
      updatedAt: "2026-09-02T00:00:00Z",
      version: 0,
    },
  ],
};

function page(content, number = 0, size = 20) {
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    size,
    number,
    first: true,
    last: true,
    empty: content.length === 0,
    numberOfElements: content.length,
  };
}

function json(res, status, body, extra = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": extra.origin || "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Expose-Headers": "Retry-After",
    ...extra.headers,
  };
  res.writeHead(status, headers);
  res.end(body === undefined ? "" : JSON.stringify(body));
}

function error(res, status, message, path, extra) {
  json(
    res,
    status,
    {
      timestamp: new Date().toISOString(),
      status,
      error: http.STATUS_CODES[status] || "Error",
      message,
      path,
    },
    extra,
  );
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      resolve(raw ? JSON.parse(raw) : {});
    });
  });
}

function authorized(req) {
  return (req.headers.authorization || "") === `Bearer ${TOKEN}`;
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "http://localhost:5173";
  const url = new URL(req.url || "/", "http://localhost");
  const path = url.pathname;

  if (req.method === "OPTIONS") {
    json(res, 204, undefined, { origin });
    return;
  }

  try {
    if (req.method === "POST" && path === "/api/auth/login") {
      const body = await readBody(req);
      if (body.email === "locked@example.com") {
        error(res, 429, "Rate limit exceeded", path, {
          origin,
          headers: { "Retry-After": "30" },
        });
        return;
      }
      if (body.password !== "password123") {
        error(res, 401, "Bad credentials", path, { origin });
        return;
      }
      json(
        res,
        200,
        { accessToken: TOKEN, tokenType: "Bearer", expiresInMs: 86400000, user },
        { origin },
      );
      return;
    }

    if (req.method === "POST" && path === "/api/auth/register") {
      const body = await readBody(req);
      if (body.email === user.email) {
        error(res, 409, "Email already registered", path, { origin });
        return;
      }
      json(
        res,
        201,
        {
          accessToken: TOKEN,
          tokenType: "Bearer",
          expiresInMs: 86400000,
          user: { ...user, email: body.email, name: body.name ?? null },
        },
        { origin },
      );
      return;
    }

    if (!authorized(req)) {
      error(res, 401, "Missing or invalid token", path, { origin });
      return;
    }

    if (req.method === "GET" && path === "/api/users/me") {
      json(res, 200, user, { origin });
      return;
    }

    if (req.method === "GET" && path === "/api/applications") {
      const q = (url.searchParams.get("q") || "").toLowerCase();
      const status = url.searchParams.get("status");
      let rows = applications;
      if (status) rows = rows.filter((a) => a.status === status);
      if (q) {
        rows = rows.filter((a) =>
          `${a.company} ${a.jobTitle} ${a.location} ${a.notes}`.toLowerCase().includes(q),
        );
      }
      json(res, 200, page(rows), { origin });
      return;
    }

    const appMatch = path.match(/^\/api\/applications\/([^/]+)$/);
    if (appMatch && req.method === "GET") {
      const app = applications.find((a) => a.id === appMatch[1]);
      if (!app) return error(res, 404, "Application not found", path, { origin });
      json(res, 200, app, { origin });
      return;
    }
    if (req.method === "POST" && path === "/api/applications") {
      const body = await readBody(req);
      const created = {
        id: crypto.randomUUID(),
        userId: user.id,
        company: body.company,
        jobTitle: body.jobTitle,
        jobUrl: body.jobUrl ?? null,
        location: body.location ?? null,
        employmentType: body.employmentType ?? null,
        source: body.source ?? null,
        status: body.status ?? "SAVED",
        salaryMin: body.salaryMin ?? null,
        salaryMax: body.salaryMax ?? null,
        jobDescription: body.jobDescription ?? null,
        notes: body.notes ?? null,
        appliedAt: body.appliedAt ?? null,
        resumeId: body.resumeId ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 0,
      };
      applications.unshift(created);
      json(res, 201, created, { origin });
      return;
    }
    if (appMatch && req.method === "PATCH") {
      const app = applications.find((a) => a.id === appMatch[1]);
      if (!app) return error(res, 404, "Application not found", path, { origin });
      const body = await readBody(req);
      if (body.version !== app.version) {
        return error(res, 409, "Stale version", path, { origin });
      }
      Object.assign(app, {
        ...body,
        version: app.version + 1,
        updatedAt: new Date().toISOString(),
      });
      json(res, 200, app, { origin });
      return;
    }
    if (appMatch && req.method === "DELETE") {
      const idx = applications.findIndex((a) => a.id === appMatch[1]);
      if (idx < 0) return error(res, 404, "Application not found", path, { origin });
      applications.splice(idx, 1);
      json(res, 204, undefined, { origin });
      return;
    }

    const matchPath = path.match(/^\/api\/applications\/([^/]+)\/(match|analyze|recommendation|interviews)$/);
    if (matchPath) {
      const [, id, action] = matchPath;
      const app = applications.find((a) => a.id === id);
      if (!app) return error(res, 404, "Application not found", path, { origin });
      if (action === "match" || (action === "analyze" && req.method === "POST")) {
        json(
          res,
          200,
          {
            score: 67,
            matchedSkills: ["react", "typescript"],
            missingSkills: ["kafka"],
            requiredSkills: ["react", "typescript", "kafka"],
          },
          { origin },
        );
        return;
      }
      if (action === "recommendation") {
        json(
          res,
          200,
          {
            action: "PREPARE_FOR_INTERVIEW",
            priority: "HIGH",
            title: "Prepare for system design",
            reason: "Scheduled interview within 2 days",
            applicationId: id,
          },
          { origin },
        );
        return;
      }
      if (action === "interviews" && req.method === "GET") {
        json(res, 200, page(interviews[id] || []), { origin });
        return;
      }
      if (action === "interviews" && req.method === "POST") {
        const body = await readBody(req);
        const created = {
          id: crypto.randomUUID(),
          applicationId: id,
          roundNumber: body.roundNumber,
          type: body.type,
          status: "SCHEDULED",
          scheduledAt: body.scheduledAt,
          interviewer: body.interviewer ?? null,
          meetingLink: body.meetingLink ?? null,
          notes: body.notes ?? null,
          feedback: body.feedback ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 0,
        };
        interviews[id] = [...(interviews[id] || []), created];
        json(res, 201, created, { origin });
        return;
      }
    }

    if (req.method === "GET" && path === "/api/recommendations") {
      json(
        res,
        200,
        [
          {
            action: "PREPARE_FOR_INTERVIEW",
            priority: "HIGH",
            title: "Prepare for Linear system design",
            reason: "Interview scheduled within 2 days",
            applicationId: applications[0].id,
          },
          {
            action: "FOLLOW_UP",
            priority: "HIGH",
            title: "Follow up with Vercel",
            reason: "No application update for 8 days",
            applicationId: applications[1].id,
          },
          {
            action: "APPLY_OR_ARCHIVE",
            priority: "MEDIUM",
            title: "Apply or archive Stripe",
            reason: "Saved and idle for 14+ days",
            applicationId: applications[2].id,
          },
        ],
        { origin },
      );
      return;
    }

    if (req.method === "GET" && path === "/api/resumes") {
      json(res, 200, resumes, { origin });
      return;
    }
    if (req.method === "POST" && path === "/api/resumes") {
      const body = await readBody(req);
      const created = {
        id: crypto.randomUUID(),
        userId: user.id,
        name: body.name,
        versionLabel: body.versionLabel ?? null,
        description: body.description ?? null,
        fileUrl: body.fileUrl ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resumes = [created, ...resumes];
      json(res, 201, created, { origin });
      return;
    }

    if (req.method === "GET" && path === "/api/skills") {
      json(res, 200, skills, { origin });
      return;
    }
    if (req.method === "POST" && path === "/api/skills") {
      const body = await readBody(req);
      if (skills.some((s) => s.name === String(body.name).trim().toLowerCase())) {
        return error(res, 409, "Skill already exists", path, { origin });
      }
      const created = {
        id: crypto.randomUUID(),
        userId: user.id,
        name: String(body.name).trim().toLowerCase(),
        createdAt: new Date().toISOString(),
      };
      skills = [...skills, created].sort((a, b) => a.name.localeCompare(b.name));
      json(res, 201, created, { origin });
      return;
    }
    const skillDel = path.match(/^\/api\/skills\/([^/]+)$/);
    if (skillDel && req.method === "DELETE") {
      skills = skills.filter((s) => s.id !== skillDel[1]);
      json(res, 204, undefined, { origin });
      return;
    }

    if (req.method === "POST" && path === "/api/job-analysis/preview") {
      const body = await readBody(req);
      const text = String(body.jobDescription || "").toLowerCase();
      const dict = ["java", "react", "typescript", "kafka", "postgresql", "redis", "docker"];
      const required = dict.filter((s) => text.includes(s));
      const have = new Set(skills.map((s) => s.name));
      const matched = required.filter((s) => have.has(s));
      const missing = required.filter((s) => !have.has(s));
      const score = required.length === 0 ? 100 : Math.round((100 * matched.length) / required.length);
      json(res, 200, { score, matchedSkills: matched, missingSkills: missing, requiredSkills: required }, { origin });
      return;
    }

    if (req.method === "GET" && path === "/api/reminders") {
      const status = url.searchParams.get("status");
      const rows = status ? reminders.filter((r) => r.status === status) : reminders;
      json(res, 200, page(rows), { origin });
      return;
    }
    if (req.method === "POST" && path === "/api/reminders") {
      const body = await readBody(req);
      const created = {
        id: crypto.randomUUID(),
        userId: user.id,
        applicationId: body.applicationId ?? null,
        type: body.type,
        title: body.title,
        description: body.description ?? null,
        scheduledAt: body.scheduledAt,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      reminders = [created, ...reminders];
      json(res, 201, created, { origin });
      return;
    }
    const remPatch = path.match(/^\/api\/reminders\/([^/]+)$/);
    if (remPatch && req.method === "PATCH") {
      const body = await readBody(req);
      const item = reminders.find((r) => r.id === remPatch[1]);
      if (!item) return error(res, 404, "Reminder not found", path, { origin });
      Object.assign(item, body);
      json(res, 200, item, { origin });
      return;
    }

    if (req.method === "GET" && path === "/api/notifications") {
      json(res, 200, page(notifications), { origin });
      return;
    }
    const noteRead = path.match(/^\/api\/notifications\/([^/]+)\/read$/);
    if (noteRead && req.method === "PATCH") {
      const item = notifications.find((n) => n.id === noteRead[1]);
      if (!item) return error(res, 404, "Notification not found", path, { origin });
      item.status = "READ";
      json(res, 200, item, { origin });
      return;
    }

    if (req.method === "GET" && path === "/api/analytics/summary") {
      json(
        res,
        200,
        {
          totalApplications: applications.length,
          countsByStatus: [
            { status: "SAVED", count: 1 },
            { status: "APPLIED", count: 1 },
            { status: "OA", count: 0 },
            { status: "INTERVIEW", count: 1 },
            { status: "OFFER", count: 0 },
            { status: "REJECTED", count: 0 },
            { status: "WITHDRAWN", count: 0 },
          ],
          interviewCount: 2,
          offerCount: 0,
          rejectedCount: 0,
          averageMatchScore: 67,
          activeApplications: applications.length,
        },
        { origin },
      );
      return;
    }
    if (req.method === "GET" && path === "/api/analytics/funnel") {
      json(
        res,
        200,
        {
          stages: [
            { status: "SAVED", count: 1, conversionFromPrevious: null },
            { status: "APPLIED", count: 1, conversionFromPrevious: 1 },
            { status: "OA", count: 0, conversionFromPrevious: 0 },
            { status: "INTERVIEW", count: 1, conversionFromPrevious: null },
            { status: "OFFER", count: 0, conversionFromPrevious: 0 },
          ],
          rejectedCount: 0,
          withdrawnCount: 0,
        },
        { origin },
      );
      return;
    }
    if (req.method === "GET" && path === "/api/analytics/timeline") {
      json(
        res,
        200,
        {
          bucket: url.searchParams.get("bucket") || "WEEK",
          from: "2026-06-22",
          to: "2026-09-13",
          points: [
            { periodStart: "2026-07-20", applicationsCreated: 1, applicationsApplied: 0 },
            { periodStart: "2026-08-17", applicationsCreated: 1, applicationsApplied: 1 },
            { periodStart: "2026-09-01", applicationsCreated: 1, applicationsApplied: 1 },
          ],
        },
        { origin },
      );
      return;
    }
    if (req.method === "GET" && path === "/api/analytics/skills-gap") {
      json(
        res,
        200,
        {
          missingSkills: [
            { skillName: "kafka", missingCount: 2 },
            { skillName: "postgresql", missingCount: 1 },
          ],
        },
        { origin },
      );
      return;
    }

    if (req.method === "PATCH" && path.startsWith("/api/interviews/")) {
      const id = path.split("/").pop();
      const body = await readBody(req);
      for (const list of Object.values(interviews)) {
        const found = list.find((i) => i.id === id);
        if (found) {
          Object.assign(found, body, { version: found.version + 1 });
          json(res, 200, found, { origin });
          return;
        }
      }
      return error(res, 404, "Interview not found", path, { origin });
    }

    error(res, 404, "Not found", path, { origin });
  } catch (err) {
    error(res, 500, err instanceof Error ? err.message : "Mock failure", path, { origin });
  }
});

server.listen(PORT, () => {
  console.log(`JobPilot mock API on http://localhost:${PORT}`);
  console.log("Login: parth@jobpilot.dev / password123");
});
