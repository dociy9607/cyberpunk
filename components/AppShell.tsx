"use client";

import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Cloud,
  Database,
  LogOut,
  Newspaper,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  UserPlus,
  Wrench,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CommerceNewsBrief, HealthRecord, SafeAccount, ServiceMode, UserRole } from "@/lib/types";

type View = "home" | "health" | "commerce" | "projects" | "ai" | "admin";
type Session = { username: string; role: UserRole };
type ApiError = Error & { status?: number };

const typeName: Record<string, string> = { meal: "吃饭", poop: "排泄", vomit: "呕吐", sleep: "睡觉" };
const mealName: Record<string, string> = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", night: "夜间加餐" };

const fallbackService: ServiceMode = {
  accountStore: "server-memory-fallback",
  healthRecordStore: "server-memory-fallback",
  persistentAccounts: false,
  persistentHealthRecords: false,
  supabaseConfigured: false,
};

const fallbackCommerceBrief: CommerceNewsBrief = {
  date: "loading",
  displayDate: "加载中",
  generatedAt: "",
  researchWindow: "正在读取每日跨境电商资讯。",
  observation: ["正在连接资讯接口。"],
  verificationNotes: ["资讯会保留原文链接和页面显示时间。"],
  items: [],
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function nowTime() {
  const date = new Date();
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function classifyMeal(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const value = hour * 60 + minute;
  if (value >= 240 && value < 660) return "breakfast";
  if (value >= 660 && value < 960) return "lunch";
  if (value >= 960 && value < 1380) return "dinner";
  return "night";
}

async function api<T>(path: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(path, {
      credentials: "include",
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || "request_failed") as ApiError;
      error.status = response.status;
      throw error;
    }
    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("request_timeout");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function userMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const status = (error as ApiError | undefined)?.status;
  if (message === "request_timeout" || message.includes("timeout")) return "请求超时，请稍后再试。";
  if (message === "account_exists") return "这个账号已经存在。";
  if (message === "weak_password") return "密码至少需要 8 位。";
  if (message === "invalid_username") return "账号至少需要 3 个字符。";
  if (status === 401) return "登录已过期，请重新登录。";
  if (status === 403) return "当前账号没有后台权限。";
  return `操作失败：${message}`;
}

function emptyRecord(username: string): HealthRecord {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    ownerUsername: username,
    type: "meal",
    date: toDateKey(new Date()),
    time: nowTime(),
    mealSlot: classifyMeal(nowTime()) as HealthRecord["mealSlot"],
    amount: "正常",
    food: "",
    poopType: "大便",
    status: "正常",
    note: "",
    content: "",
    createdAt: now,
    updatedAt: now,
  };
}

function compareDateTime(a: HealthRecord, b: HealthRecord) {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}

function describeRecord(record: HealthRecord) {
  if (record.type === "meal") return { title: `${mealName[record.mealSlot || ""] || "加餐"} · ${record.food || "未填写"}`, meta: `食量：${record.amount || "未填"}` };
  if (record.type === "poop") return { title: `${record.poopType || "排泄"} · ${record.status || "未填"}`, meta: record.note || "无备注" };
  if (record.type === "sleep") return { title: `睡觉 · ${record.amount || "未填"}`, meta: record.note || "无备注" };
  return { title: `呕吐 · ${record.amount || "未填"} · ${record.content || "未填呕吐物"}`, meta: record.note || "无备注" };
}

export function AppShell() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [service, setService] = useState<ServiceMode>(fallbackService);
  const [view, setView] = useState<View>("home");
  const [toast, setToast] = useState("");
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [recordDraft, setRecordDraft] = useState<HealthRecord>(() => emptyRecord("admin"));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<HealthRecord["type"]>("meal");
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [accounts, setAccounts] = useState<SafeAccount[]>([]);
  const [loginMessage, setLoginMessage] = useState("");
  const [commerceBriefs, setCommerceBriefs] = useState<CommerceNewsBrief[]>([fallbackCommerceBrief]);
  const [commerceLoading, setCommerceLoading] = useState(false);
  const [accountSubmitting, setAccountSubmitting] = useState(false);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  }

  async function refreshRecords() {
    const payload = await api<{ records: HealthRecord[]; service: ServiceMode }>("/api/health-records");
    setRecords(payload.records);
    setService(payload.service);
  }

  async function refreshAccounts() {
    if (session?.role !== "admin") return;
    const payload = await api<{ accounts: SafeAccount[]; service: ServiceMode }>("/api/accounts");
    setAccounts(payload.accounts);
    setService(payload.service);
  }

  async function refreshCommerceNews() {
    setCommerceLoading(true);
    try {
      const payload = await api<{ briefs: CommerceNewsBrief[] }>("/api/commerce-news");
      setCommerceBriefs(payload.briefs.length ? payload.briefs : [fallbackCommerceBrief]);
    } finally {
      setCommerceLoading(false);
    }
  }

  useEffect(() => {
    api<{ authenticated: boolean; user?: Session; service: ServiceMode }>("/api/session")
      .then((payload) => {
        setSession(payload.user || null);
        setService(payload.service);
        if (payload.user) setRecordDraft(emptyRecord(payload.user.username));
      })
      .catch(() => setSession(null))
      .finally(() => setBooting(false));
  }, []);

  useEffect(() => {
    if (!session) return;
    refreshRecords().catch(() => notify("养胃记录暂时无法同步"));
  }, [session]);

  useEffect(() => {
    if (view === "admin") refreshAccounts().catch(() => notify("账号后台暂时不可用"));
  }, [view, session]);

  useEffect(() => {
    if (view === "commerce") refreshCommerceNews().catch(() => notify("跨境资讯暂时不可用"));
  }, [view]);

  const statsByDay = useMemo(() => {
    const map = new Map<string, HealthRecord[]>();
    records.forEach((record) => {
      const items = map.get(record.date) || [];
      items.push(record);
      map.set(record.date, items);
    });
    return map;
  }, [records]);

  const selectedRecords = useMemo(() => {
    return [...(statsByDay.get(selectedDate) || [])].sort(compareDateTime);
  }, [selectedDate, statsByDay]);

  const filteredRecords = useMemo(() => {
    return [...records]
      .filter((record) => filterType === "all" || record.type === filterType)
      .filter((record) => !keyword || JSON.stringify(record).toLowerCase().includes(keyword.toLowerCase()))
      .sort((a, b) => compareDateTime(b, a));
  }, [records, filterType, keyword]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const payload = await api<{ user: Session; service: ServiceMode }>("/api/login", {
        method: "POST",
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      setSession(payload.user);
      setService(payload.service);
      setRecordDraft(emptyRecord(payload.user.username));
      setView("home");
      notify("登录成功");
    } catch {
      setLoginMessage("账号或密码不对");
    }
  }

  async function logout() {
    await api("/api/logout", { method: "POST" }).catch(() => undefined);
    setSession(null);
    setRecords([]);
  }

  function patchDraft(patch: Partial<HealthRecord>) {
    setRecordDraft((current) => ({ ...current, ...patch }));
  }

  function switchType(type: HealthRecord["type"]) {
    setActiveType(type);
    patchDraft({ type, mealSlot: type === "meal" ? classifyMeal(recordDraft.time) as HealthRecord["mealSlot"] : recordDraft.mealSlot });
  }

  async function saveRecord(event: FormEvent) {
    event.preventDefault();
    if (!recordDraft.date || !recordDraft.time) return notify("日期和时间必须填写");
    if (recordDraft.type === "meal" && !recordDraft.food?.trim()) return notify("吃饭记录请填写吃了什么");
    const payload = await api<{ record: HealthRecord; service: ServiceMode }>("/api/health-records", {
      method: "POST",
      body: JSON.stringify({ ...recordDraft, type: activeType, mealSlot: activeType === "meal" ? recordDraft.mealSlot || classifyMeal(recordDraft.time) : undefined }),
    });
    setService(payload.service);
    setRecords((current) => [payload.record, ...current.filter((item) => item.id !== payload.record.id)]);
    setSelectedDate(payload.record.date);
    setViewDate(parseDateKey(payload.record.date));
    setEditingId(null);
    setRecordDraft(emptyRecord(session?.username || "admin"));
    notify(payload.service.persistentHealthRecords ? "已保存到云端数据库" : "已临时保存，等待 Supabase 环境变量");
  }

  function editRecord(record: HealthRecord) {
    setEditingId(record.id);
    setActiveType(record.type);
    setRecordDraft(record);
  }

  async function removeRecord(id: string) {
    await api(`/api/health-records?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setRecords((current) => current.filter((record) => record.id !== id));
    notify("记录已删除");
  }

  function exportRecords() {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `qian-dashao-health-records-${toDateKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function importRecords(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const imported = JSON.parse(text) as HealthRecord[];
    for (const record of imported) {
      await api("/api/health-records", { method: "POST", body: JSON.stringify(record) });
    }
    await refreshRecords();
    notify("导入完成并同步到云端");
  }

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accountSubmitting) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setAccountSubmitting(true);
    try {
      await api("/api/accounts", {
        method: "POST",
        body: JSON.stringify({ username: form.get("username"), password: form.get("password"), role: form.get("role") }),
      });
      formElement.reset();
      await refreshAccounts();
      notify("账号已创建");
    } catch (error) {
      notify(userMessage(error));
    } finally {
      setAccountSubmitting(false);
    }
  }

  async function removeAccount(username: string) {
    await api(`/api/accounts?username=${encodeURIComponent(username)}`, { method: "DELETE" });
    await refreshAccounts();
    notify("账号已删除");
  }

  if (booting) {
    return <main className="loading-screen"><Sparkles /> 正在启动 dehviz.lol...</main>;
  }

  if (!session) {
    return (
      <main className="login-page">
        <section className="login-panel">
          <div className="login-copy">
            <span className="eyebrow">dehviz.lol platform</span>
            <h1>个人工具集，正在升级成长期产品平台。</h1>
            <p>登录后进入养胃记录、跨境资讯、项目展示和后台管理。新版本使用 Next.js 架构，养胃记录将通过 Postgres 云端同步。</p>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <h2>登录工作台</h2>
            <label>账号<input name="username" autoComplete="username" required /></label>
            <label>密码<input name="password" type="password" autoComplete="current-password" required /></label>
            <button className="primary-btn" type="submit"><ShieldCheck size={18} /> 登录</button>
            {loginMessage && <p className="form-error">{loginMessage}</p>}
            <p className="subtle">初始管理员账号仍为 admin。登录态使用 30 天安全 Cookie。</p>
          </form>
        </section>
      </main>
    );
  }

  const navItems: Array<[View, string, React.ReactNode]> = [
    ["home", "首页", <Sparkles key="home" size={17} />],
    ["health", "养胃记录", <Stethoscope key="health" size={17} />],
    ["commerce", "跨境资讯", <Newspaper key="commerce" size={17} />],
    ["projects", "项目简历", <BriefcaseBusiness key="projects" size={17} />],
    ["ai", "AI 产品", <Wrench key="ai" size={17} />],
    ["admin", "后台", <ShieldCheck key="admin" size={17} />],
  ];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <span>dehviz</span>
          <strong>工作台</strong>
        </div>
        <nav>
          {navItems.map(([key, label, icon]) => (
            <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>
              {icon}{label}
            </button>
          ))}
        </nav>
        <div className="session-card">
          <Database size={18} />
          <span>{service.persistentHealthRecords ? "Postgres 云端同步已就绪" : "等待 Supabase 环境变量"}</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Next.js + TypeScript migration</span>
            <h1>{session.username}，欢迎回来</h1>
          </div>
          <button className="ghost-btn" onClick={logout}><LogOut size={17} /> 退出</button>
        </header>

        {view === "home" && (
          <section className="view-grid">
            <FeatureCard icon={<Stethoscope />} title="钱大少养胃记录" text="吃饭、排泄、呕吐、睡觉记录迁移到云端 API，支持后续手机电脑同步。" onClick={() => setView("health")} />
            <FeatureCard icon={<Newspaper />} title="每日跨境资讯" text="保留亚马逊、独立站、平台政策观察入口，后续可接入定时采集和审核。" onClick={() => setView("commerce")} />
            <FeatureCard icon={<BriefcaseBusiness />} title="项目展示与简历" text="从工具站升级到个人品牌主页，承载能力、案例、作品和联系方式。" onClick={() => setView("projects")} />
            <FeatureCard icon={<Wrench />} title="AI/OEM 产品入口" text="为数字人、智能客服、AI 获客等产品预留统一 integration 架构。" onClick={() => setView("ai")} />
          </section>
        )}

        {view === "health" && (
          <section className="health-layout">
            <form className="panel record-form" onSubmit={saveRecord}>
              <div className="panel-head">
                <div>
                  <span className="eyebrow">{editingId ? "编辑记录" : "新增记录"}</span>
                  <h2>钱大少养胃记录</h2>
                </div>
                <Cloud className={service.persistentHealthRecords ? "ok-icon" : "warn-icon"} />
              </div>
              <div className="segmented">
                {(["meal", "poop", "vomit", "sleep"] as HealthRecord["type"][]).map((type) => (
                  <button type="button" key={type} className={activeType === type ? "selected" : ""} onClick={() => switchType(type)}>{typeName[type]}</button>
                ))}
              </div>
              <div className="form-grid">
                <label>日期<input type="date" value={recordDraft.date} onChange={(e) => patchDraft({ date: e.target.value })} /></label>
                <label>时间<input type="time" value={recordDraft.time} onChange={(e) => patchDraft({ time: e.target.value, mealSlot: activeType === "meal" ? classifyMeal(e.target.value) as HealthRecord["mealSlot"] : recordDraft.mealSlot })} /></label>
                {activeType === "meal" && <>
                  <label>餐次<select value={recordDraft.mealSlot || "breakfast"} onChange={(e) => patchDraft({ mealSlot: e.target.value as HealthRecord["mealSlot"] })}><option value="breakfast">早餐</option><option value="lunch">午餐</option><option value="dinner">晚餐</option><option value="night">夜间加餐</option></select></label>
                  <label>食量<select value={recordDraft.amount || "正常"} onChange={(e) => patchDraft({ amount: e.target.value })}><option>偏少</option><option>正常</option><option>偏多</option></select></label>
                  <label className="wide">吃了什么<input value={recordDraft.food || ""} onChange={(e) => patchDraft({ food: e.target.value })} /></label>
                </>}
                {activeType === "poop" && <>
                  <label>类型<select value={recordDraft.poopType || "大便"} onChange={(e) => patchDraft({ poopType: e.target.value })}><option>大便</option><option>小便</option></select></label>
                  <label>状态<select value={recordDraft.status || "正常"} onChange={(e) => patchDraft({ status: e.target.value })}><option>正常</option><option>偏软</option><option>偏硬</option><option>异常</option></select></label>
                  <label className="wide">备注<input value={recordDraft.note || ""} onChange={(e) => patchDraft({ note: e.target.value })} /></label>
                </>}
                {activeType === "vomit" && <>
                  <label>量<select value={recordDraft.amount || "少量"} onChange={(e) => patchDraft({ amount: e.target.value })}><option>少量</option><option>中等</option><option>大量</option></select></label>
                  <label className="wide">呕吐物<input value={recordDraft.content || ""} onChange={(e) => patchDraft({ content: e.target.value })} /></label>
                  <label className="wide">备注<input value={recordDraft.note || ""} onChange={(e) => patchDraft({ note: e.target.value })} /></label>
                </>}
                {activeType === "sleep" && <>
                  <label>时长/状态<input value={recordDraft.amount || ""} onChange={(e) => patchDraft({ amount: e.target.value })} placeholder="例如 3 小时 / 安稳" /></label>
                  <label className="wide">备注<input value={recordDraft.note || ""} onChange={(e) => patchDraft({ note: e.target.value })} /></label>
                </>}
              </div>
              <button className="primary-btn" type="submit"><Plus size={17} /> {editingId ? "保存修改" : "保存到云端"}</button>
            </form>
            <section className="panel calendar-panel">
              <CalendarHeader date={viewDate} setDate={setViewDate} />
              <CalendarGrid viewDate={viewDate} selectedDate={selectedDate} setSelectedDate={setSelectedDate} statsByDay={statsByDay} />
              <div className="day-detail">
                <h3>{selectedDate} 当天记录</h3>
                {selectedRecords.length ? selectedRecords.map((record) => <RecordRow key={record.id} record={record} onEdit={editRecord} onDelete={removeRecord} />) : <p className="empty">当天还没有记录。</p>}
              </div>
            </section>
            <section className="panel records-panel">
              <div className="toolbar">
                <input placeholder="搜索食物、备注、状态" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">全部</option><option value="meal">吃饭</option><option value="poop">排泄</option><option value="vomit">呕吐</option><option value="sleep">睡觉</option>
                </select>
                <button className="ghost-btn" onClick={exportRecords}>导出</button>
                <label className="file-btn">导入<input type="file" accept="application/json" onChange={(e) => importRecords(e.target.files?.[0] || null)} /></label>
              </div>
              {filteredRecords.slice(0, 12).map((record) => <RecordRow key={record.id} record={record} onEdit={editRecord} onDelete={removeRecord} />)}
            </section>
          </section>
        )}

        {view === "commerce" && <CommerceNewsView briefs={commerceBriefs} loading={commerceLoading} onRefresh={refreshCommerceNews} />}
        {view === "projects" && <ProjectsView />}
        {view === "ai" && <AiView />}
        {view === "admin" && (
          <section className="admin-layout">
            <form className="panel admin-form" onSubmit={createAccount}>
              <h2><UserPlus size={19} /> 新增后台账号</h2>
              <label>账号<input name="username" minLength={3} required /></label>
              <label>密码<input name="password" type="password" minLength={8} required /></label>
              <label>角色<select name="role"><option value="user">普通用户</option><option value="admin">管理员</option></select></label>
              <button className="primary-btn" type="submit" disabled={accountSubmitting}>{accountSubmitting ? "创建中..." : "创建账号"}</button>
            </form>
            <section className="panel">
              <h2>账号列表</h2>
              <p className="subtle">账号正在向 Supabase Postgres 迁移；配置完成前会继续使用现有 Upstash 兜底。</p>
              {accounts.map((account) => (
                <div className="account-row" key={account.username}>
                  <div><strong>{account.username}</strong><span>{account.role} · {new Date(account.createdAt).toLocaleString()}</span></div>
                  <button type="button" disabled={account.username === "admin" || account.username === session.username} onClick={() => removeAccount(account.username)}><Trash2 size={16} /></button>
                </div>
              ))}
            </section>
          </section>
        )}
      </section>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function FeatureCard({ icon, title, text, onClick }: { icon: React.ReactNode; title: string; text: string; onClick: () => void }) {
  return <button className="feature-card" onClick={onClick}><span>{icon}</span><strong>{title}</strong><p>{text}</p></button>;
}

function CalendarHeader({ date, setDate }: { date: Date; setDate: (date: Date) => void }) {
  return <div className="calendar-head"><button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>‹</button><strong>{date.getFullYear()} 年 {date.getMonth() + 1} 月</strong><button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>›</button></div>;
}

function CalendarGrid({ viewDate, selectedDate, setSelectedDate, statsByDay }: { viewDate: Date; selectedDate: string; setSelectedDate: (date: string) => void; statsByDay: Map<string, HealthRecord[]> }) {
  const days = useMemo(() => {
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const mondayIndex = (first.getDay() + 6) % 7;
    const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1 - mondayIndex);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [viewDate]);
  return <div className="calendar-grid">{["一", "二", "三", "四", "五", "六", "日"].map((d) => <span key={d} className="weekday">{d}</span>)}{days.map((date) => {
    const key = toDateKey(date);
    const items = statsByDay.get(key) || [];
    const meals = new Set<string>(items.filter((item) => item.type === "meal").map((item) => item.mealSlot || classifyMeal(item.time)));
    const hasPoop = items.some((item) => item.type === "poop");
    const hasVomit = items.some((item) => item.type === "vomit");
    return <button key={key} className={`${key === selectedDate ? "selected-day" : ""} ${date.getMonth() !== viewDate.getMonth() ? "muted-day" : ""}`} onClick={() => setSelectedDate(key)}><strong>{date.getDate()}</strong><small>{["breakfast", "lunch", "dinner"].filter((slot) => meals.has(slot)).length}/3餐 · {hasPoop ? "排" : "未排"}{hasVomit ? " · 吐" : ""}</small></button>;
  })}</div>;
}

function RecordRow({ record, onEdit, onDelete }: { record: HealthRecord; onEdit: (record: HealthRecord) => void; onDelete: (id: string) => void }) {
  const info = describeRecord(record);
  return <div className="record-row"><div className="stamp">{record.time}<small>{typeName[record.type]}</small></div><div><strong>{info.title}</strong><span>{record.date} · {info.meta}</span></div><div className="row-actions"><button onClick={() => onEdit(record)}>改</button><button onClick={() => onDelete(record.id)}>删</button></div></div>;
}

function CommerceNewsView({ briefs, loading, onRefresh }: { briefs: CommerceNewsBrief[]; loading: boolean; onRefresh: () => void }) {
  const latest = briefs[0] || fallbackCommerceBrief;
  const history = briefs.slice(1);
  return (
    <section className="commerce-panel">
      <div className="panel commerce-hero">
        <div className="panel-head">
          <div>
            <span className="eyebrow">DAILY ECOMMERCE RADAR</span>
            <h2>每日跨境电商资讯简报</h2>
            <p>{latest.displayDate} · {latest.researchWindow}</p>
          </div>
          <button className="ghost-btn" onClick={onRefresh} disabled={loading}>
            <Newspaper size={17} /> {loading ? "刷新中" : "刷新"}
          </button>
        </div>
        <div className="brief-note">
          <strong>今日重点观察</strong>
          {latest.observation.map((item) => <p key={item}>{item}</p>)}
        </div>
      </div>

      <div className="news-card-grid">
        {latest.items.map((item, index) => (
          <article className="news-brief-card" key={item.id}>
            <div className="feature-meta">
              <span className={`tag ${item.priority === "high" ? "amber" : "blue"}`}>#{index + 1}</span>
              <span className="tag blue">{item.category}</span>
              <span className="tag">{item.publishedAt}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <div className="news-card-section">
              <strong>对卖家的影响</strong>
              <span>{item.sellerImpact}</span>
            </div>
            <div className="news-card-section">
              <strong>建议动作</strong>
              <span>{item.recommendedAction}</span>
            </div>
            <footer>
              <span>{item.source}</span>
              <a href={item.originalUrl} target="_blank" rel="noreferrer">原文链接</a>
            </footer>
          </article>
        ))}
      </div>

      <div className="panel commerce-history">
        <div>
          <h3>验真说明</h3>
          {latest.verificationNotes.map((note) => <p key={note}>{note}</p>)}
        </div>
        <div>
          <h3>历史记录</h3>
          {history.length ? history.map((brief) => <p key={brief.date}>{brief.displayDate} · {brief.items.length} 条</p>) : <p>后续每日更新会保留在这里。</p>}
        </div>
      </div>
    </section>
  );
}

function ProjectsView() {
  return <section className="panel"><div className="panel-head"><h2>项目展示 / 简历</h2><BriefcaseBusiness /></div><div className="card-grid"><article className="info-card"><span>Platform</span><strong>dehviz.lol</strong><p>个人工具集、项目展示和 AI 产品体验平台。当前迁移到 Next.js + Postgres。</p><em>全栈 / 产品</em></article><article className="info-card"><span>Resume</span><strong>个人能力页预留</strong><p>后续会把项目案例、经历、技能、联系方式做成后台可维护内容。</p><em>简历</em></article></div></section>;
}

function AiView() {
  return <section className="panel"><div className="panel-head"><h2>AI/OEM 产品接入</h2><Activity /></div><div className="card-grid"><article className="info-card"><span>Digital Human</span><strong>数字人体验位</strong><p>预留 API 配置、调用日志和体验页面，不把供应商逻辑写散。</p><em>planned</em></article><article className="info-card"><span>Customer Service</span><strong>智能客服体验位</strong><p>统一 integrations 表和后台配置，后续可接入 OEM 产品。</p><em>planned</em></article><article className="info-card"><span>Analytics</span><strong>调用成本与日志</strong><p>后续记录每次调用状态、耗时、成本和错误，方便商业化。</p><em>ops</em></article></div></section>;
}

