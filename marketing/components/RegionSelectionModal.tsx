import { useSignUpModal } from "@marketing/hooks/useSignUpModal";
import {
  getSignupUrlForRegion,
  type SignupRegion,
} from "@marketing/lib/region-signup";
import { appendUTMParams } from "@marketing/lib/utils/utm";
import { LegacyButton as Button, Check, cn } from "@ruby-ai/sparkle";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";

type Region = SignupRegion;

const REGIONS: Record<Region, { label: string; href: string }> = {
  us: {
    label: "Worldwide",
    href: getSignupUrlForRegion("us"),
  },
  eu: {
    label: "Europe",
    href: getSignupUrlForRegion("eu"),
  },
};

interface RegionCardProps {
  region: Region;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

function RegionCard({ region, label, selected, onSelect }: RegionCardProps) {
  const isWorldwide = region === "us";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex flex-row items-center gap-4 rounded-xl border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        selected ? "border-blue-500" : "border-gray-200 hover:border-blue-500"
      )}
    >
      {isWorldwide ? (
        <img
          src="/static/earth-icon.webp"
          alt=""
          aria-hidden="true"
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <img
          src="/static/eu-flag.svg"
          alt=""
          aria-hidden="true"
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">
          {isWorldwide
            ? "Data in the US + Global models"
            : "Data + Models hosted in the EU"}
        </p>
      </div>
      {selected && <Check className="ml-auto h-5 w-5 text-blue-500" />}
    </button>
  );
}

export function RegionSelectionModal() {
  const { isOpen, closeSignUpModal } = useSignUpModal();
  const [region, setRegion] = useState<Region>("us");

  const handleSave = () => {
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = appendUTMParams(getSignupUrlForRegion(region));
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeSignUpModal();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-8 pb-8 pt-12 shadow-xl focus:outline-none">
          <DialogPrimitive.Title className="mb-2 text-2xl font-semibold text-gray-900">
            Choose your region
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mb-6 text-sm text-gray-500">
            Select where your workspace data will be hosted and your models will
            run. This cannot be changed later.
          </DialogPrimitive.Description>

          <div className="flex flex-col gap-3">
            {(Object.keys(REGIONS) as Region[]).map((key) => (
              <RegionCard
                key={key}
                region={key}
                label={REGIONS[key].label}
                selected={region === key}
                onSelect={() => setRegion(key)}
              />
            ))}
          </div>

          {region === "eu" && (
            <p className="mt-2 text-sm text-gray-500">
              Models can cost up to 10% more credits in Europe
            </p>
          )}

          <div className="mt-8">
            <Button
              label="Continue"
              variant="highlight"
              size="md"
              onClick={handleSave}
              className="w-full"
            />
          </div>

          <DialogPrimitive.Close className="absolute right-4 top-4 rounded p-1 text-gray-400 transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
