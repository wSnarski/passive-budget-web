import { usePlaidLinkFlow } from '../../hooks/usePlaidLink';

interface Props {
  onSuccess: () => void;
}

export default function PlaidLinkButton({ onSuccess }: Props) {
  const { open, loading, error } = usePlaidLinkFlow(onSuccess);

  return (
    <div>
      <button
        onClick={() => open()}
        disabled={loading}
        className="w-full bg-indigo-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Connecting...' : '+ Link Bank Account'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
