import { claimLabNotice, createLab } from "@adam0white/lab-client";

export interface GameLab {
  feedback(): void;
  recording(): boolean;
  setRecording(on: boolean): void;
  event(kind: string, detail: string): void;
  captureSave(value: unknown): void;
  destroy(): void;
}

/** Keep transport, privacy preferences and stored-note receipts in the lab SDK. */
export function initLab(getRun: () => unknown): GameLab {
  // Localhost remains off. Do not enable sendFromLocalhost for agent playtests.
  const lab = createLab({ game: "child" });
  const stopTracking = lab.trackRun(getRun);
  let destroyed = false;
  let notice: HTMLElement | null = null;

  void claimLabNotice()
    .catch(() => false)
    .then((show) => {
      if (!show || destroyed) return;
      notice = document.createElement("aside");
      notice.setAttribute("aria-label", "Play recording");
      Object.assign(notice.style, {
        position: "fixed",
        left: "12px",
        right: "12px",
        bottom: "max(12px, env(safe-area-inset-bottom))",
        zIndex: "1000",
        maxWidth: "36rem",
        margin: "0 auto",
        padding: "16px",
        background: "#fffaf0",
        color: "#303c36",
        border: "1px solid #456c65",
        borderRadius: "12px",
        boxShadow: "0 4px 24px #303c3626",
      });
      const text = document.createElement("p");
      text.textContent =
        "We record and link play across games on this device. You can change Recording in the menu.";
      text.style.margin = "0 0 12px";
      const privacy = document.createElement("a");
      privacy.href = "https://human.adamwhite.work/lab/privacy/";
      privacy.target = "_blank";
      privacy.rel = "noopener";
      privacy.textContent = "Privacy";
      privacy.style.marginRight = "16px";
      const close = document.createElement("button");
      close.type = "button";
      close.textContent = "Continue";
      close.style.minHeight = "44px";
      close.onclick = () => notice?.remove();
      notice.append(text, privacy, close);
      document.body.append(notice);
    });

  return {
    feedback() {
      if (destroyed) return;
      // The SDK keeps failed notes, and shows Sent only after a stored HTTP 200.
      // Selecting either feedback choice sends nothing before Submit.
      lab.openSendDialog({ getRun, feedbackChoices: true });
    },
    recording: () => lab.telemetryOn,
    setRecording(on) {
      if (!destroyed) lab.setTelemetryOff(!on);
    },
    event(kind, detail) {
      if (destroyed) return;
      if (kind === "screen") lab.screen(detail);
      else if (kind === "milestone") lab.milestone(detail);
      else if (kind === "warn" || kind === "error") lab.log(kind, detail);
      else lab.log("game", `${kind}: ${detail}`);
    },
    captureSave(value) {
      if (!destroyed) lab.captureSave(value);
    },
    destroy() {
      destroyed = true;
      stopTracking();
      notice?.remove();
    },
  };
}
