import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Demo from "../../upstream/app/page";
// Vite's query keeps content overrides while disabling presentation timing.
import OriginalDemo from "../../upstream/app/page?unstreamed";
import { scenarioLibrary } from "../../upstream/app/demo-scenarios";
import { buildRevealSchedule, STREAM_END_MS } from "../src/streaming";
import {
  workspaceChatTitle,
  workspaceConversationScenario,
} from "../src/scenario-overrides";

let reduced = false;
const scenarios = Object.values(scenarioLibrary).flatMap((workspace) =>
  workspace.scenarios.map((scenario) => ({ companyId: workspace.id, scenario }))
);
beforeEach(() => {
  vi.useFakeTimers({
    toFake: [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "Date",
      "performance",
      "requestAnimationFrame",
      "cancelAnimationFrame",
    ],
  });
  reduced = false;
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("prefers-reduced-motion") && reduced,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function save(companyId: string, channel: string, platform = "ruby") {
  localStorage.setItem(
    "ruby-workspace-state-v1",
    JSON.stringify({ companyId, channel, platform })
  );
}
function content(container: HTMLElement) {
  const conversation = container.querySelector(".conversation-scroll");
  if (!conversation) {
    throw new Error("Expected conversation");
  }
  return {
    text: conversation.textContent,
    images: [...conversation.querySelectorAll("img")].map((image) => [
      image.getAttribute("src"),
      image.alt,
    ]),
    controls: [
      ...conversation.querySelectorAll("button, input, select, a"),
    ].map((element) => [
      element.tagName,
      element.getAttribute("aria-label"),
      element.getAttribute("href"),
      element.textContent,
    ]),
  };
}
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("streaming presentation", () => {
  it("streams Teams lead-ins and places structured tables after earlier response text", () => {
    const first = scenarios[0];
    save(first.companyId, first.scenario.id, "teams");
    const teams = render(<Demo />);
    expect(
      teams.container.querySelectorAll(".teams-artifact-lead .demo-stream-word")
        .length
    ).toBeGreaterThan(1);
    teams.unmount();
    const example = scenarios.find(({ scenario }) =>
      scenario.copy.response.some((block) => block.kind === "table")
    );
    if (!example) {
      throw new Error("Missing table scenario");
    }
    save(example.companyId, example.scenario.id);
    const tableView = render(<Demo />);
    const schedule = buildRevealSchedule(
      tableView.container,
      example.scenario,
      "ruby"
    );
    const tableItem = schedule.items.find((item) =>
      item.element.classList.contains("conversation-table-wrap")
    );
    if (!tableItem) {
      throw new Error("Table reveal missing");
    }
    expect(tableItem.word).toBe(false);
    const precedingWords = schedule.items.filter(
      (item) =>
        item.word &&
        (item.element.compareDocumentPosition(tableItem.element) &
          Node.DOCUMENT_POSITION_FOLLOWING) !==
          0
    );
    expect(precedingWords.length).toBeGreaterThan(0);
    expect(precedingWords.every((item) => item.atMs < tableItem.atMs)).toBe(
      true
    );
    expect(
      tableItem.element.querySelectorAll("[data-stream-hidden]")
    ).toHaveLength(0);
  });
  it("shows prompt, thinking, cards then checks, words, artifact and original completion in order", () => {
    const { companyId, scenario } = scenarios[0];
    save(companyId, scenario.id);
    const { container } = render(<Demo />);
    const prompt = container.querySelector(".ruby-user-message");
    const card = container.querySelector(".ruby-tool-card");
    const check = card?.querySelector(".ruby-tool-check");
    expect(prompt).not.toHaveAttribute("data-stream-hidden");
    expect(card).toHaveAttribute("data-stream-hidden");
    advance(272);
    expect(container.querySelector(".demo-thinking")).toHaveTextContent(
      "Thinking…"
    );
    advance(1248);
    expect(container.querySelector(".demo-thinking")).toBeNull();
    expect(card).not.toHaveAttribute("data-stream-hidden");
    expect(check).toHaveAttribute("data-stream-hidden");
    advance(144);
    expect(check).not.toHaveAttribute("data-stream-hidden");
    advance(1200);
    expect(
      container.querySelectorAll(".demo-stream-word:not([data-stream-hidden])")
        .length
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll(".demo-stream-word[data-stream-hidden]").length
    ).toBeGreaterThan(0);
    expect(container.querySelector(".scenario-artifact")).toHaveAttribute(
      "data-stream-hidden"
    );
    advance(1300);
    expect(container.querySelector(".scenario-artifact")).not.toHaveAttribute(
      "data-stream-hidden"
    );
    expect(
      container.querySelector(".fleet-assignment-cards > article")
    ).toHaveAttribute("data-stream-hidden");
    expect(
      container.querySelector(".ruby-response-header small")
    ).toHaveAttribute("data-stream-hidden");
    advance(1840);
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
    expect(
      container.querySelector(".ruby-response-header small")
    ).toHaveTextContent(`Completed in ${scenario.duration} sec`);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("replays the selected chat, cancels stale playback on switching and does not replay on theme changes", () => {
    const { companyId, scenario } = scenarios[0];
    save(companyId, scenario.id);
    const { container, getByRole } = render(<Demo />);
    advance(6000);
    fireEvent.click(getByRole("button", { name: `Switch to dark mode` }));
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
    fireEvent.click(
      getByRole("button", {
        name: `${workspaceChatTitle(scenario)} channel`,
      })
    );
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "playing"
    );
    advance(500);
    const next = scenarios[1].scenario;
    fireEvent.click(
      getByRole("button", { name: `${workspaceChatTitle(next)} channel` })
    );
    expect(container.querySelector(".ruby-user-message")).toHaveTextContent(
      workspaceConversationScenario(next).copy.userPrompt
    );
    advance(6000);
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
  });

  it("describes recurring and attention indicators on their sidebar buttons", () => {
    const { getByRole } = render(<Demo />);
    expect(
      getByRole("button", {
        name: "Send the morning driver's brief channel",
      })
    ).toHaveAccessibleDescription("Runs every morning");
    expect(
      getByRole("button", { name: "Launch new operation channel" })
    ).toHaveAccessibleDescription("Needs attention");
  });

  it("shows the complete original immediately for reduced motion", () => {
    reduced = true;
    const { container } = render(<Demo />);
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
    expect(container.querySelector(".demo-thinking")).toBeNull();
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("waits for trusted parent visibility and replays the restored selection on refresh", () => {
    const parentFrame = document.createElement("iframe");
    document.body.append(parentFrame);
    const parentWindow = parentFrame.contentWindow;
    if (!parentWindow) {
      throw new Error("Missing parent test window");
    }
    vi.stubGlobal("parent", parentWindow);
    const saved = scenarios[12];
    save(saved.companyId, saved.scenario.id, "slack");
    const view = render(<Demo />);
    advance(7000);
    expect(view.container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "waiting"
    );
    for (const details of [
      { origin: "https://untrusted.example", source: parentWindow },
      { origin: window.location.origin, source: window },
    ]) {
      fireEvent(
        window,
        new MessageEvent("message", {
          ...details,
          data: { type: "workspace-demo:visibility", visible: true },
        })
      );
      expect(
        view.container.querySelector(".demo-stream-shell")
      ).toHaveAttribute("data-stream-state", "waiting");
    }
    fireEvent(
      window,
      new MessageEvent("message", {
        origin: window.location.origin,
        source: parentWindow,
        data: { type: "workspace-demo:visibility", visible: true },
      })
    );
    expect(view.container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "playing"
    );
    expect(
      view.container.querySelector(".slack-thread > article p")
    ).toHaveTextContent(
      workspaceConversationScenario(saved.scenario).copy.userPrompt
    );
    advance(6000);
    view.unmount();
    const refreshed = render(<Demo />);
    expect(
      refreshed.container.querySelector(".demo-stream-shell")
    ).toHaveAttribute("data-stream-state", "waiting");
    expect(
      refreshed.container.querySelectorAll("[data-stream-hidden]").length
    ).toBeGreaterThan(0);
    refreshed.unmount();
    parentFrame.remove();
  });

  it("stops following after manual scrolling and preserves artifact interaction state", () => {
    const { container } = render(<Demo />);
    const scroller = container.querySelector<HTMLElement>(
      ".conversation-scroll"
    );
    const paragraph = container.querySelector<HTMLElement>(
      ".conversation-document > p"
    );
    if (!scroller || !paragraph) {
      throw new Error("Missing scroll fixture");
    }
    vi.spyOn(scroller, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 800, 400)
    );
    vi.spyOn(paragraph, "getBoundingClientRect").mockImplementation(
      () => new DOMRect(0, 700 - scroller.scrollTop, 600, 40)
    );
    Object.defineProperty(scroller, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(scroller, "clientHeight", {
      configurable: true,
      value: 400,
    });
    advance(3000);
    expect(scroller.scrollTop).toBeGreaterThan(0);
    fireEvent.wheel(scroller);
    scroller.scrollTop = 42;
    advance(3000);
    expect(scroller.scrollTop).toBe(42);
    const button = container.querySelector<HTMLButtonElement>(
      "[data-primary-action]"
    );
    if (!button) {
      throw new Error("Missing interactive artifact button");
    }
    fireEvent.click(button);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
  });

  it("reveals everything when returning after the deadline with animation frames paused", () => {
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
    const { container } = render(<Demo />);
    expect(
      container.querySelectorAll("[data-stream-hidden]").length
    ).toBeGreaterThan(0);
    advance(6000);
    fireEvent(document, new Event("visibilitychange"));
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("preserves content and completes all 360 presentations within six seconds", () => {
    for (const { companyId, scenario } of scenarios) {
      for (const platform of ["ruby", "slack", "teams"] as const) {
        save(companyId, scenario.id, platform);
        const original = render(<OriginalDemo />);
        const expected = content(original.container);
        original.unmount();
        save(companyId, scenario.id, platform);
        const streamed = render(<Demo />);
        expect(
          streamed.container.querySelector(".demo-stream-shell"),
          `${scenario.id}/${platform}`
        ).toHaveAttribute("data-stream-state", "playing");
        const schedule = buildRevealSchedule(
          streamed.container,
          scenario,
          platform
        );
        expect(
          schedule.items.every((item) => item.atMs + 220 <= STREAM_END_MS),
          scenario.id
        ).toBe(true);
        advance(6000);
        expect(
          streamed.container.querySelectorAll("[data-stream-hidden]").length,
          `${scenario.id}/${platform}`
        ).toBe(0);
        expect(
          streamed.container.querySelector(".demo-thinking"),
          `${scenario.id}/${platform}`
        ).toBeNull();
        expect(
          content(streamed.container),
          `${scenario.id}/${platform}`
        ).toEqual(expected);
        streamed.unmount();
      }
    }
  }, 120000);
});
