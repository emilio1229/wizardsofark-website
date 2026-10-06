import { Fragment, useMemo } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ServerActivityResponse, ActivityCell } from "@woa/shared";
import { woaTokens } from "../../theme/tokens";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Shift a UTC bucket into the visitor's local timezone.
 *
 * The API aggregates in UTC (so responses stay cacheable), which means a cell
 * is labelled `dow`/`hour` in UTC. A local day/hour can differ, so we rebuild
 * the grid by mapping every UTC slot to the local slot it actually falls in.
 * The sample counts carry over, and overlapping UTC slots are summed.
 */
function shiftGridToLocal(cells: ActivityCell[]): ActivityCell[] {
  const now = new Date();
  // January and July offsets catch both DST states for the current zone.
  const janOffset = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const julOffset = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
  // getTimezoneOffset is minutes *behind* UTC (UTC+1 → -60), so negate.
  const offsetHours = -Math.min(janOffset, julOffset) / 60;

  const shifted = new Map<string, ActivityCell>();

  for (const cell of cells) {
    if (cell.samples === 0) {
      continue;
    }
    const localHour = (cell.hour + offsetHours + 24) % 24;
    const dayShift =
      cell.hour + offsetHours >= 24 ? 1 : cell.hour + offsetHours < 0 ? -1 : 0;
    const localDow = (cell.dow + dayShift + 7) % 7;

    const key = `${localDow}:${localHour}`;
    const existing = shifted.get(key);
    if (existing) {
      const total = existing.samples + cell.samples;
      existing.avgPlayers =
        total > 0
          ? Math.round(
              ((existing.avgPlayers * existing.samples +
                cell.avgPlayers * cell.samples) /
                total) *
                10,
            ) / 10
          : 0;
      existing.samples = total;
    } else {
      shifted.set(key, { ...cell, dow: localDow, hour: localHour });
    }
  }

  // Emit a fully-populated 7x24 grid so the layout is stable.
  const grid: ActivityCell[] = [];
  for (let dow = 0; dow < 7; dow += 1) {
    for (let hour = 0; hour < 24; hour += 1) {
      grid.push(
        shifted.get(`${dow}:${hour}`) ?? {
          dow,
          hour,
          avgPlayers: 0,
          avgUtilization: null,
          samples: 0,
        },
      );
    }
  }
  return grid;
}

function cellColour(avgPlayers: number, peakAvg: number): string {
  if (avgPlayers <= 0 || peakAvg <= 0) {
    return alpha(woaTokens.colours.border.default, 0.35);
  }
  // Scale against this server's own busiest hour, not its player capacity.
  // A quiet 8/32 server still shows a clear pattern this way, whereas scaling
  // by capacity leaves every cell at the same barely-visible shade.
  const ratio = Math.min(1, avgPlayers / peakAvg);
  return alpha(woaTokens.colours.primary.main, 0.12 + ratio * 0.88);
}

type PeakSummary = {
  label: string;
  avgPlayers: number;
  samples: number;
} | null;

function findLocalPeak(
  grid: ActivityCell[],
  direction: "max" | "min",
): PeakSummary {
  const withData = grid.filter((cell) => cell.samples > 0);
  if (withData.length === 0) {
    return null;
  }
  const sorted = [...withData].sort((a, b) =>
    direction === "max"
      ? b.avgPlayers - a.avgPlayers
      : a.avgPlayers - b.avgPlayers,
  );
  const best = sorted[0];
  const hourLabel = `${String(best.hour).padStart(2, "0")}:00`;
  return {
    label: `${DAY_LABELS[best.dow]} ${hourLabel}`,
    avgPlayers: best.avgPlayers,
    samples: best.samples,
  };
}

type ServerActivityHeatmapProps = {
  activity: ServerActivityResponse;
  nowMs?: number;
};

export function ServerActivityHeatmap({
  activity,
}: ServerActivityHeatmapProps): JSX.Element {
  const grid = useMemo(
    () => shiftGridToLocal(activity.cells),
    [activity.cells],
  );
  const busiest = useMemo(() => findLocalPeak(grid, "max"), [grid]);
  const quietest = useMemo(() => findLocalPeak(grid, "min"), [grid]);
  // Colour scale reference: this server's busiest hour.
  const peakAvg = busiest?.avgPlayers ?? 0;

  const windowLabel = activity.since
    ? `${activity.windowDays} days`
    : "No history yet";

  if (activity.totalSamples === 0) {
    return (
      <Typography color="text.secondary">
        No activity history recorded yet. Patterns appear once the monitor has
        collected a few days of snapshots.
      </Typography>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
        <Box>
          <Typography
            variant="overline"
            color="text.muted"
            sx={{ letterSpacing: "0.1em" }}
          >
            PEAK TIME
          </Typography>
          <Typography variant="h5">{busiest?.label ?? "—"}</Typography>
          {busiest ? (
            <Typography variant="caption" color="text.muted">
              {busiest.avgPlayers} players on average
            </Typography>
          ) : null}
        </Box>
        <Box>
          <Typography
            variant="overline"
            color="text.muted"
            sx={{ letterSpacing: "0.1em" }}
          >
            QUIETEST
          </Typography>
          <Typography variant="h5">{quietest?.label ?? "—"}</Typography>
          {quietest ? (
            <Typography variant="caption" color="text.muted">
              {quietest.avgPlayers} players on average
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Box>
        {/*
         * CSS grid rather than fixed-pixel rows: 24 equal columns plus a label
         * column always fit the panel, so the heatmap never scrolls sideways.
         */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "36px repeat(24, minmax(0, 1fr))",
            gap: 0.35,
            alignItems: "center",
          }}
        >
          <Box />
          {Array.from({ length: 24 }, (_, hour) => (
            <Typography
              key={`h-${hour}`}
              variant="caption"
              color="text.muted"
              sx={{ textAlign: "center", fontSize: "0.6rem", lineHeight: 1 }}
            >
              {hour % 3 === 0 ? String(hour).padStart(2, "0") : ""}
            </Typography>
          ))}

          {DAY_LABELS.map((day, dow) => (
            <Fragment key={day}>
              <Typography
                variant="caption"
                color="text.muted"
                sx={{ fontSize: "0.65rem" }}
              >
                {day}
              </Typography>
              {grid
                .filter((cell) => cell.dow === dow)
                .sort((a, b) => a.hour - b.hour)
                .map((cell) => (
                  <Tooltip
                    key={`${dow}-${cell.hour}`}
                    title={
                      cell.samples === 0
                        ? `${day} ${String(cell.hour).padStart(2, "0")}:00 — no data`
                        : `${day} ${String(cell.hour).padStart(2, "0")}:00 — ${cell.avgPlayers} players avg · ${cell.samples} sample${cell.samples === 1 ? "" : "s"}`
                    }
                    arrow
                    disableInteractive
                  >
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1",
                        minHeight: 12,
                        borderRadius: 0.5,
                        bgcolor: cellColour(cell.avgPlayers, peakAvg),
                        border: `1px solid ${alpha(woaTokens.colours.border.default, 0.3)}`,
                      }}
                    />
                  </Tooltip>
                ))}
            </Fragment>
          ))}
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
      >
        <Typography variant="caption" color="text.muted">
          Low
        </Typography>
        {[0.12, 0.34, 0.56, 0.78, 1].map((step) => (
          <Box
            key={step}
            sx={{
              width: 14,
              height: 12,
              borderRadius: 0.5,
              bgcolor: alpha(woaTokens.colours.primary.main, step),
            }}
          />
        ))}
        <Typography variant="caption" color="text.muted">
          High
        </Typography>
      </Stack>

      <Typography variant="caption" color="text.muted">
        {activity.totalSamples.toLocaleString()} samples over {windowLabel} ·
        shown in your local time. Averages are per hour of the week; hover a
        cell to see how many readings it covers.
      </Typography>
    </Stack>
  );
}
