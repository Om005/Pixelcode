import { Box, Lock, Search, Settings, Sparkles, Users2 } from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";

export function GlowingEffectDemo() {
  return (
    <ul className="p-10 grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Box className="h-4 w-4 text-neutral-400" />}
        title="Run Any Programming Language"
        description="Seamlessly execute code in over 10+ languages with blazing-fast performance."
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Settings className="h-4 w-4 text-neutral-400" />}
        title="Multiple Themes"
        description="Choose from vibrant themes to create your perfect coding atmosphere."
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-4 w-4 text-neutral-400" />}
        title="Guest & Authenticated Access"
        description="Explore as a guest or unlock premium features as an authenticated user."
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4 text-neutral-400" />}
        title="AI Chatbot Support"
        description="Chat with an AI-powered assistant to resolve your coding doubts instantly."
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Users2 className="h-4 w-4 text-neutral-400" />}
        title="Real-Time Collaboration"
        description="Create or join live coding rooms with instant code sync and admin controls for managing participants."
      />
    </ul>
  );
}

const GridItem = ({ area, icon, title, description }) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance md:text-2xl/[1.875rem] text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
