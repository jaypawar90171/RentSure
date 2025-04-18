import { useState } from "react";
import { Button } from "../components/ui/button";
import { Link2, Wallet } from "lucide-react";
import { toast } from "sonner";

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = () => {
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 14) + "...";
      setWalletAddress(mockAddress);
      setIsConnected(true);
      toast.success("Wallet connected successfully!");
    }, 1000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    toast.info("Wallet disconnected");
  };

  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="truncate max-w-[120px]">{walletAddress}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectWallet}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connectWallet} 
          className="bg-rentsure-600 hover:bg-rentsure-700 text-white"
          size="sm"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}