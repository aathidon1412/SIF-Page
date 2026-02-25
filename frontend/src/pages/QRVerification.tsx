import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { API_BASE } from '../services/api';
import toast from 'react-hot-toast';

interface VerificationResult {
  valid: boolean;
  status: 'valid' | 'invalid' | 'expired' | 'not_yet_valid' | 'not_approved' | 'error';
  message: string;
  bookingInfo?: {
    id: string;
    itemTitle: string;
    itemType: string;
    userName: string;
    userEmail: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    purpose: string;
    verificationCount: number;
  };
}

export default function QRVerification() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader';

  const startScanner = async () => {
    try {
      if (scannerRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );

      setScanning(true);
      toast.success('Scanner started. Point camera at QR code.');
    } catch (err: any) {
      console.error('Scanner start error:', err);
      toast.error(err.message || 'Failed to start scanner. Please check camera permissions.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Scanner stop error:', err);
      }
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code scanned:', decodedText);
    await stopScanner();
    await verifyToken(decodedText);
  };

  const onScanError = (errorMessage: string) => {
    if (!errorMessage.includes('NotFoundException')) {
      console.warn('QR Scan error:', errorMessage);
    }
  };

  const verifyToken = async (token: string) => {
    setIsVerifying(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/verify/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data: VerificationResult = await response.json();
      setResult(data);

      if (data.valid) {
        toast.success('Booking verified successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorResult: VerificationResult = {
        valid: false,
        status: 'error',
        message: 'Failed to verify booking. Please try again.',
      };
      setResult(errorResult);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScanner();
      }
    };
  }, []);

  const resetScanner = () => {
    setResult(null);
    startScanner();
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'valid':
        return { color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: '✓', title: 'Valid Booking' };
      case 'expired':
        return { color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', icon: '⏰', title: 'Expired' };
      case 'not_yet_valid':
        return { color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: '⏳', title: 'Not Yet Valid' };
      case 'not_approved':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', icon: '⚠️', title: 'Not Approved' };
      default:
        return { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: '✗', title: 'Invalid' };
    }
  };

  const statusDisplay = result ? getStatusDisplay(result.status) : null;

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <div className="bg-blue-950 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Booking Verification</h1>
            </div>
          </div>
          <p className="text-center text-blue-100 mt-2">Scan QR codes to verify facility bookings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-blue-950 hover:bg-blue-950 hover:text-white font-medium transition-colors border-2 border-blue-950 px-4 py-2 rounded-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              {!scanning && !result && (
                <button onClick={startScanner} className="px-8 py-3 bg-blue-950 text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors shadow-lg">Start Scanner</button>
              )}
              {scanning && (
                <button onClick={stopScanner} className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg">Stop Scanner</button>
              )}
              {result && !scanning && (
                <button onClick={resetScanner} className="px-8 py-3 bg-blue-950 text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors shadow-lg">Scan Another</button>
              )}
            </div>

            <div className="flex justify-center">
              <div id={qrCodeRegionId} className={`${scanning ? 'border-2 border-blue-950' : ''} rounded-lg overflow-hidden`} style={{ width: '100%', maxWidth: '500px' }} />
            </div>

            {isVerifying && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-950 border-t-transparent"></div>
                <p className="mt-4 text-gray-700 font-medium">Verifying booking...</p>
              </div>
            )}
          </div>
        </div>

        {result && !isVerifying && statusDisplay && (
          <div className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border-2 rounded-2xl shadow-lg p-6 mb-6`}>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{statusDisplay.icon}</div>
              <h2 className={`text-3xl font-bold ${statusDisplay.color}`}>{statusDisplay.title}</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
              <p className="text-gray-700 text-center text-lg">{result.message}</p>
            </div>

            {result.valid && result.bookingInfo && (
              <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-3">
                <h3 className="text-xl font-bold text-blue-950 mb-4 border-b pb-2">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Booking ID</p>
                    <p className="text-gray-900 font-mono text-sm">{result.bookingInfo.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Item</p>
                    <p className="text-gray-900 font-semibold">{result.bookingInfo.itemTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Type</p>
                    <p className="text-gray-900 capitalize">{result.bookingInfo.itemType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">User Name</p>
                    <p className="text-gray-900">{result.bookingInfo.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900 text-sm">{result.bookingInfo.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Start</p>
                    <p className="text-gray-900">{result.bookingInfo.startDate} {result.bookingInfo.startTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">End</p>
                    <p className="text-gray-900">{result.bookingInfo.endDate} {result.bookingInfo.endTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Verification Count</p>
                    <p className="text-gray-900">{result.bookingInfo.verificationCount}</p>
                  </div>
                </div>

                {result.bookingInfo.purpose && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 font-medium">Purpose</p>
                    <p className="text-gray-900">{result.bookingInfo.purpose}</p>
                  </div>
                )}
              </div>
            )}

            {!result.valid && result.bookingInfo && (
              <div className="bg-white rounded-lg border border-gray-100 p-4 mt-4">
                <h3 className="text-lg font-bold text-blue-950 mb-2">Booking Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Item:</span> {result.bookingInfo.itemTitle}</p>
                  <p><span className="font-medium">User:</span> {result.bookingInfo.userName}</p>
                  <p><span className="font-medium">Status:</span> {result.status.replace('_', ' ')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!scanning && !result && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-blue-950 mb-4">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Start Scanner" to activate the camera</li>
              <li>Point the camera at a booking QR code</li>
              <li>The system will automatically scan and verify the booking</li>
              <li>View the verification result and booking details</li>
              <li>Click "Scan Another" to verify additional bookings</li>
            </ol>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-900"><strong>Note:</strong> You can verify bookings starting 30 minutes before their scheduled time. Each scan is logged for security purposes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
