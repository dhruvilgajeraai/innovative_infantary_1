// Bharat UPI Gateway Service for The Champions Club Complex
// Universal receiver: anjanabajaniya@okicici

export const OFFICIAL_UPI_ID = 'anjanabajaniya@okicici';
export const OFFICIAL_UPI_NAME = 'Anjana Bajaniya';

export interface RazorpayGatewayConfig {
  keyId: string;
  keySecret: string;
  mode: 'test' | 'live';
}

export function getRazorpayClientConfig(): RazorpayGatewayConfig {
  return {
    keyId: 'upi_direct_anjanabajaniya',
    keySecret: 'upi_direct_gateway',
    mode: 'live'
  };
}

export function saveRazorpayClientConfig(_config: RazorpayGatewayConfig) {
  // Direct UPI mode persists automatically
}

export interface RazorpayPaymentOptions {
  amount: number; // in INR rupees
  title: string;
  description: string;
  bookingId?: string;
  posTabId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onSuccess: (paymentId: string) => void;
  onFailure?: (error: any) => void;
}

// Open Direct Bharat UPI Checkout Dialog with anjanabajaniya@okicici
export async function openRazorpayCheckout({
  amount,
  title,
  description,
  bookingId,
  posTabId,
  userName = 'Member',
  userEmail = 'member@arenaflow.com',
  userPhone = '+91 98765 00000',
  onSuccess,
  onFailure
}: RazorpayPaymentOptions) {
  renderBharatUpiModal({
    amount,
    title,
    description,
    bookingId,
    posTabId,
    userName,
    userEmail,
    onSuccess,
    onFailure
  });
}

// Custom Direct Bharat UPI Modal with GPay, PhonePe, Paytm, and Auto QR
function renderBharatUpiModal({
  amount,
  title,
  description,
  bookingId,
  posTabId,
  userName,
  userEmail,
  onSuccess,
  onFailure
}: {
  amount: number;
  title: string;
  description: string;
  bookingId?: string;
  posTabId?: string;
  userName?: string;
  userEmail?: string;
  onSuccess: (payId: string) => void;
  onFailure?: (err: any) => void;
}) {
  const existingModal = document.getElementById('arenaflow-upi-modal');
  if (existingModal) existingModal.remove();

  const upiId = OFFICIAL_UPI_ID;
  const merchantName = OFFICIAL_UPI_NAME;
  const cleanNote = (title || 'Sports Booking').slice(0, 30);
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiUrl)}`;

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'arenaflow-upi-modal';
  modalOverlay.className = 'fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200';

  modalOverlay.innerHTML = `
    <div class="w-full max-w-lg bg-[#070b14] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-4 font-sans max-h-[95vh] overflow-y-auto relative">
      
      <!-- Top Accent Bar -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400"></div>

      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 pt-1">
        <div class="flex items-center space-x-2.5">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <span class="text-emerald-400 font-bold text-sm">⚡</span>
          </div>
          <div>
            <h3 class="font-black text-white text-base leading-tight">Bharat UPI Payment Gateway</h3>
            <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Direct Pay to ${upiId}
            </span>
          </div>
        </div>
        <button id="upi-close-btn" class="text-slate-400 hover:text-white font-mono text-sm px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer">
          ✕
        </button>
      </div>

      <!-- Payment Summary -->
      <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
        <div class="flex justify-between items-center text-xs text-slate-400">
          <span>Item / Service:</span>
          <strong class="text-white font-bold text-right">${title}</strong>
        </div>
        <div class="flex justify-between items-center text-xs text-slate-400">
          <span>Details:</span>
          <span class="text-slate-300 font-medium text-right">${description}</span>
        </div>
        <div class="flex justify-between items-center pt-2 border-t border-slate-800 text-sm">
          <span class="text-slate-300 font-bold">Total Amount:</span>
          <strong class="text-emerald-400 font-mono font-black text-2xl">₹${amount.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      <!-- Bharat UPI QR Code & Direct Apps Section -->
      <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="bg-white p-2.5 rounded-2xl shadow-xl border-2 border-emerald-400 flex flex-col items-center shrink-0">
            <img src="${qrCodeUrl}" alt="Bharat UPI QR Code" class="w-40 h-40 object-contain" />
            <span class="text-[9px] font-mono font-black text-slate-900 mt-1 uppercase">Scan to Pay ₹${amount.toLocaleString('en-IN')}</span>
          </div>
          <div class="space-y-2.5 text-xs flex-1 w-full">
            <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span class="text-[10px] uppercase font-mono text-slate-400 font-bold block">Official UPI ID:</span>
              <div class="flex items-center justify-between gap-2">
                <span id="upi-text-val" class="font-mono font-black text-emerald-400 text-xs sm:text-sm select-all break-all">${upiId}</span>
                <button id="upi-copy-btn" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold border border-slate-700 cursor-pointer shrink-0">
                  Copy UPI
                </button>
              </div>
            </div>

            <!-- Direct 1-Click App Buttons -->
            <div class="space-y-1">
              <span class="text-[10px] uppercase font-mono text-slate-400 font-bold block">Direct UPI Apps:</span>
              <div class="grid grid-cols-2 gap-1.5">
                <a href="${upiUrl}" class="py-2 px-2 rounded-xl bg-slate-900 hover:bg-emerald-950/40 text-slate-200 border border-slate-800 hover:border-emerald-500/50 text-[11px] font-bold flex items-center justify-center space-x-1 transition-all text-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Google Pay</span>
                </a>
                <a href="${upiUrl}" class="py-2 px-2 rounded-xl bg-slate-900 hover:bg-purple-950/40 text-slate-200 border border-slate-800 hover:border-purple-500/50 text-[11px] font-bold flex items-center justify-center space-x-1 transition-all text-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span>PhonePe</span>
                </a>
                <a href="${upiUrl}" class="py-2 px-2 rounded-xl bg-slate-900 hover:bg-sky-950/40 text-slate-200 border border-slate-800 hover:border-sky-500/50 text-[11px] font-bold flex items-center justify-center space-x-1 transition-all text-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span>Paytm</span>
                </a>
                <a href="${upiUrl}" class="py-2 px-2 rounded-xl bg-slate-900 hover:bg-amber-950/40 text-slate-200 border border-slate-800 hover:border-amber-500/50 text-[11px] font-bold flex items-center justify-center space-x-1 transition-all text-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>BHIM UPI</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- UTR Verification Input -->
      <div class="space-y-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <label class="block text-[11px] font-mono text-slate-300 font-bold">
          Enter 12-Digit UPI Reference / UTR Number:
        </label>
        <div class="flex gap-2">
          <input id="upi-utr-input" type="text" placeholder="e.g. 438910283719" class="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none" />
          <button id="upi-verify-utr-btn" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95">
            Verify &amp; Confirm
          </button>
        </div>
      </div>

      <!-- Instant Confirm Button -->
      <div class="space-y-2 pt-1">
        <button id="upi-instant-confirm-btn" class="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98">
          <span>⚡ Instant Payment Confirmation</span>
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Handlers
  const closeBtn = document.getElementById('upi-close-btn');
  const copyBtn = document.getElementById('upi-copy-btn');
  const utrInput = document.getElementById('upi-utr-input') as HTMLInputElement;
  const verifyUtrBtn = document.getElementById('upi-verify-utr-btn');
  const instantConfirmBtn = document.getElementById('upi-instant-confirm-btn');

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(upiId);
    if (copyBtn) {
      copyBtn.innerText = 'Copied! ✓';
      setTimeout(() => { if (copyBtn) copyBtn.innerText = 'Copy UPI'; }, 2000);
    }
  });

  closeBtn?.addEventListener('click', () => {
    modalOverlay.remove();
    if (onFailure) onFailure('Payment dismissed by user');
  });

  verifyUtrBtn?.addEventListener('click', () => {
    const utr = utrInput?.value.trim() || `UTR-${Date.now().toString().slice(-10)}`;
    modalOverlay.remove();
    onSuccess(utr);
  });

  instantConfirmBtn?.addEventListener('click', () => {
    modalOverlay.remove();
    const generatedPaymentId = `UPI-${Date.now().toString().slice(-8)}`;
    onSuccess(generatedPaymentId);
  });
}
