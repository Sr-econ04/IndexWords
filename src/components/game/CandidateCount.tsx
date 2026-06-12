type CandidateCountProps = {
  current: number;
  total: number;
};

export function CandidateCount({ current, total }: CandidateCountProps) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold font-mono text-primary-600">
        {current.toLocaleString()}
      </span>
      <span className="text-sm text-gray-400">
        / {total.toLocaleString()}語
      </span>
    </div>
  );
}
