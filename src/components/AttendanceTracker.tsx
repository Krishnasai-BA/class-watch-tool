import { useState } from "react";
import { Plus, Trash2, GraduationCap, Calculator, ArrowLeft } from "lucide-react";
import banyanBg from "@/assets/banyan-tree-bg.jpg";
import swingingMan from "@/assets/swinging-man.png";

interface Subject {
  id: number;
  name: string;
  present: string;
  total: string;
}

let nextId = 1;

const AttendanceTracker = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: nextId++, name: "Mathematics", present: "", total: "" },
    { id: nextId++, name: "Physics", present: "", total: "" },
    { id: nextId++, name: "Chemistry", present: "", total: "" },
    { id: nextId++, name: "Programming", present: "", total: "" },
  ]);
  const [showResults, setShowResults] = useState(false);

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      { id: nextId++, name: "", present: "", total: "" },
    ]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = (id: number, field: keyof Subject, value: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calcPercentage = (present: string, total: string) => {
    const p = parseInt(present);
    const t = parseInt(total);
    if (isNaN(p) || isNaN(t) || t === 0 || p < 0 || t < 0) return null;
    const clamped = Math.min(p, t);
    return (clamped / t) * 100;
  };

  const overallStats = subjects.reduce(
    (acc, s) => {
      const p = parseInt(s.present);
      const t = parseInt(s.total);
      if (!isNaN(p) && !isNaN(t) && t > 0 && p >= 0) {
        acc.present += Math.min(p, t);
        acc.total += t;
        acc.valid++;
      }
      return acc;
    },
    { present: 0, total: 0, valid: 0 }
  );

  const overallPercentage =
    overallStats.total > 0
      ? (overallStats.present / overallStats.total) * 100
      : null;

  const hasValidData = overallStats.valid > 0;

  const getStatusColor = (pct: number) => {
    if (pct >= 75) return "text-green-300";
    if (pct >= 60) return "text-yellow-300";
    return "text-red-300";
  };

  const getBarColor = (pct: number) => {
    if (pct >= 75) return "bg-green-400";
    if (pct >= 60) return "bg-yellow-400";
    return "bg-red-400";
  };

  // Results screen with violet background
  if (showResults) {
    return (
      <div className="violet-results min-h-screen px-4 py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => setShowResults(false)}
            className="mb-6 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Input
          </button>

          <div className="animate-float-up mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              📊 Attendance Results
            </h1>
            <p className="mt-2 text-white/60">B.Tech • Subject-wise breakdown</p>
          </div>

          {/* Overall */}
          {overallPercentage !== null && (
            <div className="animate-float-up mb-6 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Overall Attendance</p>
                  <p className={`mt-1 font-mono text-4xl font-bold ${getStatusColor(overallPercentage)}`}>
                    {overallPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">
                    {overallStats.present} / {overallStats.total} classes
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    {overallStats.valid} subject{overallStats.valid !== 1 && "s"} tracked
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getBarColor(overallPercentage)}`}
                  style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-white/40">
                {overallPercentage >= 75
                  ? "✅ Eligible for exams"
                  : `⚠️ Need ${Math.ceil(((0.75 * overallStats.total - overallStats.present) / (1 - 0.75)))} more classes to reach 75%`}
              </p>
            </div>
          )}

          {/* Subject-wise results */}
          <div className="space-y-3">
            {subjects.map((subject, i) => {
              const pct = calcPercentage(subject.present, subject.total);
              if (pct === null) return null;
              return (
                <div
                  key={subject.id}
                  className="animate-float-up rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                  style={{ animationDelay: `${0.15 + i * 0.08}s`, opacity: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      {subject.name || "Unnamed Subject"}
                    </h3>
                    <span className={`font-mono text-lg font-bold ${getStatusColor(pct)}`}>
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    {subject.present} / {subject.total} classes attended
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${getBarColor(pct)}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-white/40">
            <Calculator className="mr-1 inline h-3 w-3" />
            75% attendance required to be eligible for exams
          </p>
        </div>
      </div>
    );
  }

  // Input screen with banyan tree background
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Banyan tree background */}
      <div className="absolute inset-0">
        <img
          src={banyanBg}
          alt=""
          className="h-full w-full object-cover animate-sway"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Swinging man */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 z-10">
        <img
          src={swingingMan}
          alt="Swinging person"
          className="h-28 w-28 animate-swing opacity-80 drop-shadow-2xl"
          style={{ filter: "invert(1) brightness(2)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 px-4 py-8 pt-36 md:py-12 md:pt-40">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl drop-shadow-lg">
              Attendance Tracker
            </h1>
            <p className="mt-2 text-white/60">
              B.Tech • Enter your attendance below
            </p>
          </div>

          {/* Subject List */}
          <div className="space-y-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="rounded-xl border border-white/15 bg-black/40 p-4 shadow-lg backdrop-blur-md transition-shadow hover:shadow-xl"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="text"
                    placeholder="Subject name"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                    className="flex-1 border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/30"
                  />
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-400"
                    aria-label="Remove subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {/* Present */}
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-white/50">
                      Present
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={subject.present}
                      onChange={(e) => updateSubject(subject.id, "present", e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 font-mono text-sm text-white outline-none transition-colors focus:border-white/50 focus:ring-1 focus:ring-white/30 placeholder:text-white/20"
                    />
                  </div>

                  {/* Total */}
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-white/50">
                      Total Classes
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={subject.total}
                      onChange={(e) => updateSubject(subject.id, "total", e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 font-mono text-sm text-white outline-none transition-colors focus:border-white/50 focus:ring-1 focus:ring-white/30 placeholder:text-white/20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Subject */}
          <button
            onClick={addSubject}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 py-3 text-sm font-medium text-white/50 transition-colors hover:border-white/40 hover:text-white/80"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>

          {/* Calculate Button */}
          <button
            onClick={() => hasValidData && setShowResults(true)}
            disabled={!hasValidData}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-4 text-lg font-bold text-white shadow-lg shadow-purple-900/40 transition-all hover:from-purple-500 hover:to-violet-500 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Calculator className="h-5 w-5" />
            Calculate Attendance
          </button>

          <p className="mt-4 text-center text-xs text-white/40">
            Enter present & total classes, then hit Calculate
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
