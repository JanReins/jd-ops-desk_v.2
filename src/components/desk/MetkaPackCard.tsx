import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { formatMelbourneMonthYear, getMelbourneCurrentPeriod } from "@/lib/ops/dates";
import { listMetkaPacks, METKA_ENTITIES, type MetkaPack } from "@/lib/ops/metka";
import type { Obligation } from "@/lib/ops/types";
import { formatPeriod } from "@/lib/ops/types";

function packLine(pack: MetkaPack): string {
  const bits = [`${pack.done}/${METKA_ENTITIES.length} done`];
  if (pack.missing > 0) bits.push(`${pack.missing} not opened`);
  if (pack.ready > 0) bits.push(`${pack.ready} ready to lodge`);
  if (pack.mine > 0) bits.push(`${pack.mine} my court`);
  return bits.join(" · ");
}

export function MetkaPackCard({ obligations }: { obligations: Obligation[] }) {
  const current = getMelbourneCurrentPeriod();
  const packs = listMetkaPacks(obligations);
  const currentPack = packs.find((p) => p.periodStart === current);
  const leftover = packs.filter((p) => p.periodStart < current && p.open > 0);
  if (!currentPack && leftover.length === 0) return null;

  return (
    <div className="rounded-lg border border-line bg-surface p-3 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-accent" />
            <p className="text-xs font-semibold text-ink">Metka entity pack</p>
          </div>
          <p className="mt-0.5 text-2xs text-muted">
            One client · {METKA_ENTITIES.length} entities · monthly BAS on Trackers, not 20 extra clients
          </p>
        </div>
        <Link
          to="/trackers"
          search={{ stream: "metka_bas" }}
          className="inline-flex min-h-9 items-center rounded-md border border-line bg-raised px-3 text-2xs font-semibold text-ink hover:border-accent hover:text-accent"
        >
          Open tracker
        </Link>
      </div>
      <div className="mt-2 space-y-1.5">
        {currentPack ? (
          <div className="rounded-md border border-line bg-paper px-2.5 py-1.5 text-2xs text-ink">
            <span className="font-semibold">{formatMelbourneMonthYear(current)}</span>
            <span className="text-muted"> · {packLine(currentPack)}</span>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-line bg-paper px-2.5 py-1.5 text-2xs text-muted">
            {formatMelbourneMonthYear(current)} pack not opened yet — use Trackers.
          </div>
        )}
        {leftover.map((pack) => (
          <div
            key={pack.periodStart}
            className="rounded-md border border-warn/30 bg-warn-soft px-2.5 py-1.5 text-2xs text-warn"
          >
            <span className="font-semibold">{formatPeriod(pack.periodStart)} leftover</span>
            <span> · {packLine(pack)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
