import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import test, { afterEach } from "node:test";
import React from "react";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  pretendToBeVisual: true,
  url: "https://ruby.ad/",
});

Object.defineProperties(globalThis, {
  React: { configurable: true, value: React },
  cancelAnimationFrame: {
    configurable: true,
    value: dom.window.cancelAnimationFrame.bind(dom.window),
  },
  getComputedStyle: {
    configurable: true,
    value: dom.window.getComputedStyle.bind(dom.window),
  },
  window: { configurable: true, value: dom.window },
  document: { configurable: true, value: dom.window.document },
  location: { configurable: true, value: dom.window.location },
  navigator: { configurable: true, value: dom.window.navigator },
  requestAnimationFrame: {
    configurable: true,
    value: dom.window.requestAnimationFrame.bind(dom.window),
  },
  HTMLElement: { configurable: true, value: dom.window.HTMLElement },
  IS_REACT_ACT_ENVIRONMENT: { configurable: true, value: true, writable: true },
});

Object.defineProperty(dom.window.HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => ({
    fillStyle: "",
    fillRect: () => undefined,
  }),
});

for (const [name, value] of Object.entries({
  CustomEvent: dom.window.CustomEvent,
  Document: dom.window.Document,
  Element: dom.window.Element,
  Event: dom.window.Event,
  FocusEvent: dom.window.FocusEvent,
  HTMLAnchorElement: dom.window.HTMLAnchorElement,
  HTMLButtonElement: dom.window.HTMLButtonElement,
  HTMLDivElement: dom.window.HTMLDivElement,
  HTMLInputElement: dom.window.HTMLInputElement,
  HTMLSelectElement: dom.window.HTMLSelectElement,
  HTMLTextAreaElement: dom.window.HTMLTextAreaElement,
  KeyboardEvent: dom.window.KeyboardEvent,
  MouseEvent: dom.window.MouseEvent,
  MutationObserver: dom.window.MutationObserver,
  Node: dom.window.Node,
  NodeFilter: dom.window.NodeFilter,
  PointerEvent: dom.window.PointerEvent,
  SVGElement: dom.window.SVGElement,
})) {
  if (value) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value,
    });
  }
}

async function loadRegionTestDependencies() {
  const [testingLibrary, regionModal, modalContext, regionSignup] =
    await Promise.all([
      import("@testing-library/react"),
      import("./RegionSelectionModal"),
      import("../hooks/useSignUpModal"),
      import("../lib/region-signup"),
    ]);

  return {
    ...testingLibrary,
    ...regionModal,
    ...modalContext,
    ...regionSignup,
  };
}

function captureNavigation(callback: () => void): string {
  let href = "";
  const realWindow = dom.window;
  const capturedLocation = {
    get href() {
      return href;
    },
    set href(value: string) {
      href = value;
    },
  };
  const windowProxy = new Proxy(realWindow, {
    get(target, property) {
      if (property === "location") {
        return capturedLocation;
      }

      const value = Reflect.get(target, property, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: windowProxy,
  });
  try {
    callback();
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: realWindow,
    });
  }

  return href;
}

function OpenRegionModal({
  useSignUpModal,
}: {
  useSignUpModal: typeof import("../hooks/useSignUpModal").useSignUpModal;
}) {
  const { openSignUpModal } = useSignUpModal();

  React.useEffect(() => {
    openSignUpModal();
  }, [openSignUpModal]);

  return null;
}

function renderOpenRegionModal({
  render,
  RegionSelectionModal,
  SignUpModalProvider,
  useSignUpModal,
}: {
  render: typeof import("@testing-library/react").render;
  RegionSelectionModal: typeof import("./RegionSelectionModal").RegionSelectionModal;
  SignUpModalProvider: typeof import("../hooks/useSignUpModal").SignUpModalProvider;
  useSignUpModal: typeof import("../hooks/useSignUpModal").useSignUpModal;
}) {
  return render(
    <SignUpModalProvider>
      <OpenRegionModal useSignUpModal={useSignUpModal} />
      <RegionSelectionModal />
    </SignUpModalProvider>
  );
}

afterEach(() => {
  dom.window.document.body.innerHTML = "";
});

test("keeps the region selector modal visible with both region choices", async () => {
  const {
    cleanup,
    render,
    screen,
    RegionSelectionModal,
    SignUpModalProvider,
    useSignUpModal,
  } = await loadRegionTestDependencies();
  renderOpenRegionModal({
    render,
    RegionSelectionModal,
    SignUpModalProvider,
    useSignUpModal,
  });

  const dialog = await screen.findByRole("dialog");

  assert.equal(dialog.getAttribute("aria-labelledby") !== null, true);
  assert.equal(
    screen.getByRole("heading", { name: "Choose your region" }).textContent,
    "Choose your region"
  );
  const worldwideOption = screen.getByRole("button", {
    name: "Worldwide Data in the US + Global models",
  });
  assert.equal(worldwideOption.getAttribute("aria-pressed"), "true");
  assert.equal(screen.queryByText("United States"), null);
  assert.equal(
    screen.getByText("Data in the US + Global models").textContent,
    "Data in the US + Global models"
  );
  assert.equal(screen.queryByText("USA"), null);
  assert.equal(
    worldwideOption.querySelector("img")?.getAttribute("src"),
    "/static/earth-icon.webp"
  );
  assert.equal(
    screen.getByRole("button", { name: /Europe/ }).getAttribute("aria-pressed"),
    "false"
  );
  cleanup();
});

test("routes the selected US region through the US signup API", async () => {
  const {
    cleanup,
    fireEvent,
    render,
    screen,
    RegionSelectionModal,
    SignUpModalProvider,
    useSignUpModal,
  } = await loadRegionTestDependencies();
  renderOpenRegionModal({
    render,
    RegionSelectionModal,
    SignUpModalProvider,
    useSignUpModal,
  });

  await screen.findByRole("dialog");
  const navigation = captureNavigation(() => {
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  });

  assert.equal(navigation, "/api/workos/login?screenHint=sign-up");
  cleanup();
});

test("routes the selected EU region through the EU signup API", async () => {
  const {
    cleanup,
    fireEvent,
    render,
    screen,
    RegionSelectionModal,
    SignUpModalProvider,
    useSignUpModal,
  } = await loadRegionTestDependencies();
  renderOpenRegionModal({
    render,
    RegionSelectionModal,
    SignUpModalProvider,
    useSignUpModal,
  });

  await screen.findByRole("dialog");
  fireEvent.click(screen.getByRole("button", { name: /Europe/ }));
  assert.equal(
    screen.getByText(/Models can cost up to 10% more credits/).textContent,
    "Models can cost up to 10% more credits in Europe"
  );
  const navigation = captureNavigation(() => {
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  });

  assert.equal(
    navigation,
    "https://eu.ruby.ad/api/workos/login?screenHint=sign-up"
  );
  cleanup();
});
