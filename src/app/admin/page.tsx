"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FACTORY_ADDRESS, FACTORY_ABI, USDC_ADDRESS } from "@/lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const { address, isConnected } = useAccount();

  // Read the owner from the contract
  const { data: ownerAddress, isLoading: isLoadingOwner } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "owner",
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("Politics");
  const [imageUrl, setImageUrl] = useState("");
  const [endDate, setEndDate] = useState("");

  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!question || !category || !imageUrl || !endDate) {
      setFormError("All fields are required.");
      return;
    }

    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
    if (endTimestamp <= Math.floor(Date.now() / 1000)) {
      setFormError("End date must be in the future.");
      return;
    }

    try {
      writeContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: "createMarket",
        args: [
          USDC_ADDRESS,
          address, // _resolver
          question,
          imageUrl,
          category,
          BigInt(endTimestamp),
        ],
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Reset form on success
  useEffect(() => {
    if (isConfirmed) {
      setQuestion("");
      setImageUrl("");
      setEndDate("");
      // keep category the same for convenience
    }
  }, [isConfirmed]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <ShieldAlert className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Admin Access Required</h1>
        <p className="text-muted-foreground">Please connect your authorized wallet to continue.</p>
        <ConnectButton />
      </div>
    );
  }

  if (isLoadingOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying permissions...</p>
      </div>
    );
  }

  if (ownerAddress && address && (ownerAddress as string).toLowerCase() !== address.toLowerCase()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center max-w-md mx-auto">
        <div className="rounded-full bg-destructive/10 p-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          Your connected wallet (<span className="font-mono text-xs text-foreground bg-muted px-1 py-0.5 rounded">{address}</span>) 
          is not authorized to create markets. Only the contract owner can access this dashboard.
        </p>
        <div className="pt-4">
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Create new prediction markets directly on the Polygon blockchain.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <h2 className="font-semibold text-lg">Create New Market</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Market Question</label>
            <input
              type="text"
              placeholder="e.g. Will Burna Boy win a Grammy in 2025?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none"
              >
                <option value="Politics">Politics</option>
                <option value="Sports">Sports</option>
                <option value="Nollywood">Nollywood</option>
                <option value="Afrobeats">Afrobeats</option>
                <option value="Economy">Economy</option>
                <option value="Weather">Weather</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">End Date</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
            {imageUrl && (
              <div className="mt-3 h-32 w-32 overflow-hidden rounded-lg border border-border relative bg-muted flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          {formError && (
            <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {formError}
            </div>
          )}

          {writeError && (
            <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              Transaction failed or was rejected.
            </div>
          )}

          {isConfirmed && (
            <div className="flex items-center text-sm text-yes bg-yes/10 p-3 rounded-lg border border-yes/20">
              <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
              Market created successfully! It is now live on the blockchain.
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isPending || isConfirming}
              className="w-full md:w-auto px-8 py-3 rounded-lg bg-primary font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {(isPending || isConfirming) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? "Confirm in Wallet..." : "Creating Market..."}
                </>
              ) : (
                "Create Market"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
