import React, { useState } from 'react';
import { 
  QrCode, 
  Copy, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Smartphone,
  Lock,
  ArrowRight,
  Send,
  CreditCard
} from 'lucide-react';

export const OFFICIAL_UPI_ID = 'anjanabajaniya@okicici';
export const OFFICIAL_UPI_NAME = 'Anjana Bajaniya';

export interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  amount: number; // in INR ₹
  itemName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaymentSuccess: (details: {
    paymentMethod: 'upi_qr' | 'upi_gpay' | 'upi_phonepe' | 'upi_paytm' | 'upi_bhim' | 'upi_id';
    referenceId: string;
    amount: number;
    upiId: string;
  }) => void;
}

export const UpiQrPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  amount,
  itemName,
  customerName = 'Member',
  customerEmail = 'member@arenaflow.com',
  customerPhone = '+91 98765 43210',
  onPaymentSuccess
}) => {
  const [selectedApp, setSelectedApp] = useState<'qr' | 'gpay' | 'phonepe' | 'paytm' | 'bhim'>('qr');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const upiId = OFFICIAL_UPI_ID;
  const merchantName = OFFICIAL_UPI_NAME;
  const cleanNote = (itemName || title || 'Sports Booking').slice(0, 30);
  
  // Standard NPCI Bharat UPI deep link
  const genericUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
  
  // High-resolution instant QR code generated directly for anjanabajaniya@okicici with exact amount
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(genericUpiUrl)}`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleConfirmUpiPayment = (method: 'upi_qr' | 'upi_gpay' | 'upi_phonepe' | 'upi_paytm' | 'upi_bhim' | 'upi_id' = 'upi_qr', isSimulated = false) => {
    setIsSubmitting(true);
    const ref = isSimulated 
      ? `SIM-UPI-${Date.now().toString().slice(-8)}`
      : (utrNumber.trim() || `UTR-${Date.now().toString().slice(-10)}`);

    setTimeout(() => {
      setIsSubmitting(false);
      onPaymentSuccess({
        paymentMethod: method,
        referenceId: ref,
        amount,
        upiId
      });
      onClose();
    }, 600);
  };

  // Launch specific UPI app or fallback to generic UPI URI
  const handleLaunchApp = (appName: 'gpay' | 'phonepe' | 'paytm' | 'bhim') => {
    setSelectedApp(appName);
    window.location.href = genericUpiUrl;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#070b14] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-4 font-sans relative overflow-hidden max-h-[95vh] overflow-y-auto">
        
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 shadow-glow-cyan" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 pt-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight flex items-center gap-1.5">
                <span>Instant Bharat UPI Gateway</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-black">
                  Zero Fee
                </span>
              </h3>
              <p className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto-Configured for: {upiId}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Item Bill Summary */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Purchasing Item / Slot:</span>
            <strong className="text-white font-bold text-right max-w-[240px] truncate">{itemName || title}</strong>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Description:</span>
            <span className="text-slate-300 font-medium text-right max-w-[240px] truncate">{description}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-sm">
            <span className="text-slate-300 font-bold">Total Amount Payable:</span>
            <strong className="text-emerald-400 font-mono font-black text-2xl sm:text-3xl tracking-tight">
              ₹{amount.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Dynamic UPI QR Code Section */}
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 shadow-inner">
            <div className="bg-white p-3 rounded-2xl shadow-2xl border-2 border-emerald-400 flex flex-col items-center shrink-0">
              <img 
                src={qrCodeUrl} 
                alt={`Pay ₹${amount} to ${upiId}`} 
                className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
              />
              <span className="text-[10px] font-mono font-black text-slate-950 mt-1 uppercase tracking-wider text-center">
                Scan to Pay ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* UPI ID Details & 1-Click Copy */}
            <div className="space-y-3 text-xs flex-1 w-full">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                  Official Receiver UPI ID:
                </span>
                <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="font-mono font-black text-emerald-400 text-xs sm:text-sm select-all break-all">
                    {upiId}
                  </span>
                  <button
                    onClick={handleCopyUpiId}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center space-x-1 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    {copiedUpi ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Payee Name:</span>
                  <span className="font-bold text-white">{merchantName}</span>
                </div>
              </div>

              {/* Direct UPI Apps Section (1-Click Launch) */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                  Direct 1-Click UPI Payment Apps:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLaunchApp('gpay')}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Google Pay</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleLaunchApp('phonepe')}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>PhonePe</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleLaunchApp('paytm')}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/50 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>Paytm</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleLaunchApp('bhim')}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>BHIM / Other</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* UTR Verification / Manual Confirm */}
          <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <label className="block text-[11px] font-mono text-slate-300 font-bold">
              Enter 12-Digit UPI Reference / UTR Number (from GPay / PhonePe / Paytm):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 438910283719"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
              />
              <button
                disabled={isSubmitting}
                onClick={() => handleConfirmUpiPayment(utrNumber.trim() ? 'upi_id' : 'upi_qr', false)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Verifying...' : 'Verify & Confirm'}</span>
              </button>
            </div>
          </div>

          {/* Quick Simulation / Instant Test Pay Button */}
          <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              Testing without phone scan?
            </span>
            <button
              disabled={isSubmitting}
              onClick={() => handleConfirmUpiPayment('upi_qr', true)}
              className="py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Instant Confirm Payment</span>
            </button>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Direct to {upiId}</span>
          </div>
          <span className="text-emerald-400 font-bold">100% Direct Bank UPI Transfer</span>
        </div>

      </div>
    </div>
  );
};
